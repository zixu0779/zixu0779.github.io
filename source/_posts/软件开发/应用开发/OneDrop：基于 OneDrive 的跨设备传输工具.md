---
title: OneDrop：基于 OneDrive 的跨设备传输工具
date: 2026-09-20 20:36:17
updated: 2026-09-20 20:36:17
categories: [["软件开发", "应用开发"]]
tags: ["OneDrop", "OneDrive", "Microsoft Edge", "跨设备传输"]
---

[OneDrop](https://github.com/zixu0779/OneDrop) 是我做的一个跨设备传输工具，通过用户自己的 OneDrive 在设备之间传递文本和文件。
本文整理一下做它的原因、各个平台的发布情况，以及后续的计划。
实现细节方面的内容，就后面再补充。

<!-- more -->

## 为什么做 OneDrop

我是 Edge 的重度用户，每台设备都会安装 Edge 浏览器，毕竟是 Windows 电脑自带的，用习惯了。所以即使到了 Mac 和移动端环境，我也会额外安装 Edge 作为默认浏览器。

以前 Edge 自带的 Drop 是我最主要的跨设备传输方式，使用得很频繁。
但后来新版 Edge [移除了这个功能](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-archive-stable-channel#version-1520419153-august-27-2026-stable---main-release)，我便想自己做一个工具，把原来的使用习惯延续下来。

当然，微信等聊天应用也能传文件，专门做多端传输的工具也不少。
但对我来说，大部分需要使用 Drop 的场景，只是临时传一段文字、链接或一个附件，如果还要另外打开一个 App，总觉得多了一步，不太舒服。
而如果入口就在我常用的，且大概率已经打开的 Edge 里，那就是顺手就能完成的事情，不需要专门切换过去。

所以 OneDrop 最初的目标很简单：让自己继续在浏览器里完成这些临时传递。

## 为什么选择 OneDrive

另一个考虑是不想自己搭服务器。
只是为了在自己的设备间传些东西，还要承担服务器的费用和日常管理，对我来说没有必要。

既然主要在 Edge 中使用，沿用 Microsoft 账户和 OneDrive 就比较自然。
何况，大部分的 Edge 用户自然会创建自己的 Microsoft 账户。

因此，OneDrop 就使用自己的 Microsoft 账户登录，文本和文件存放在自己的 OneDrive 中，也不需要另外维护一套存储服务。

Microsoft 账户提供的[免费云存储空间是 5 GB](https://support.microsoft.com/en-us/onedrive/microsoft-storage-faqs)，不过这部分容量会与账户中的其他内容共享，并不是全部留给 OneDrop。
以我临时传递文字和少量文件的用途来看，通常已经够用；如果 OneDrive 本身存了很多东西，使用前还是要留意剩余空间。

## 目前的使用效果

OneDrop 的主要界面采用消息列表的形式，文本和文件放在同一个入口里。
在桌面 Edge 中打开扩展，就可以在侧栏中使用，不需要离开当前网页再打开一个独立应用。

![在桌面 Edge 侧栏中使用 OneDrop](https://res.cloudinary.com/sycamore/image/upload/v1793199120/Typora/2026/10/28/onedrop-desktop.png)

我希望保留下来的就是这种简单的使用方式：有内容需要带到另一台设备时，先发到这里，再从另一台设备取用。

![OneDrop 的文本与文件消息界面](https://res.cloudinary.com/sycamore/image/upload/v1793200401/Typora/2026/10/28/onedrop-message.png)

历史消息的功能肯定是支持的，消息的长期存档也是这个工具的重要功能，毕竟功能上会尽量对标 Drop。

![OneDrop 中保留的历史文件消息](https://res.cloudinary.com/sycamore/image/upload/v1793207916/Typora/2026/10/29/onedrop-history.png)

像上一节中提到的，OneDrive 的 5GB 免费空间可能不够用。
因此，OneDrop 也提供了删除和回收站，方便整理已经用完的消息。
需要的记录可以继续保留，不再需要的可以选择性地删除。

注意，消息区的删除只是删除消息记录，并不等于马上释放空间。要想彻底删除，还要去回收站清理。

![OneDrop 的回收站界面](https://res.cloudinary.com/sycamore/image/upload/v1793200453/Typora/2026/10/28/onedrop-recycle-bin.png)

## 目前的发布情况

桌面端已经在 [Edge 扩展商店](https://microsoftedge.microsoft.com/addons/detail/onedrop/omfponfedcemkidfmpkojmhfofgmfmgh)上线，可以直接从商店安装。

移动端暂时没有这么方便。
Edge 提供了移动端插件的上架方式，可是出于各种不知名的原因，虽然 Android 和 iOS 的移动扩展申请表都已经提交，但我目前还没有收到任何回复。
因此还不能按桌面端的方式从商店安装。

如果想提前使用，可以从 [GitHub Release](https://github.com/zixu0779/OneDrop/releases/latest) 下载 CRX 扩展包，不过需要对应的测试版浏览器和开发模式：Android 使用 Edge Canary，iOS 使用 Edge 的 TestFlight 版本。
具体入口整理在[安装说明](https://github.com/zixu0779/OneDrop/blob/main/docs/installation.md)中，普通稳定版 Edge 不能直接照搬这条安装路径。

iOS 还提供了原生应用的 IPA 包，作为浏览器扩展之外的另一种使用方式。
这个包需要导入 [LiveContainer](https://github.com/LiveContainer/LiveContainer)，不能下载后直接点开安装，也不是 App Store 版本。
选择这条路径之前，需要先配置好 LiveContainer。

## 目前的不足与后续打算

目前最明显的问题还是移动端的使用门槛。
桌面端已经有商店入口，而手机上无论是测试版浏览器，还是 LiveContainer，都需要额外准备。
对于一个本来想减少操作的工具来说，这部分还不够方便。

后续我会继续关注移动扩展的申请进度，也有考虑给 Android 也增加一个独立应用，但目前还没有确定的时间安排。

OneDrop 会继续围绕设备之间的临时传递来完善，把发送、查看和清理这些基本操作做好。
项目代码放在 [GitHub](https://github.com/zixu0779/OneDrop)，有类似使用习惯的话，可以先看看安装条件，再决定是否适合自己。

目前已经更新到 1.0.3，大部分功能已经完善，并进行过初步测试。
使用时如果遇到问题，欢迎在评论区或 [GitHub Issues](https://github.com/zixu0779/OneDrop/issues) 中提出。

![OneDrop 的设备列表与版本信息](https://res.cloudinary.com/sycamore/image/upload/v1793209186/Typora/2026/10/29/onedrop-devices-about.png)
