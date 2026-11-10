---
title: Embedding an Electron window in the Windows desktop
translation_id: embed-electron-desktop
source_digest: 660a0ba62af30a1f2f67a6027b81bd9e323b30358179d0fc3532a6d929247f80
tags:
  - Electron
  - Node.js
  - C++
  - npm
  - Windows
categories:
  - Software Development
  - App Development
sections: {"what-i-wanted-the-window-to-do": "想实现的效果", "passing-the-window-handle-from-javascript": "从-javascript-传入窗口句柄", "finding-the-desktop-window": "找到桌面窗口", "building-and-calling-the-extension": "编译和调用", "build-configuration": "编译配置", "using-it-in-electron": "在-electron-中调用", "packaging-the-npm-extension": "npm-扩展编写要点", "keep-the-entry-point-and-api-small": "入口和接口保持简单", "separate-install-and-development-dependencies": "区分使用依赖和开发依赖", "check-what-ships": "检查实际发布的文件", "limitations": "使用限制"}
---

While building [Sentences-Desktop](/en/软件开发/应用开发/桌面一言：Sentences-Desktop/), I wanted the quote window to sit directly on the Windows desktop. I wrote [electron-addtodesktop](https://github.com/noneSycamore/electron-addtodesktop) to expose two operations to the Electron main process: `attach` and `detach`.

The extension has a JavaScript side and a C++ side. Here’s how the window handle gets from one to the other, where the window ends up, and what went into shipping the native extension as an npm package.

<!-- more -->

## What I wanted the window to do

The quote window is frameless and transparent, with no taskbar entry. Those settings control how it looks. I also needed to establish its relationship with the Windows desktop.

`attach(win)` finds the appropriate desktop window and makes the Electron window its child. Call `detach(win)` to undo the attachment.

The layer I chose places the app in front of desktop icons and keeps mouse interaction working. For wallpaper behind the icons, you’d need a different layer; moving it there would also lose the interaction this arrangement provides.

![The Sentences-Desktop quote window](https://res.cloudinary.com/sycamore/image/upload/v1792696407/Typora/2026/09/sentences-desktop-original.png)

## Passing the window handle from JavaScript

The project has a handful of main files:

```text
index.js                 JavaScript entry point
lib/addtoDesktop.cpp     Windows window operations
binding.gyp              Native module build configuration
package.json             Package metadata, dependencies and install script
test/index.js            Example Electron application
```

The caller supplies an Electron `BrowserWindow`. The native code needs a Windows window handle, so the JavaScript entry point retrieves it and passes it across. Here is `attach` from `index.js`:

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

[`getNativeWindowHandle()`](https://www.electronjs.org/docs/latest/api/browser-window#wingetnativewindowhandle) returns a `Buffer` containing an `HWND` on Windows. Passing it through directly avoids converting a native handle to an ordinary JavaScript number.

On the C++ side, `node-addon-api` receives the argument:

```cpp
Napi::Buffer<void *> wndHandle = info[0].As<Napi::Buffer<void *>>();
HWND win = static_cast<HWND>(
    *reinterpret_cast<void **>(wndHandle.Data())
);
```

That gives us the `HWND` needed by the Windows API. The data flow is:

```text
BrowserWindow → getNativeWindowHandle() → Buffer → HWND
```

`detach` passes the handle the same way, to a different native function.

## Finding the desktop window

With the handle in hand, we need to decide where to attach the window. Three Windows shell class names matter here. A window can act as a container for controls or other windows without having a visible title bar.

- `Progman` is the Program Manager window class. The code starts here when looking for a suitable parent.
- `WorkerW` is a shell worker window class that can host desktop content. There can be several windows of this class.
- `SHELLDLL_DefView` is the shell folder view class. On the desktop it hosts the icon view; its presence tells us which worker contains the icons.

The extension looks for the worker that contains the icon view and makes the app window its child. The [desktop window hierarchy can vary between Windows versions](https://github.com/lively-community/lively/discussions/3004). This is the arrangement used by this project.

First the code finds `Progman`. Then it calls `EnumWindows` to enumerate top-level windows, looking for a `WorkerW` with a `SHELLDLL_DefView` child. If it can’t find one, the previously located `Progman` remains the target.

When it does find a suitable worker, the hierarchy after attachment looks like this:

```text
WorkerW
├─ Electron window
└─ SHELLDLL_DefView
Progman
```

Once the target is known, attachment takes one call:

```cpp
SetParent(win, insert_hWnd);
```

To detach, pass `NULL` as the second argument to [`SetParent`](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setparent). This makes the desktop window the new parent:

```cpp
SetParent(win, NULL);
```

This releases the window from the selected `WorkerW` or `Progman`. The extension doesn’t save and restore every aspect of the old window state. The application is responsible for subsequent layout.

Finally the module exposes the functions to JavaScript:

```cpp
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("attach", Napi::Function::New(env, Attach));
    exports.Set("detach", Napi::Function::New(env, Detach));
    return exports;
}

NODE_API_MODULE(addtoDesktop, Init)
```

The two exports correspond to `bindings.attach()` and `bindings.detach()`.

## Building and calling the extension

### Build configuration

The main parts of `binding.gyp` specify the target, source file and dependency on `node-addon-api`:

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

This is an excerpt; the full configuration is in the repository. The target name, `electron-addtoDesktop`, must match the name passed to `bindings`. The npm package name is lowercase: `electron-addtodesktop`.

The install script is in `package.json`:

```json
{
  "main": "index.js",
  "scripts": {
    "install": "node-gyp configure rebuild"
  }
}
```

Installation compiles C++ source on the target machine. The extension calls Windows APIs directly, so the build and usage notes here assume Windows. The [node-gyp setup instructions](https://github.com/nodejs/node-gyp#on-windows) list Python and the Visual C++ build tools as prerequisites.

For native Electron modules the target Electron version and architecture matter too. If the build or binary is incompatible, the [Electron native module guide](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules) explains how to rebuild against the project’s Electron environment with `@electron/rebuild`.

### Using it in Electron

Install the package in the Electron project:

```bash
npm install electron-addtodesktop
```

Here’s a minimal example. Wait for Electron to be ready and create the window before passing it to `attach`:

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

Replace `index.html` with your own page. Electron handles the frame, transparent background and taskbar entry. The extension handles attachment.

To detach, call the following while the window is still valid:

```javascript
detach(win);
```

## Packaging the npm extension

Other projects need to be able to install and call the package outside its development repository.

### Keep the entry point and API small

The `main` field in `package.json` points to `index.js`. That file loads the native module and exports `attach` and `detach`. Callers supply an Electron window without having to locate a native binary or handle a `Buffer` or `HWND` themselves.

Validate arguments at the boundary. The JavaScript code checks for `undefined` and the presence of `getNativeWindowHandle`. It doesn’t cover every case: `null`, destroyed windows and invalid arguments passed directly to the native interface all need attention.

The current C++ implementation returns `true` after calling `SetParent`. If I maintain it further, I’d add those checks and report Windows API failures explicitly.

### Separate install and development dependencies

The repository lists `bindings` and `node-addon-api` under `dependencies`, and Electron under `devDependencies`. The first two are needed to load and compile the native module respectively. Electron runs the development example; consumers supply it through their own applications. A dependency used only during installation can still be required by the end user.

### Check what ships

Because installation compiles the extension, the package needs `index.js`, `binding.gyp`, the C++ source and any other required build files.

Use [`npm pack --dry-run`](https://docs.npmjs.com/cli/v11/commands/npm-pack/) to inspect the package contents:

```bash
npm pack --dry-run
```

Then run `npm pack` and install the tarball in a separate minimal Electron project with `npm install path/to/package.tgz`. That catches missing files that are present in your checkout and helps keep temporary files and local build products out of the package.

To restrict the contents, use the [`files` field](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#files) to list the entry point, `binding.gyp` and source directories. Include the README and licence as well.

## Limitations

The extension uses Windows APIs and doesn’t support macOS or Linux. Attachment depends on the Windows shell’s window hierarchy, so behaviour on one version doesn’t establish how every release will behave.

The extension also leaves lifecycle management to the application, including reattachment after a shell restart and recovery from a failed attachment.

Before using it in an actual application, I’d check desktop icons, mouse interaction and window switching on the target system before deciding whether to keep this approach.
