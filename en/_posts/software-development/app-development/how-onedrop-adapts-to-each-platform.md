---
title: How OneDrop Adapts to Each Platform
translation_id: onedrop-platforms
source_digest: 396a61ebbd694fa44c6d5532921bdb7f297e8ea76891b67ec6ff8a40f61478e0
tags:
  - OneDrop
  - TypeScript
  - Microsoft Graph
  - Edge Extension Development
categories:
  - Software Development
  - App Development
sections: {"sharing-the-message-model": "共享代码的组织", "platform-capabilities": "平台能力与适配", "browser-extension-entry-points": "浏览器扩展入口", "native-ios": "原生-ios-适配"}
---

[Part one](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-one/) and [part two](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-two/) cover how [OneDrop](https://github.com/zixu0779/OneDrop) stores and syncs messages. This post looks at what the browser extension and native iOS app share, and where they need different implementations. I’m still referring to [version 1.0.3](https://github.com/zixu0779/OneDrop/releases/tag/v1.0.3).

<!-- more -->

## Sharing the message model

All the entry points work with the same message model. If each platform implemented merging, deletion tombstones and archiving separately, an edge case would need fixing in several places. Two devices could even interpret the same cloud data differently. OneDrop puts those rules in shared packages and lets each app assemble the pieces it needs.

| Directory | Responsibility |
| --- | --- |
| `packages/core` | Message, month and settings types; runtime request protocol |
| `packages/onedrive` | Graph requests, message chunks, archives, tombstones and attachments |
| `packages/web-storage` | IndexedDB cache, pending sends and download records |
| `packages/platform` | Platform bridge interfaces and runtime dependencies |
| `packages/app-runtime` | Authorisation, device, settings and download services |
| `packages/extension-runtime` | Dispatching background requests and handling extension entry points |
| `packages/ui` | Shared React UI and interaction state |
| `apps/edge`, `apps/ios` | Platform-specific assembly and native adapters |

The core types don’t need to know about React components, browser download objects or Swift plugins. The UI sends a typed `RuntimeRequest` and receives a `RuntimeResponse`. In the extension the request travels over `browser.runtime.sendMessage`. A component can ask to send text, read a month or restore a message without assembling a Graph URL or an Authorization header.

## Platform capabilities

The same page behaves differently depending on its host. Desktop browsers have a download directory and a “Show in folder” command; mobile devices tend to use the system share sheet. Even browser extension entry points differ in which APIs they expose.

`PlatformBridge` connects UI requests such as “save this file” to the platform implementation. `PlatformCapabilities` declares the available operations:

```typescript
export type PlatformCapabilities = {
  showInFolder: boolean;       // Reveal a file in its system folder
  saveAs: boolean;             // Save As
  navigationDownload: boolean; // Download by opening the download URL
  systemFileShare: boolean;    // Use the system file share sheet
};
```

Alongside `request()`, the bridge can look up and open downloads, prepare attachments, share files, and copy text or images. The UI offers actions according to those capabilities. On iOS Edge there’s no desktop download manager entry point, but system file sharing is available. The bridge retrieves the attachment, checks that the cached name, size and Blob agree, then prepares a shareable `File`.

Without a usable cache entry, the bridge reads the response stream and accumulates the number of bytes received so the UI can display progress. It gets the total from `Content-Length` when available and otherwise uses the attachment size in the message. Once the stream ends, it checks the Blob size, caches the attachment in IndexedDB and constructs the `File`. It also checks `navigator.canShare` before invoking system sharing. Preparing the file and opening the share sheet are separate steps.

That’s why the same attachment button can have a different final action. The message and DriveItem mean the same thing across platforms; the way the system receives the file differs. I don’t need to emulate a desktop API on every platform just to make the button look the same.

## Browser extension entry points

The extension uses WXT for development and builds, React for the UI, TypeScript for application logic and Manifest V3 for the extension. Desktop, Android and iOS share the extension code. Desktop opens a side panel, Android opens a separate mobile page and iOS uses an entry point suited to its extension environment. The app layer selects the entry point and bridge, so the shared UI doesn’t need a separate copy of every page.

There’s also a compatibility path for iOS Edge. Even if the browser opens the statically declared side-panel page, the app detects the platform and loads the iOS UI and bridge. The runtime and bridge handle differences such as the missing Identity API during login and the need to share downloads through the system. Shipping one extension package doesn’t make mobile APIs behave like their desktop counterparts.

## Native iOS

The native app uses Capacitor to host the shared React UI in a WebView, a browser view embedded in the app. Native plugins provide access to system features. For login, the `OneDropAuth` Swift plugin opens the authorisation flow with `ASWebAuthenticationSession` and stores and retrieves tokens through Keychain. The browser extension described in part one uses `browser.storage.local`; on native iOS both the authorisation window and credential storage belong to the plugin.

The shared OneDrive code needs an access token, local state and a way to send events. The app supplies those functions at startup. That’s what dependency injection means here: the business logic calls the supplied functions without repeatedly checking which platform it’s on. The iOS entry point wires up native implementations and forwards message requests to the same shared functions. The native download plugin saves, locates and opens files while the UI continues to work with the same attachment metadata.

Device settings follow the same division. Each installation generates an anonymous UUID and stores its platform, display name and preferences in `settings/devices/<device-id>.json`. Removing a device from the list removes its settings document. Messages and attachments from that device have a separate lifecycle, described in [part two’s deletion and cleanup flow](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-two/).

For me, OneDrop is still a little tool for passing things between my devices. Once OneDrive took over storage, the recurring questions were about state: when a send counts as complete, what another device sees, what can resume after a failure and what survives deletion. Keeping those rules shared and leaving login, downloads and entry points to each platform gives me a clear place to make the next change.
