---
title: OneDrop Storage and Multi-Device Sync (Part One)
translation_id: onedrop-storage-sync-1
source_digest: e5fc3ea04a7dfb4bd7bb2b72ccd6772530521d50e31c888862aef8e4ceabc123
tags:
  - OneDrop
  - OneDrive
  - TypeScript
  - Microsoft Graph
  - Edge Extension Development
categories:
  - Software Development
  - App Development
sections: {"microsoft-accounts-and-onedrive-authorisation": "microsoft-账户与-onedrive-授权", "the-client-authorisation-flow": "客户端授权流程", "authorisation-with-pkce": "用-pkce-完成授权", "registering-the-application-and-setting-its-configuration": "登记应用与配置填写", "requesting-permissions": "声明需要的权限", "login-windows-and-session-state": "登录窗口与登录状态", "authorisation-window-or-temporary-tab": "授权窗口与标签页登录", "token-roles-and-storage": "令牌的用途与保存", "refreshing-tokens-and-signing-in-again": "令牌刷新与重新登录", "the-appsonedrop-directory": "appsonedrop-存储目录", "storing-and-transferring-text-and-files": "文本与文件怎样保存和传输", "separating-metadata-from-attachments": "分离消息记录和附件", "cloud-layout": "云端目录结构", "message-fields-and-validation": "消息字段与数据校验", "local-pending-tasks": "本地待发送任务", "sending-a-file": "文件发送流程", "upload-sessions-and-chunks": "上传会话与分片", "selecting-a-transfer-method-and-chunk-size": "选择上传方式与分片大小", "validating-and-submitting-chunks": "校验内容与提交分片", "retrying-and-recovering-progress": "失败重试与进度恢复", "downloads-and-file-reuse": "下载记录与文件复用", "download-addresses-and-image-previews": "下载地址与图片预览", "reusing-a-download": "复用已有下载", "confirming-completion": "确认浏览器下载完成"}
---

[My introduction to OneDrop](/en/software-development/app-development/onedrop-sending-text-and-files-through-onedrive/) covers the [project](https://github.com/zixu0779/OneDrop), installation and future plans. This two-part series looks at the implementation. Here I’ll follow Microsoft account authorisation and the path a text or file message takes through storage, upload and download. Part two covers multi-device sync, conflicts, archives, deletion and recovery.

---

Using OneDrive saves me from deploying and maintaining a storage service. It still leaves the client responsible for message state. Two devices can edit the same record, an upload can finish before its message commits, and a deletion has to reach other devices. This diagram shows the entry points, shared UI and storage in [OneDrop 1.0.3](https://github.com/zixu0779/OneDrop/releases/tag/v1.0.3).

![Platform entry points, shared interface and OneDrive storage](https://res.cloudinary.com/sycamore/image/upload/v1793212421/Typora/2026/10/29/onedrop-tech-architecture.png)

## Microsoft accounts and OneDrive authorisation

### The client authorisation flow

OneDrop queries, reads and writes OneDrive files through Microsoft’s API, [Microsoft Graph](https://learn.microsoft.com/en-us/graph/overview). Both the Edge extension and the standalone iOS app run on the user’s device. Microsoft handles login and file requests. Here “extension” refers specifically to the browser distribution; “client” includes the native app as well.

#### Authorisation with PKCE

Requests go directly from the client, so the first step is to get the user’s authorisation. A distributed extension or app can’t keep a server secret confidential. OneDrop uses the [authorisation code flow with PKCE](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow). The user signs in and grants consent on Microsoft’s page, then the client exchanges an authorisation code for tokens.

The client generates a random verifier, hashes it with SHA-256 and Base64URL-encodes the digest as a challenge. The authorisation request sends the challenge. The token request later supplies the original verifier alongside the code. The server checks that the digest matches the challenge from this authorisation. Possession of the code alone is insufficient to complete that exchange.

![Generating the PKCE verifier and challenge](https://res.cloudinary.com/sycamore/image/upload/v1793271791/Typora/2026/10/29/onedrop-tech-pkce.png)

The 64 in the code is the **byte count** before encoding. The request declares `code_challenge_method=S256`. A separate random `state` is returned unchanged in the callback, allowing the client to match the response to its login attempt. Missing code, mismatched state or an authorisation error stops the exchange.

#### Registering the application and setting its configuration

For a custom build, register an application in [Microsoft Entra](https://entra.microsoft.com/). Entra is where Microsoft manages sign-in and authorisation settings. Registration identifies the application requesting sign-in. Released builds already contain their application configuration; users sign in with their own accounts.

The client needs three settings.

- **Client ID identifies the application.** In Entra ID → App registrations, create or open the application and copy **Application (client) ID** from Overview. This identifies the registration, independently of the user’s account or password.
- **Authority selects the sign-in endpoint and account audience.** OneDrop defaults to `https://login.microsoftonline.com/common`. To support work, school and personal Microsoft accounts, the registration must also allow those account types; select the multitenant option that includes personal accounts.
- **Redirect URI tells Microsoft where to return the result.** Register it under Authentication. The URI sent in the request must match. This is a client callback address, unrelated to OneDrive’s file directories.

Desktop Edge supplies extension identity APIs for generating the callback, opening an authorisation window and receiving its result. Android Edge also uses an extension callback but may fail to create the window. In the implementation described here, iOS Edge lacks Identity API and needs a web callback.

When available, `browser.identity.getRedirectURL("auth")` returns an address such as `https://<extension-id>.chromiumapp.org/auth`. Before a client ID is configured, OneDrop’s setup screen displays the Redirect URI to register. Copy it from your own installed extension; different packages can have different IDs.

Without that API, the default web callback is `https://onedrop.sycamore.top/auth.html`, registered as a single-page application (SPA). If you host another callback, change both the local configuration and the Entra registration.

Set the build values in `.env.local` at the project root:

```bash
WXT_ONEDROP_ENTRA_CLIENT_ID=从应用概述页复制的客户端ID
WXT_ONEDROP_ENTRA_AUTHORITY=https://login.microsoftonline.com/common
# 浏览器未提供回调地址生成接口时使用的网页地址
WXT_ONEDROP_TAB_REDIRECT_URI=https://onedrop.sycamore.top/auth.html
```

Restart the development server and reload the extension after editing. Microsoft documents [app registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) and [client account audiences](https://learn.microsoft.com/en-us/entra/identity-platform/msal-client-application-configuration).

#### Requesting permissions

OneDrop includes the following scopes in its login request:

```typescript
const SCOPES = [
  "openid",
  "profile",
  "offline_access",
  "https://graph.microsoft.com/Files.ReadWrite",
] as const;
```

- `openid` requests identity information so the client can obtain an ID token.
- `profile` requests basic profile details such as the name and username shown in the UI.
- `offline_access` requests a refresh token so an expired access token can be replaced without another interactive login. OneDrive still requires network access.
- `Files.ReadWrite` requests file access on behalf of the signed-in user. Add it under API permissions → Add a permission → Microsoft Graph → Delegated permissions. The application acts as the user rather than independently of one.

Microsoft defines the scopes and the user or organisation must grant them. See the [OpenID Connect scope documentation](https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc). The delegated file permission extends beyond `Apps/OneDrop`. The application confines its normal operations to that directory through its own code; creating a folder doesn’t narrow an already granted permission.

### Login windows and session state

#### Authorisation window or temporary tab

Desktop Edge prefers `browser.identity.launchWebAuthFlow`, with a callback from `getRedirectURL("auth")`. If that API is absent or reports that it cannot create a browser window, OneDrop opens a temporary tab instead. Register the callback actually used by the build.

![Selecting the authorisation window or tab fallback](https://res.cloudinary.com/sycamore/image/upload/v1793267304/Typora/2026/10/29/onedrop-tech-login-flow.png)

When `launchWebAuthFlow` is unavailable, the client persists the state, verifier, callback and start time. On a later status check it can see whether the tab reached the callback and finish the exchange.

Interactive login allows the user to act in the sign-in window. Silent login tries to reuse an existing session. Pending authorisation data is retained for five minutes; interactive login waits five minutes and silent login thirty seconds. These limits govern a login attempt, independently of the lifetime of the resulting access token.

#### Token roles and storage

The access token authorises Graph requests, the refresh token obtains new access tokens, and the ID token carries identity claims. The extension stores its tokens in `browser.storage.local`: closing the sidebar can leave the background runtime suspended, so it must be possible to resume without a permanently running process. Native iOS uses Keychain, as described in [the platform notes](/en/software-development/app-development/how-onedrop-adapts-to-each-platform/).

#### Refreshing tokens and signing in again

`getCurrentAccessToken()` checks validity before Graph access, allowing a 60-second expiry margin. As expiry approaches, it uses the refresh token to request a new access token. The `refreshInFlight ??=` in the screenshot lets concurrent callers share that refresh Promise. That avoids duplicate refresh requests and races when saving the responses. The promise is cleared on completion so a future refresh can start.

![Reusing an in-flight token refresh](https://res.cloudinary.com/sycamore/image/upload/v1793267307/Typora/2026/10/29/onedrop-tech-token-refresh.png)

Ordinary refresh failures return an error. For errors such as `invalid_grant` or `interaction_required`, OneDrop first tries silent authorisation with `prompt=none`. If that also cannot proceed it clears its stored tokens and requests login. Signing out of OneDrop clears its own tokens without signing the browser out of Microsoft.

The UI decodes name and username using `readUnverifiedIdTokenClaims`. As the name indicates, it reads the fields without verifying the signature locally. These values supply display information, and the username can serve as a silent-login `login_hint`.

### The Apps/OneDrop directory

Messages, attachments and settings live in one predictable location visible to the user in OneDrive. After obtaining a token the client checks `/me/drive/root:/Apps/OneDrop`, relative to the signed-in user’s drive root. A 404 indicates a missing directory. It checks and creates each level as needed, first `Apps`, then `OneDrop`. Creation fails on conflict; if another device created the folder first, the client rereads it rather than replacing the object. Overwriting an object with the same name could destroy content the other device had already written. Part two uses similar reasoning for writes and archives.

## Storing and transferring text and files

### Separating metadata from attachments

#### Cloud layout

Text and files appear in the same message list but are stored differently in OneDrive. Text is small enough to store in JSON. File contents are uploaded separately; their message records store what’s needed to locate and display them. Here’s the layout, using example years and months:

```plaintext
Apps/OneDrop/
├── messages/
│   └── 2026-10/
│       ├── 0001.json
│       └── 0002.json
├── archive/
│   └── 2026-09.json
├── files/
│   └── 2026/10/<message-id>/<原文件名>
├── settings/
│   ├── account.json
│   └── devices/<device-id>.json
└── tombstones/
    └── 2026-10.json
```

`messages` contains active chunks, `archive` holds consolidated months and `files` contains attachments. Device settings have separate documents under `settings`, avoiding a shared rewrite for every preference change. Reads use the ID markers in `tombstones` to filter deleted messages. UTC month boundaries keep devices in different time zones from assigning the same timestamp to different months.

#### Message fields and validation

OneDrop uses Zod to define the message schema and validate the JSON it actually reads. TypeScript types alone can’t check an incoming document. The common fields are the format version `schemaVersion`, a UUID message identifier `id`, the creation time `createdAt` and an optional `senderDeviceId`. Stable IDs identify the original across retries and merges. The sender device ID distinguishes messages from this installation from messages sent on other devices. It identifies an installation, not the Microsoft account.

```typescript
const messageBaseSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  senderDeviceId: z.uuid().optional(),
});
```

Text extends the common fields:

```typescript
export const textMessageSchema = messageBaseSchema.extend({
  type: z.literal("text"),
  text: z.string().trim().min(1).max(20_000),
});
```

The text is trimmed, must remain nonempty and is limited to 20,000 characters. File messages include `attachment.driveItemId`, filename, size and MIME type, with optional image dimensions and `thumbHash`. A DriveItem represents a Graph file or folder; a MIME type such as `image/png` describes its content. The UI can show the name, size and an image placeholder before fetching the object by ID.

Each chunk has its own `schemaVersion`, `month` and `messages` array. Both the chunk and its individual records are validated when read. Users can edit, move or damage files outside OneDrop. Writing a file once doesn’t guarantee it will still match the schema when OneDrop reads it again.

For images the client tries to read the original dimensions and generate a ThumbHash. It prefers `createImageBitmap`, falls back to a local image object, scales proportionally to a longest side of at most 100 pixels and reads RGBA from a temporary canvas. Only the preview canvas is downscaled. The original attachment is uploaded unchanged. If metadata extraction fails the send continues without the optional preview.

![ThumbHash preview while the actual image loads](https://res.cloudinary.com/sycamore/image/upload/v1793270442/Typora/2026/10/29/onedrop-tech-thumbhash-preview.png)

### Local pending tasks

Draft text, files waiting to upload, commit state and attachment details needed for retries have to survive a closed UI or a [suspended Manifest V3 service worker](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle). OneDrop stores pending text and transfer records in IndexedDB, including the file bytes as a Blob.

![Saving, looking up and listing pending transfers](https://res.cloudinary.com/sycamore/image/upload/v1793271796/Typora/2026/10/29/onedrop-tech-pending-storage.png)

`putPendingTransfer()` writes a record, `getPendingTransfer()` retrieves one by ID, and `listPendingTransfers()` lists them by creation time. Pending state records work this device still owes. The cloud represents what other devices should see. The UI can show progress early, but sending finishes only after the cloud steps succeed. A retry keeps the message ID so it can recognise an earlier successful commit.

### Sending a file

`files/send` registers a placeholder, uploads the attachment and then replaces the placeholder with the final file message. The placeholder has type `file-uploading` and a `pendingAttachment`, without a final DriveItem ID. Other devices can show it immediately. The final message keeps the same ID.

![Placeholder, attachment upload and final message commit](https://res.cloudinary.com/sycamore/image/upload/v1793212423/Typora/2026/10/29/onedrop-tech-upload.png)

The attachment goes under `files/year/month/message-ID/original-filename`, so two messages can carry files of the same name. Once upload returns a DriveItem, `replaceMessage()` commits `type: "file"` to the original chunk with an ETag check. The ETag is the server’s version marker: the check makes sure nothing else has modified the target chunk in the meantime. [Part two](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-two/) covers concurrent writes in detail.

| Failure point | What happens next |
| --- | --- |
| Placeholder registration | Try to remove a possibly written placeholder and return `upload-failed`. |
| Attachment upload fails or is cancelled | Try to remove the placeholder and retain failed local state for follow-up. |
| Upload succeeds but final commit fails | Return `reconciling`, keep the attachment details and allow a commit retry. |

`files/retry-commit` rebuilds the message from the existing attachment. If the final record already exists it returns it, without uploading again. These are separate writes; a later failure doesn’t roll back an earlier success. The intermediate state tells the client whether to retry the transfer or just the commit.

There’s a month-boundary edge case. Attachment paths use the request’s `createdAt`, but message writes obtain the target month with `getUtcMonth()` at call time. A long upload or retry across midnight at month end can separate the two. Version 1.0.3 doesn’t pin one immutable month context across the whole send.

### Upload sessions and chunks

Once you select a file, the UI hands the upload to the runtime on your device. The runtime handles authentication, transfers and storage. Extensions dispatch to the background runtime; the native iOS app uses its own entry point. Small files can be passed as Base64 and written to the target’s `/content` endpoint using HTTP PUT. Larger files stay as Blobs in shared IndexedDB. The runtime creates a [Graph upload session](https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0) with `createUploadSession` and sends successive slices to its dedicated URL, avoiding a large Base64 round trip.

#### Selecting a transfer method and chunk size

Chunking gives progress feedback on slow networks and reduces how much data must be retransmitted after a failure. Regular chunk sizes use [Graph’s 320 KB alignment](https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0#upload-bytes-to-the-upload-session); the final chunk carries the remainder.

OneDrop chooses 320 KB, 640 KB or 5 MB, respectively one, two or sixteen base units. Non-images larger than 4 MB use 5 MB chunks; other files of at least 1 MB use 640 KB; smaller files use 320 KB. Smaller chunks report progress sooner; larger ones reduce request count.

`shouldUseUploadSession()` starts using sessions at 320 KB. That threshold is OneDrop’s choice. `MAX_DIRECT_FILE_BYTES = 4 * 1024 * 1024` guards the direct upload function and helps select chunk size. Neither value is an overall attachment size limit.

![Choosing the upload method and chunk size separately](https://res.cloudinary.com/sycamore/image/upload/v1793271794/Typora/2026/10/29/onedrop-tech-chunk-size.png)

#### Validating and submitting chunks

Direct upload checks the decoded byte count against the file size; session upload checks the Blob size. For direct uploads, directory preparation and content transfer each have a twelve-second budget. Otherwise directory requests could use up nearly all the time before the upload even starts. User cancellation and timeout return distinct errors.

Creating the session requires a Graph token. After that the client sends slices directly to `uploadUrl` with `Content-Range: bytes start-end/total`. The end is inclusive, hence `end - 1` in the code.

A partial upload normally returns `202 Accepted`. A saved file returns `200 OK` or `201 Created` with the resulting DriveItem. The client validates its ID, name and size, constructs the attachment metadata and marks progress complete. If all local chunks have been sent but no completion response arrives, it reports an error. Sending the last byte alone doesn’t establish that Graph saved the file.

#### Retrying and recovering progress

Each chunk gets up to three attempts with waits of 500 milliseconds and one second. Although the code lists 429 and several 5xx statuses, errors enter the same catch block and other non-cancellation exceptions can also retry. It doesn’t use `Retry-After`. Cancellation aborts the current request with `AbortController`.

A manual resend checks for an existing file at the original path with the same name and size. It can reuse that object, but doesn’t compare content hashes. Progress includes acknowledged bytes, the current chunk end and historical average speed. The UI uses that average to estimate progress. Failing to read or write local speed statistics doesn’t stop the transfer. The loop doesn’t persist the upload URL or offset or query the server for missing ranges after a restart, so closing the program can’t resume the session at its last chunk.

### Downloads and file reuse

#### Download addresses and image previews

OneDrop looks up `@microsoft.graph.downloadUrl` by DriveItem ID, then delegates to the platform. The URL is temporary. The persistent message stores the ID.

For inline image previews it can also read `/content`, Base64-encode the bytes and build a data URL for the UI. This preview path has a 4 MB limit, checked after reading the content. Ordinary uploads and downloads have separate rules.

#### Reusing a download

The desktop extension maps cloud DriveItem IDs to browser download IDs. On reopening, it checks whether the download still exists, finished or was interrupted. It reuses a valid entry and discards a stale one before downloading again. Save As and forced downloads bypass reuse.

![Checking and reusing an existing browser download](https://res.cloudinary.com/sycamore/image/upload/v1793271800/Typora/2026/10/29/onedrop-tech-download-reuse.png)

`openExistingDownload()` returns false for a missing record, removed file or interrupted download. An active transfer returns its status; a completed one records the new open operation.

#### Confirming completion

`browser.downloads.download()` receives the URL, filename and options such as whether to show Save As. Its returned `downloadId` identifies a started browser task. It’s independent of the cloud `driveItemId`. The client removes control and path characters from filenames and handles name collisions.

It calls `browser.downloads.search({ id: downloadId })` to check for `in_progress`, `complete` or `interrupted`. A completed file that still exists can be registered; interruption returns an error. For an active download it adds a [downloads.onChanged listener](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/onChanged), which receives the browser task ID and the properties that changed. OneDrop filters events by ID and queries the full task state again. It removes the listener once the outcome is known.

A download can finish between the first query and listener registration. If the new listener misses that notification, the UI can wait for a download that has already finished. An immediate second query closes that gap. In the code, `finish()` queries the state and handles the result:

```typescript
browser.downloads.onChanged.addListener(onChanged);
// 注册回调后，再检查一次当前下载状态。
void finish();
```

Only a confirmed completion saves the mapping for reuse. An ordinary download interrupted with `FILE_EXISTS` gets up to three attempts to find an available name. Save As leaves the failure for the user to handle. A file already saved on the user’s device remains theirs when a cloud message is removed.

---

At this point messages and attachments are on OneDrive. [Part two](/en/software-development/app-development/onedrop-storage-and-multi-device-sync-part-two/) follows what happens when other devices read and modify them, and how archives and deleted records are maintained.
