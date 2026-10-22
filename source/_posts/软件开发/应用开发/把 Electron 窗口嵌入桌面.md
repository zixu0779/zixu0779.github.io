---
title: 把 Electron 窗口嵌入桌面
date: 2026-10-20 19:30:03
updated: 2026-10-20 20:27:22
categories: [["软件开发", "应用开发"]]
tags: ["Electron", "Node.js", "C++", "npm", "Windows"]
---

做[桌面一言](/软件开发/应用开发/桌面一言：Sentences-Desktop/)时，我希望能把一言窗口直接放在 Windows 桌面上。为此写了插件 [electron-addtodesktop](https://github.com/noneSycamore/electron-addtodesktop)，把桌面窗口操作封装成 `attach` 和 `detach` 两个接口，在 Electron 主进程中调用。

这个扩展由 JavaScript 和 C++ 两部分组成。下面从窗口句柄的传递开始，整理桌面嵌入的实现，以及把原生扩展做成 npm 包时需要处理的内容。

<!-- more -->

## 想实现的效果

桌面一言的主窗口没有边框，背景透明，也不显示在任务栏里。但这些配置只决定窗口的外观，还需要处理它与 Windows 桌面之间的关系。

`attach(win)` 做的就是这一步：找到桌面对应的窗口，再将 Electron 窗口设置为它的子窗口。需要解除挂接时，调用 `detach(win)`。

这个实现选择的层级会遮挡桌面图标，同时保留窗口的鼠标交互。
如果只是想把内容作为壁纸放在图标后面，就不能直接照搬这个层级。但如果选择壁纸的层级，就做不到与窗口的交互了。

![桌面一言窗口界面](https://res.cloudinary.com/sycamore/image/upload/v1792495537/Typora/2026/10/20/sentences-desktop-original.png)

## 从 JavaScript 传入窗口句柄

项目的主要文件不多：

```text
index.js                 JavaScript 入口
lib/addtoDesktop.cpp     Windows 窗口操作
binding.gyp              原生模块编译配置
package.json             包信息、依赖和安装脚本
test/index.js            Electron 调用示例
```

调用者传入的是 Electron 的 `BrowserWindow`，C++ 需要的则是 Windows 窗口句柄。因此 JavaScript 入口先取得句柄，再交给原生模块。

下面是 `index.js` 中的 `attach`：

```javascript
const bindings = require("bindings")("electron-addtoDesktop");

const attach = (win) => {
    if (win === undefined) {
        throw Error("You need to pass a window");
    }
    if (typeof win.getNativeWindowHandle !== "function") {
        throw Error("You need to pass a window of type Electron.BrowserWindow");
    }
    bindings.attach(win.getNativeWindowHandle());
};
```

[`getNativeWindowHandle()`](https://www.electronjs.org/docs/latest/api/browser-window#wingetnativewindowhandle) 返回一个 `Buffer`，在 Windows 中对应 `HWND`。这里不能把它当成普通编号随意转换为 JavaScript 数字，而是将它直接传到 C++，按对应平台的原生句柄读取。

C++ 使用 `node-addon-api` 接收参数：

```cpp
Napi::Buffer<void *> wndHandle = info[0].As<Napi::Buffer<void *>>();
HWND win = static_cast<HWND>(
    *reinterpret_cast<void **>(wndHandle.Data())
);
```

这样就取得了后续 Windows API 需要的 `HWND`。数据传递的顺序是：

```text
BrowserWindow → getNativeWindowHandle() → Buffer → HWND
```

`detach` 也使用同样的传递方式，只是交给原生模块的另一个函数。

## 找到桌面窗口

取得句柄后，接下来需要确定把窗口放在哪里。

这里会用到三个 Windows 外壳中的窗口类名。窗口不一定带有标题栏，也可以作为其他窗口或控件的容器：

- `Progman`：Program Manager 窗口的类名，是这段代码查找桌面结构的入口。代码先找到它，再寻找合适的挂接位置。
- `WorkerW`：外壳使用的一类工作窗口，可以承担桌面内容的承载工作。同名窗口可能有多个，因此不能找到一个就直接使用。
- `SHELLDLL_DefView`：外壳的文件夹视图窗口类名。在桌面场景中，它承载桌面图标所在的视图。这里用它判断某个 `WorkerW` 是否包含桌面图标层。

这里代码寻找的是包含图标视图的 `WorkerW`，再把自己的窗口挂到它下面。不同 Windows 版本的[桌面窗口层级可能变化](https://github.com/lively-community/lively/discussions/3004)，下面按这个项目的实现说明。

代码先寻找 `Progman` 窗口，再通过 `EnumWindows` 枚举顶层窗口，查找类名为 `WorkerW`、并包含 `SHELLDLL_DefView` 子窗口的对象，把它作为挂接目标。如果没有找到符合条件的 `WorkerW`，目标仍保留为前面取得的 `Progman`。

找到目标 `WorkerW` 时，挂接后的桌面结构是这样的：

```text
WorkerW
├─ Electron 窗口
└─ SHELLDLL_DefView
Progman
```

找到目标后，核心调用只有一行：

```cpp
SetParent(win, insert_hWnd);
```

解除挂接时，将 [`SetParent`](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setparent) 的第二个参数设为 `NULL`，让桌面窗口成为新的父窗口：

```cpp
SetParent(win, NULL);
```

因此，这里的 `detach` 只是让窗口脱离前面选中的 `WorkerW` 或 `Progman`。它没有保存并恢复挂接前的全部窗口状态，也不会替应用处理后续布局。

最后，将 C++ 函数导出给 JavaScript：

```cpp
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("attach", Napi::Function::New(env, Attach));
    exports.Set("detach", Napi::Function::New(env, Detach));
    return exports;
}

NODE_API_MODULE(addtoDesktop, Init)
```

这样，JavaScript 中的 `bindings.attach()` 和 `bindings.detach()` 就分别对应了原生模块里的两个函数。

## 编译和调用

### 编译配置

`binding.gyp` 指定了编译目标、源文件和 `node-addon-api` 的依赖，主要部分如下：

```json
{
  "targets": [{
    "target_name": "electron-addtoDesktop",
    "sources": ["lib/addtoDesktop.cpp"],
    "include_dirs": [
      "<!@(node -p \"require('node-addon-api').include\")"
    ],
    "dependencies": [
      "<!(node -p \"require('node-addon-api').gyp\")"
    ],
    "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"]
  }]
}
```

这是主要字段的摘录，完整配置以仓库文件为准。这里的目标名称是 `electron-addtoDesktop`，需要与 `bindings` 加载的名称对应；npm 安装时使用的包名则是全小写的 `electron-addtodesktop`。

`package.json` 中配置了安装脚本：

```json
{
  "main": "index.js",
  "scripts": {
    "install": "node-gyp configure rebuild"
  }
}
```

因此，这个包需要在安装环境中编译 C++ 源码，不是只下载一段 JavaScript。它直接使用 Windows API，下面的编译和调用按 Windows 环境准备。根据 [node-gyp 的安装说明](https://github.com/nodejs/node-gyp#on-windows)，需要 Python 和 Visual C++ 构建工具。

Electron 的原生模块还需要注意目标版本和架构。出现加载或构建不匹配时，可以参照 [Electron 的原生模块说明](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules)，使用 `@electron/rebuild` 针对项目的 Electron 环境重新构建。

### 在 Electron 中调用

在 Electron 项目中安装：

```bash
npm install electron-addtodesktop
```

下面整理了一个最小调用示例。等 Electron 就绪、创建窗口后，再传给 `attach`：

```javascript
const { app, BrowserWindow } = require("electron");
const { attach, detach } = require("electron-addtodesktop");

let win;

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 350,
        height: 200,
        frame: false,
        transparent: true,
        skipTaskbar: true
    });

    win.loadFile("index.html");
    attach(win);
});
```

`index.html` 换成自己的页面。无边框、透明背景和隐藏任务栏入口由 Electron 配置，扩展负责的是窗口挂接，两部分要分别处理。

需要解除挂接时，在窗口仍有效的情况下调用：

```javascript
detach(win);
```

## npm 扩展编写要点

窗口功能之外，还要让其他项目能正确安装和调用这个包。这里主要有几件事。

### 入口和接口保持简单

`package.json` 的 `main` 指向 `index.js`，由它加载原生模块并导出 `attach`、`detach`。调用者只需要传入 Electron 窗口，不必自己处理 `Buffer`、`HWND` 或原生文件的位置。

参数检查也应该放在边界上。现有 JavaScript 代码检查了参数是否为 `undefined`，以及是否提供 `getNativeWindowHandle` 方法，但这还不是完整校验。例如 `null`、已经销毁的窗口，以及直接进入 C++ 接口的错误参数，都需要分别处理。

现有 C++ 在调用 `SetParent` 后直接返回 `true`，如果继续维护此插件，可以补上上述的检查，并让 Windows API 失败时返回明确的错误。

### 区分使用依赖和开发依赖

仓库将 `bindings`、`node-addon-api` 放在 `dependencies` 中，Electron 放在 `devDependencies` 中。

前两者分别参与原生模块的加载和编译。Electron 用于这个仓库里的开发示例，实际应用则由调用方自己的 Electron 项目提供。不能因为某个依赖只在安装阶段使用，就直接认为它只属于开发环境。

### 检查实际发布的文件

这个包需要在安装时编译，因此不能只发布 `index.js`。`binding.gyp`、C++ 源文件，以及编译依赖的其他文件也必须进入包里。

可以先用 [`npm pack --dry-run`](https://docs.npmjs.com/cli/v11/commands/npm-pack/) 检查将被打入包中的文件：

```bash
npm pack --dry-run
```

确认后运行 `npm pack`，再在独立的最小 Electron 项目中通过 `npm install 路径/包名.tgz` 安装生成的包。这样可以发现“仓库里能运行，但发布包缺了文件”的问题，也能避免把临时文件和本地构建产物一起带进去。

需要限制发布内容时，可以在 `package.json` 中设置 [`files`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#files) 白名单，列出入口、`binding.gyp` 和源文件目录。README 和许可证也应随包提供。

## 使用限制

这个扩展使用 Windows API，不支持 macOS 和 Linux。桌面层级依赖 Windows 外壳的窗口结构，不适合把一个环境里的表现直接推广到所有系统版本。

它也没有实现完整的桌面生命周期管理。桌面外壳重启后的重新挂接、挂接失败后的恢复，还需要应用另行处理。

如果要继续用于实际应用，应先在目标环境中检查桌面图标、鼠标交互和窗口切换的表现，再决定是否沿用这种挂接方式。
