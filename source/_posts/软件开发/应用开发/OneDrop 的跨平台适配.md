---
translation_id: onedrop-platforms
title: OneDrop 的跨平台适配
date: 2026-10-21 20:34:27
updated: 2026-10-29 02:54:42
categories: [["软件开发", "应用开发"]]
tags: ["OneDrop", "TypeScript", "Microsoft Graph", "Edge插件开发"]
---

[OneDrop](https://github.com/zixu0779/OneDrop) 最先是为了在 Edge 里传文件才做的。
用到手机上以后，消息列表和输入框都可以沿用，点开文件后的操作却要根据设备来改。
在电脑上我希望直接打开下载好的文件，在 iPhone 的 Edge 里则希望能调出系统分享菜单，自己选择用哪个应用接收。

之前的[上篇](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（上）/)和[下篇](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（下）/)写了这些消息怎样保存到 OneDrive，以及不同设备如何同步。
这里沿用 [OneDrop 1.0.3](https://github.com/zixu0779/OneDrop/releases/tag/v1.0.3)，接着说桌面 Edge、手机上的 Edge，以及独立安装的 iOS 应用各自要做哪些适配。

<!-- more -->

## 多端共用的代码结构

### 平台入口和共享包

OneDrop 的应用入口放在 `apps/` 下，桌面和手机上的 Edge 使用同一份扩展，独立的 iOS 应用则有自己的入口。
各端用到的界面、消息模型和 OneDrive 读写代码放在 `packages/` 下。主要目录如下：

| 目录 | 用途 |
| --- | --- |
| `apps/edge` | 桌面侧栏、移动端扩展页面和 iOS Edge 的适配 |
| `apps/ios` | 独立 iOS 应用的 WebView 入口和 Swift 插件 |
| `packages/ui` | React 消息列表、输入框和设置界面 |
| `packages/core` | 消息模型、设置类型和运行时请求协议 |
| `packages/platform` | 界面调用平台功能的接口，以及 OneDrive 代码所需的运行环境 |
| `packages/app-runtime` | 登录、设备设置和下载等应用服务 |
| `packages/extension-runtime` | Edge 扩展后台的请求分发和入口处理 |
| `packages/onedrive` | 通过 Microsoft Graph 读写消息块、归档和附件 |
| `packages/web-storage` | 使用 IndexedDB 保存缓存、待发送任务和下载记录 |

### 读取当月消息

打开 OneDrop 时，各端加载的都是 `packages/ui` 里的 React 界面。
以读取当月消息为例，消息列表只需发出这样一条请求：

```typescript
const response = await sendRequest({ type: "messages/read-current-month" });
```

这条请求能在几个平台使用，是因为每个入口都会先给界面装上自己的 `PlatformBridge`。
这里的桥接负责接收界面发来的请求，决定交给谁处理。请求的名称、参数和返回类型则统一定义在 `packages/core` 中。

- **Edge 扩展**通过 `browser.runtime.sendMessage` 把请求交给扩展后台。后台找到相应的处理函数，取当前 UTC 月份，调用 `readMonthDocument()` 读取消息。
- **独立 iOS 应用**通过 Capacitor 在应用内的 WebView 中加载这套界面。它没有扩展后台，桥接直接在应用内处理请求，从原生登录插件取得访问令牌，再交给 `readMonthDocumentWithAccessToken()` 读取同一个月份。

两边最终用到的月份读取代码都在 `packages/onedrive`。
界面收到的也是同一种 `messages/month` 响应，可以把消息交给同一份列表组件显示。以后修改消息块的读取规则时，只需要改这一处。

## Edge 扩展的入口和布局

扩展会根据 Edge 报告的平台信息和浏览器标识来选择入口。

### 桌面 Edge 的侧栏

桌面 Edge 提供侧栏接口时，OneDrop 会把工具栏图标设为侧栏入口。点击图标，消息列表就会显示在当前网页旁边。
我可以保留正在浏览的网页，把临时要发的文字和文件放进旁边的输入框。

![在 Edge 桌面浏览器的侧栏中打开 OneDrop](https://res.cloudinary.com/sycamore/image/upload/v1793199120/Typora/2026/10/28/onedrop-desktop.png)

### Android Edge 的标签页

在 Android Edge 上点击 OneDrop，扩展会打开独立的 `android-mobile.html` 标签页。
如果上次打开的 OneDrop 标签页还在，再点图标时就切回那一页。

![Android Edge 标签页中的 OneDrop 消息列表和底部浏览器地址栏](https://res.cloudinary.com/sycamore/image/upload/v1794818604/Typora/2026/10/29/onedrop-android-edge-messages.png)

### iOS Edge 的弹窗

iOS Edge 使用 `ios-mobile.html` 弹窗。
扩展清单里还声明了桌面的侧栏页面，因此侧栏入口也会检查一次平台。
即使浏览器从这个入口加载，只要识别为 iOS，就改用移动样式和 iOS Edge 对应的桥接。

弹窗展开后，消息列表和底部输入框如下图所示。

![iPhone 上的 OneDrop 消息列表与底部输入框](https://res.cloudinary.com/sycamore/image/upload/v1794743409/Typora/2026/10/29/onedrop-ios-edge-messages.png)

### 移动端键盘的弹出效果

在移动端 Edge 里，弹出软键盘的时候，屏幕上能看到的区域变小了，但窗口却还按原来的高度显示，底部的输入框就会被键盘挡住。
如果让浏览器按默认方式执行，虽然它会自主调整可见区域的位置，但其位置往往不精准。所以正确的做法是，在键盘弹出时获取相关的变动数据，并进行准确的调整。

而对于 iOS Edge 来说，情况会更加复杂一点。
因为 iOS Edge 用弹窗来展示 OneDrop 的内容，其弹窗有半高和全高两种状态，因此可见区域的大小也要动态获取。

![iOS Edge 中半高显示的 OneDrop 弹窗](https://res.cloudinary.com/sycamore/image/upload/v1794820657/Typora/2026/10/29/onedrop-ios-edge-half-height-popup.png)

这里用浏览器的 `visualViewport` 取得可见区域。
它的 `height` 表示当前可见区域的高度，`offsetTop` 表示可见区域顶部相对布局视口的偏移。
如果浏览器没有提供 `visualViewport`，就取 `window.innerHeight` 作为高度，顶部偏移按 0 处理。
每次可见区域发生变化，OneDrop 都会重新取值，四舍五入到整数像素后写入两个 CSS 变量。

```js
const viewport = window.visualViewport;
const height = viewport?.height ?? window.innerHeight;
const offsetTop = viewport?.offsetTop ?? 0;

const style = document.documentElement.style;
style.setProperty("--ios-edge-popup-height", `${Math.round(height)}px`);
style.setProperty("--ios-edge-popup-offset-top", `${Math.round(offsetTop)}px`);
```

弹窗根元素用这两个变量设置顶部位置和高度：

```css
top: var(--ios-edge-popup-offset-top, 0px);
height: var(--ios-edge-popup-height, 100dvh);
```

键盘弹出的动画还在进行时，可见高度可能继续变化。
因此输入框获得焦点后，弹窗会在接下来的半秒内分几次更新尺寸，并对仍然聚焦的输入框调用 `scrollIntoView({ block: "nearest" })`，让它留在可见范围内。

![键盘弹出后，OneDrop 的输入框仍位于键盘上方](https://res.cloudinary.com/sycamore/image/upload/v1794743413/Typora/2026/10/29/onedrop-ios-edge-keyboard.png)

## 账户和设备设置

### 登录窗口与令牌保存

在 Edge 扩展中点登录，OneDrop 优先使用浏览器提供的 `identity.launchWebAuthFlow` 打开 Microsoft 授权窗口、接收回调。
如果当前浏览器没有提供这个接口，就在临时标签页里完成授权。登录成功后，扩展把令牌保存在 `browser.storage.local` 中。
授权码和令牌的兑换过程可以参考[上篇的客户端授权流程](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（上）/#客户端授权流程)。

独立安装的 iOS 应用有自己的登录入口。
点同一个登录按钮时，应用会通过 Capacitor 调用 Swift 写的 `OneDropAuth` 插件，由它创建系统提供的 `ASWebAuthenticationSession`，打开 Microsoft 的登录页面。

登录完成后，系统根据应用登记的回调协议把结果交回插件。
插件先核对回调里的 `state` 是否与本次登录请求一致，再用授权码换取令牌，写入 iOS 的 Keychain（系统钥匙串）。
之后界面要读取 OneDrive 时，仍然向这个插件请求访问令牌，接近过期时也由插件负责刷新。

### 每台设备的设置

这些设备使用同一个 Microsoft 账户，也可以各自保留一份设置。
每次安装都会生成设备 ID，显示名称和偏好写在对应的 `settings/devices/<device-id>.json` 里。
以后换了手机，从设备列表移除旧设备时，清理的是它的设置，原来发送的消息和附件仍按[下篇的删除与恢复流程](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（下）/#删除标记与保留策略)处理。

![同一账户下的 OneDrop 设备列表与设置操作](https://res.cloudinary.com/sycamore/image/upload/v1794712894/Typora/2026/10/29/onedrop-platform-devices.png)

## 附件操作

假设我在电脑上发了一个文件，再到另一台设备上点这条消息。
各端拿到的都是同一个 OneDrive 文件标识 `driveItemId`，区别在于文件下载到哪里、接下来能用什么方式打开。
界面通过 `PlatformCapabilities` 读取当前平台支持的操作，再决定显示哪些按钮。

### 桌面 Edge 的浏览器下载

桌面 Edge 可以通过浏览器的下载接口保存文件，也支持“另存为”和在文件夹中显示。OneDrop 会记住附件对应的浏览器下载编号。
下次再点同一个附件时，可以先查这个编号，文件还在就直接打开。具体怎样确认浏览器下载完成，见[上篇的下载记录与文件复用](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（上）/#下载记录与文件复用)。

### Android Edge 的附件下载

Android Edge 从 OneDrop 的标签页发起下载。
用户点下载时，扩展先准备好附件地址，再通过 `location.assign()` 访问这个地址，把文件交给 Edge 下载。

![Android Edge 询问是否下载 MP4 附件](https://res.cloudinary.com/sycamore/image/upload/v1794818863/Typora/2026/10/29/onedrop-android-edge-download-confirmation.png)

点确认后，文件由 Edge 下载，OneDrop 还要在附件旁显示进度。
页面用附件的 `driveItemId` 向后台查询下载状态，两次查询之间间隔 250 毫秒。进度根据已接收字节数和文件总大小计算，Edge 确认完成前最多显示 99%。

下载完成后，OneDrop 把 Edge 返回的下载编号和附件关联起来。
如果中途离开标签页，再次打开时，OneDrop 会先查询之前的任务。还在下载的继续显示进度，已经完成的直接补上下载记录。

### iOS Edge 的文件分享

在 iOS Edge 里，附件要先准备成浏览器可以分享的 `File`。
OneDrop 会按 `driveItemId` 查找 IndexedDB 里的附件缓存，核对文件名、记录的大小和实际二进制数据的大小。
一致时就可以用缓存准备文件，省去再次下载的时间。

缓存不可用时，OneDrop 向后台取得下载地址，读取响应流，每读到一段就更新已接收的字节数。
进度条优先使用响应头 `Content-Length` 作为总大小，取不到时用附件消息里记录的大小。
附件大小已知且大于零时，下载结束还会核对实际长度，然后才写入缓存。

文件准备好以后，OneDrop 用 `navigator.canShare()` 检查浏览器能否分享这份文件，再调用 `navigator.share()` 打开系统分享菜单。我可以在菜单里选择接收文件的应用。
首次点击时会先下载再尝试分享，已有可用缓存时则可直接调出菜单。

![在 iOS Edge 中把 OneDrop 图片附件交给系统分享菜单](https://res.cloudinary.com/sycamore/image/upload/v1794743416/Typora/2026/10/29/onedrop-ios-edge-share.png)

### 独立 iOS 应用的文件预览与导出

同样是在 iPhone 上，独立应用可以通过 Swift 插件直接把附件下载到本地。
插件使用 `URLSession` 下载文件，放进应用的文稿目录，并按 `driveItemId` 记下文件位置。
同名文件已经存在时，新文件会换一个带编号的名字保存。

用户点“打开”时，插件先检查文件是否还在，再交给 `UIDocumentInteractionController` 显示系统预览。
我在原生应用中打开了前面用 Edge 分享的那张小狗照片，系统预览顶部显示文件名 `IMG_4566`。

![原生 iOS 应用打开 IMG_4566 后的系统预览](https://res.cloudinary.com/sycamore/image/upload/v1794763834/Typora/2026/10/29/onedrop-ios-native-preview.png)

如果想把这张照片存到其他位置，可以回到附件菜单点 **Save as**。插件会打开 iOS 的文件选取器，让我选择把副本存在哪个文件夹。

## 复制图片

如果只是想把照片贴进聊天框，还可以打开 OneDrop 的附件菜单，选择 **Copy image**。
这个选项会在图片预览加载好后出现。共用界面取出预览数据，转成 PNG，再交给当前平台写入剪贴板。

Edge 扩展把 PNG 数据封装为 `ClipboardItem`，调用 `navigator.clipboard.write()` 写入。
独立 iOS 应用则通过 Capacitor 把图片数据交给 Swift 插件，解码为 `UIImage`，再赋给系统剪贴板的 `UIPasteboard.general.image`。
这样切换到支持粘贴图片的应用后，就可以直接贴入照片。
