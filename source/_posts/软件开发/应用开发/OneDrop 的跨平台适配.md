---
translation_id: onedrop-platforms
title: OneDrop 的跨平台适配
date: 2026-10-21 20:34:27
updated: 2026-10-29 02:54:42
categories: [["软件开发", "应用开发"]]
tags: ["OneDrop", "TypeScript", "Microsoft Graph", "Edge插件开发"]
---

[OneDrop](https://github.com/zixu0779/OneDrop) 的消息存储与同步已经在[上篇](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（上）/)和[下篇](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（下）/)中说明。
这一篇先整理浏览器扩展和原生 iOS 应用之间的代码复用与平台适配，仍以 [1.0.3](https://github.com/zixu0779/OneDrop/releases/tag/v1.0.3) 为准。

<!-- more -->

## 共享代码的组织

OneDrop 的多个入口都围绕同一套消息模型工作。
如果每个平台分别实现消息合并、墓碑和归档，后面修复一个边界问题就要重复修改多份代码，也容易让不同设备对同一份云端数据产生不同解释。
所以项目把这些行为尽量放在共享包里，应用入口负责组合。

目前的主要分工如下：

| 目录 | 职责 |
| --- | --- |
| `packages/core` | 消息、月份、设置类型及运行时请求协议 |
| `packages/onedrive` | Graph 请求、消息块、归档、墓碑和附件操作 |
| `packages/web-storage` | IndexedDB 缓存、待发送任务和下载登记 |
| `packages/platform` | 平台桥接接口、运行时依赖入口 |
| `packages/app-runtime` | 授权、设备、设置和下载服务 |
| `packages/extension-runtime` | 扩展后台请求分发与平台入口处理 |
| `packages/ui` | 共享 React 界面及交互状态 |
| `apps/edge`、`apps/ios` | 各平台的具体装配和原生适配 |

核心类型不需要知道 React 组件、浏览器下载对象或者 Swift 插件长什么样。
界面通过有类型的 `RuntimeRequest` 发出意图，运行时返回 `RuntimeResponse`；扩展中实际走的是 `browser.runtime.sendMessage`。
这样 UI 可以说“发送文字”“读取某月”“恢复某条消息”，而不用在组件里组织 Graph URL 和 Authorization 请求头。

## 平台能力与适配

跨平台不只是把同一份页面塞到不同外壳里。
桌面浏览器有下载目录和“在文件夹中显示”，移动端更常用系统分享；某些浏览器入口也不具备相同的 API。
项目用 `PlatformBridge` 作为界面与平台实现之间的连接层：界面提出“保存文件”这样的请求，再由当前平台选择具体做法。
其中 `PlatformCapabilities` 声明当前平台支持哪些操作：

```typescript
export type PlatformCapabilities = {
  showInFolder: boolean;       // 在系统文件夹中显示文件
  saveAs: boolean;             // 另存为
  navigationDownload: boolean; // 通过打开下载地址获取文件
  systemFileShare: boolean;     // 调用系统文件分享
};
```

桥接层除了 `request()`，还提供下载查询、打开、附件准备、系统分享、文本和图片复制等方法。
共享界面根据能力决定提供什么操作，具体调用再交给平台实现。
例如 iOS Edge 声明不支持桌面的下载管理入口，但支持系统文件分享；它会先取得附件，检查缓存中的名称、大小和 Blob 是否一致，再准备可分享的 `File`。

没有可用缓存时，iOS Edge 桥接读取下载响应流，逐段累加已接收字节数，向界面报告进度。
总量优先来自 `Content-Length`，没有这个值时使用消息记录中的附件大小。
读完后还会核对 Blob 大小，再保存到 IndexedDB 附件缓存，构造 `File` 交给系统分享。
分享前需要通过 `navigator.canShare` 检查文件是否受支持，因此附件准备完成以后，仍有一个调用系统分享的步骤。

这也解释了为什么“同一个附件按钮”在不同平台上可以有不同的最后一步。
消息和 DriveItem 的含义相同，系统接收文件的方式不同，不需要为了保持按钮外观一致而假装桌面 API 到处存在。

## 浏览器扩展入口

浏览器扩展使用 WXT 组织开发和构建，React 编写界面，TypeScript 编写业务代码，并按 Manifest V3 的扩展规范运行。
桌面、Android 与 iOS 使用同一套扩展代码，但并不都使用侧栏。
桌面打开 side panel，Android 使用独立的移动页面，iOS 使用适合其扩展环境的移动入口。
入口判断和相关桥接放在应用层，共享 UI 不需要把每个页面都复制一份。

iOS Edge 还保留了侧栏路径的兼容处理：即使浏览器进入静态声明的 side-panel 页面，也能检测平台并装载 iOS 的界面与桥接。
登录缺少 Identity API、下载需要系统分享等差异，也在对应运行时和桥接中处理。
同一个扩展包并不意味着所有平台 API 都会按桌面行为工作。

## 原生 iOS 适配

原生 iOS 应用使用 Capacitor，把共享 React 页面放进应用内的 WebView（网页显示容器），再通过原生插件调用系统功能。
它的登录入口是 `OneDropAuth`，Swift 代码用系统提供的 `ASWebAuthenticationSession` 打开登录授权流程，并通过 Keychain（系统钥匙串）保存和读取 token。
这与上篇介绍的浏览器扩展使用 `browser.storage.local` 的方式不同，系统授权窗口与凭据保存都由原生插件处理。

共享 OneDrive 代码需要访问令牌、本地状态存储和事件通知，但不直接决定这些能力由浏览器还是 iOS 提供。
应用启动时把对应函数传给它，这就是这里的依赖注入；同一段业务代码调用这些函数即可，不必反复判断平台。
iOS 入口负责把这些依赖接到原生实现，再把消息请求交给对应共享函数。
原生下载插件则处理附件落地、查找与打开等系统操作，界面仍然围绕相同的附件元数据工作。

设备设置也遵循相同分工。
每次安装生成匿名设备 UUID，对应 `settings/devices/<device-id>.json`，保存平台、显示名称和设备偏好。
设备列表中的移除操作针对这份设置文档，并不会按发送设备顺带删除消息和附件；消息的生命周期由[下篇的删除与清理流程](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（下）/)管理。

对我来说，OneDrop 仍然是围绕自己设备之间临时传递内容的小工具。
OneDrive 承担存储以后，项目里需要反复处理的是这些状态之间的关系：一条消息何时算发出，另一台设备看到什么，失败后还有什么可以继续，删除以后还剩下哪些数据。
把这些规则留在共享代码里，再把登录、下载和入口交给各平台处理，后续完善时也能沿着明确的边界继续修改。
