---
title: How OneDrop Adapts to Each Platform
translation_id: onedrop-platforms
source_digest: 25407082b4af8fa5025ba4ff07346c52a3e26d3148f61bb4df814c2665c7c4d1
tags:
  - OneDrop
  - TypeScript
  - Microsoft Graph
  - Edge Extension Development
categories:
  - Software Development
  - App Development
sections: {"shared-code-across-platforms": "多端共用的代码结构", "app-entry-points-and-shared-packages": "平台入口和共享包", "reading-the-current-months-messages": "读取当月消息", "edge-extension-entry-points-and-layout": "edge-扩展的入口和布局", "the-desktop-edge-side-panel": "桌面-edge-的侧栏", "the-onedrop-tab-in-edge-on-android": "android-edge-的标签页", "the-popup-in-edge-on-ios": "ios-edge-的弹窗", "when-the-mobile-keyboard-opens": "移动端键盘的弹出效果", "account-and-device-settings": "账户和设备设置", "sign-in-windows-and-token-storage": "登录窗口与令牌保存", "per-device-settings": "每台设备的设置", "attachment-actions": "附件操作", "downloads-in-desktop-edge": "桌面-edge-的浏览器下载", "downloading-attachments-in-edge-on-android": "android-edge-的附件下载", "sharing-files-in-edge-on-ios": "ios-edge-的文件分享", "previewing-and-exporting-files-in-the-ios-app": "独立-ios-应用的文件预览与导出", "opening-and-saving-attachments-in-the-android-app": "独立-android-应用怎样打开和另存附件", "copying-an-image": "复制图片"}
---

I originally built [OneDrop](https://github.com/zixu0779/OneDrop) to send files from Edge. On a phone I could keep the same message list and composer, but opening a file needed different handling. On my computer I want to open the downloaded file. In Edge on my iPhone I want the system share sheet so I can choose which app receives it.

[Part one](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-one/) and [part two](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-two/) cover storing messages in OneDrive and syncing them across devices. Here I’m using [OneDrop 1.0.3](https://github.com/zixu0779/OneDrop/releases/tag/v1.0.3) again to look at the changes needed for desktop Edge, mobile Edge and the standalone iOS app. [Version 1.1.0](https://github.com/zixu0779/OneDrop/releases/tag/v1.1.0) added a standalone Android app. This article also covers how it handles sign-in, opens attachments and copies images on Android.

<!-- more -->

## Shared code across platforms

### App entry points and shared packages

OneDrop’s entry points live under `apps/`. Edge on desktop and mobile uses the same extension, while the standalone Android and iOS apps each have their own entry point.
The UI, message model and OneDrive operations used across platforms live under `packages/`.

| Directory | Purpose |
| --- | --- |
| `apps/edge` | Desktop side panel, mobile extension pages and adaptations for Edge on iOS |
| `apps/ios` | WebView entry point and Swift plugins for the standalone iOS app |
| `apps/android` | WebView entry point and Java plugins for the standalone Android app |
| `packages/native-runtime` | Platform bridge shared by both standalone apps in 1.1.0 |
| `packages/ui` | React message list, composer and settings screens |
| `packages/core` | Message model, settings types and runtime request protocol |
| `packages/platform` | Interfaces the UI uses to access platform features, plus the runtime dependencies for OneDrive operations |
| `packages/app-runtime` | Application services for sign-in, device settings and downloads |
| `packages/extension-runtime` | Background request dispatch and entry point handling for the Edge extension |
| `packages/onedrive` | Reading and writing message chunks, archives and attachments through Microsoft Graph |
| `packages/web-storage` | IndexedDB storage for cached data, pending tasks and download records |

### Reading the current month’s messages

Every version of OneDrop loads the React UI from `packages/ui`. To read the current month’s messages, for example, the message list sends this request:

```typescript
const response = await sendRequest({ type: "messages/read-current-month" });
```

Each entry point installs its own `PlatformBridge` before loading the UI. This bridge receives requests from the UI and passes them to the appropriate handler. The request names, parameters and response types are all defined in `packages/core`.

- **The Edge extension** passes the request to its background process with `browser.runtime.sendMessage`. The handler gets the current UTC month and calls `readMonthDocument()` to fetch the messages.
- **The standalone Android and iOS apps** use Capacitor to load the same UI in a WebView. They share a native bridge, with no extension background process. The bridge handles the request inside the app, gets an access token from an in-app native authentication module (a Capacitor plugin) and passes it to `readMonthDocumentWithAccessToken()` to read the same month.

Both paths use the monthly message reader in `packages/onedrive`. The UI receives the same `messages/month` response and can display it with the same list component. That leaves just one place to change the rules for reading message chunks.

## Edge extension entry points and layout

The extension chooses its entry point using the platform information reported by Edge and the browser’s user agent.

### The desktop Edge side panel

When the side panel API is available, OneDrop configures the toolbar icon to open the message list beside the current page. I can keep the page I’m reading open and drop text or files into the composer next to it.

![OneDrop open in the desktop Edge sidebar](https://res.cloudinary.com/sycamore/image/upload/v1793199120/Typora/2026/10/28/onedrop-desktop.png)

### The OneDrop tab in Edge on Android

Tapping OneDrop in Edge on Android opens a separate `android-mobile.html` tab. If that tab is still open, tapping the icon again brings it back into view.

![The OneDrop message list in an Edge tab on Android, with the browser address bar below](https://res.cloudinary.com/sycamore/image/upload/v1794818604/Typora/2026/10/29/onedrop-android-edge-messages.png)

### The popup in Edge on iOS

Edge on iOS uses the `ios-mobile.html` popup. The extension manifest also declares the desktop side panel page, so that entry point checks the platform too. If Edge loads the panel on iOS, it switches to the mobile styles and the iOS Edge bridge.

The expanded popup shows the message list with the composer at the bottom.

![The OneDrop message list and composer in Edge on iPhone](https://res.cloudinary.com/sycamore/image/upload/v1794743409/Typora/2026/10/29/onedrop-ios-edge-messages.png)

### When the mobile keyboard opens

When the keyboard opens in Edge on mobile, the visible area shrinks. If the window keeps its original height, the keyboard can cover the composer at the bottom.
The browser may scroll the focused field into view, but it doesn’t always end up in the right place. I adjust the layout using the new height and position instead.

There’s one more detail in Edge on iOS. OneDrop runs in a popup that can be half height or fully expanded, so its available space has to be measured as it changes.

![The OneDrop popup at half height in Edge on iOS](https://res.cloudinary.com/sycamore/image/upload/v1794820657/Typora/2026/10/29/onedrop-ios-edge-half-height-popup.png)

The browser exposes the visible area through `visualViewport`. Its `height` is the available height, and `offsetTop` is the distance from the top of the layout viewport.
If the browser doesn’t provide `visualViewport`, OneDrop uses `window.innerHeight` and a top offset of zero. When the visible area changes, it reads the values again, rounds them to whole pixels and writes them to two CSS variables.

```js
const viewport = window.visualViewport;
const height = viewport?.height ?? window.innerHeight;
const offsetTop = viewport?.offsetTop ?? 0;

const style = document.documentElement.style;
style.setProperty("--ios-edge-popup-height", `${Math.round(height)}px`);
style.setProperty("--ios-edge-popup-offset-top", `${Math.round(offsetTop)}px`);
```

The popup’s root element uses those variables to set its top position and height:

```css
top: var(--ios-edge-popup-offset-top, 0px);
height: var(--ios-edge-popup-height, 100dvh);
```

The height can keep changing while the keyboard animates into place. After the composer receives focus, the popup updates its dimensions several times over the next half second and calls `scrollIntoView({ block: "nearest" })` on the still-focused input to keep it on screen.

![The OneDrop composer above the mobile keyboard](https://res.cloudinary.com/sycamore/image/upload/v1794743413/Typora/2026/10/29/onedrop-ios-edge-keyboard.png)

## Account and device settings

### Sign-in windows and token storage

When I click sign in in the Edge extension, OneDrop uses the browser’s `identity.launchWebAuthFlow` to open Microsoft’s authorisation window and receive the callback. If the browser doesn’t provide that method, the extension completes authorisation in a temporary tab. Once signed in, it stores the tokens in `browser.storage.local`. [Part one covers the authorisation code exchange](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-one/#the-client-authorisation-flow).

The standalone iOS app has its own sign-in path. Tapping the same button calls `OneDropAuth`, a native authentication module written in Swift, through Capacitor. The module starts an `ASWebAuthenticationSession` to display Microsoft’s sign-in page.

After sign-in, iOS returns the result to the native authentication module through the app’s registered callback scheme. The module checks that the callback’s `state` matches this sign-in attempt, exchanges the authorisation code for tokens and stores them in the iOS Keychain. When the UI needs to read OneDrive, it asks the module for an access token. The module also refreshes it when it approaches expiry.

When the user taps sign in in the standalone Android app, its native authentication module, written in Java, uses AppAuth to open the phone’s browser for sign-in. It receives the authorization result and exchanges the code for tokens. To keep the user signed in when the app reopens, the native authentication module encrypts the authorization state with an AES key held in Android Keystore and saves the ciphertext in the app’s private `SharedPreferences`.

### Per-device settings

These devices can share a Microsoft account and still keep their own settings. Each installation generates a device ID and saves its display name and preferences in `settings/devices/<device-id>.json`. When I replace a phone and remove the old device from the list, OneDrop removes its settings. Messages and attachments sent from that phone still follow [the deletion and recovery rules in part two](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-two/#tombstones-and-retention).

![OneDrop’s device list and settings actions for a single account](https://res.cloudinary.com/sycamore/image/upload/v1794712894/Typora/2026/10/29/onedrop-platform-devices.png)

## Attachment actions

Suppose I send a file from my computer and tap the message on another device. Each platform receives the same OneDrive file identifier, `driveItemId`. What changes is where the file goes and how I can open it. The UI reads `PlatformCapabilities` to find the actions available on the current platform and decide which buttons to show.

### Downloads in desktop Edge

Desktop Edge saves files through the browser’s downloads API. It also supports Save As and showing a file in its folder. OneDrop remembers the browser download ID for each attachment. When I open the same attachment again, it can look up that ID and open the file if it’s still there. [Part one describes how OneDrop confirms a download has finished](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-one/#downloads-and-file-reuse).

### Downloading attachments in Edge on Android

In Edge on Android, the download starts from the OneDrop tab. When I tap download, the extension prepares the attachment URL and navigates to it with `location.assign()`, handing the file to Edge.

![Edge on Android asking whether to download the MP4 attachment](https://res.cloudinary.com/sycamore/image/upload/v1794818863/Typora/2026/10/29/onedrop-android-edge-download-confirmation.png)

After I confirm, Edge downloads the file while OneDrop shows the progress next to the attachment.
The page queries the background process using the attachment’s `driveItemId`, waiting 250 milliseconds between checks. It calculates progress from the bytes received and the total file size, and caps it at 99% until Edge reports that the download is complete.

OneDrop then associates the download ID from Edge with the attachment. If I leave the tab and come back, OneDrop checks the saved task first. It resumes showing progress for an active download or records the download ID straight away if it has already finished.

### Sharing files in Edge on iOS

Edge on iOS needs a browser `File` object before it can share an attachment. OneDrop looks up the attachment in IndexedDB using its `driveItemId`. It checks the cached name, recorded size and actual size of the binary data. A match lets it prepare the file straight from the cache and skip the download.

If the cache can’t supply the file, OneDrop asks the background process for a download URL and reads the response stream, counting bytes as each chunk arrives. The progress indicator takes the total size from the `Content-Length` header when available, falling back to the size in the message. If the attachment has a known size greater than zero, OneDrop checks the final length before caching it.

Once the file is ready, OneDrop checks that the browser can share it with `navigator.canShare()`, then calls `navigator.share()` to open the system share sheet. I can choose which app receives the file there. On the first tap, OneDrop downloads it before attempting to share. With a usable cached copy it can open the share sheet straight away.

![The iOS share sheet opened for an image attachment in OneDrop](https://res.cloudinary.com/sycamore/image/upload/v1794743416/Typora/2026/10/29/onedrop-ios-edge-share.png)

### Previewing and exporting files in the iOS app

On the same iPhone, the standalone app can download an attachment to local storage through a Swift plugin. It uses `URLSession` to download the file into the app’s Documents directory and records its location by `driveItemId`. If the name is taken, the plugin saves the new file under a numbered name.

When I tap Open, the plugin checks that the file still exists and asks `UIDocumentInteractionController` to present a system preview. I opened the same dog photo I shared from Edge earlier. The system preview shows its filename, `IMG_4566`, at the top.

![The system preview for IMG_4566 opened from the native iOS app](https://res.cloudinary.com/sycamore/image/upload/v1794763834/Typora/2026/10/29/onedrop-ios-native-preview.png)

To save the photo somewhere else, I can return to the attachment menu and choose **Save as**. The plugin opens the iOS document picker so I can choose a folder for the copy.

### Opening and saving attachments in the Android app

When I download the same photo in the standalone Android app, the plugin stores it under the app’s own files directory, organized by `driveItemId`. When I tap **Open**, OneDrop uses `FileProvider` to create a `content://` URI for the photo. It passes the URI, the file type and temporary read permission to an `ACTION_VIEW` intent. Android then lets me choose which app to view the photo in.

To keep the photo in a folder of my choice, I tap **Save as**. OneDrop opens the system file picker with `ACTION_CREATE_DOCUMENT`, then copies the local photo to the selected destination without downloading it again.

## Copying an image

To paste a photo into a chat, I can choose **Copy image** from the OneDrop attachment menu once the image preview has loaded. The shared UI takes the preview data, converts it to PNG and passes it to the current platform to write to the clipboard.

The Edge extension wraps the PNG data in a `ClipboardItem` and calls `navigator.clipboard.write()`. In the standalone iOS app, Capacitor passes the image data to the Swift plugin, which decodes it into a `UIImage` and assigns it to `UIPasteboard.general.image`. On Android, the plugin writes the PNG to the app’s cache, gets a URI from `FileProvider` and places that URI on the clipboard using `ClipData.newUri()`. An app that supports pasting images can read the photo through the URI.
