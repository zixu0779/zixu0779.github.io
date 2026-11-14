---
translation_id: onedrop-storage-sync-1
title: OneDrop 的消息存储与多端同步（上）
date: 2026-10-06 19:42:08
updated: 2026-10-29 02:54:42
categories: [["软件开发", "应用开发"]]
tags: ["OneDrop", "OneDrive", "TypeScript", "Microsoft Graph", "Edge插件开发"]
---

[《基于 OneDrive 的跨设备传输工具》](/软件开发/应用开发/OneDrop：基于%20OneDrive%20的跨设备传输工具/)中，大致介绍了 [OneDrop](https://github.com/zixu0779/OneDrop) 项目，包括它目前的安装方式和后续计划等内容。
本文为实现部分的一些算法和思路的分享，分成上下两篇。这篇先讲 Microsoft 账户怎样接入，以及文本和文件怎样保存、上传和下载。
下篇接着说明多台设备怎样同步消息，以及冲突、归档、删除和恢复的处理。

---

OneDrop 不自建服务器，省去了部署和维护一套存储服务的工作，但客户端仍然需要处理消息本身的状态。
比如两台设备可能同时修改一份记录，文件可能已经上传而消息提交失败，删除操作也需要让其他设备知道。

本文以 [OneDrop 1.0.3](https://github.com/zixu0779/OneDrop/releases/tag/v1.0.3) 版本为准，平台入口、共享界面与 OneDrive 存储关系如下图所示。
![OneDrop 的平台入口、共享界面与 OneDrive 存储关系示意](https://res.cloudinary.com/sycamore/image/upload/v1793212421/Typora/2026/10/29/onedrop-tech-architecture.png)

## Microsoft 账户与 OneDrive 授权

### 客户端授权流程

OneDrop 通过 [Microsoft Graph](https://learn.microsoft.com/en-us/graph/overview) 访问 OneDrive。
Microsoft Graph 是 Microsoft 提供的 API 入口，可以查询和读写云端文件。

这里的客户端包括安装在 Edge 中的浏览器扩展，以及独立安装的 iOS 应用。
它们都运行在用户设备上，登录和文件请求交给 Microsoft 的服务处理，OneDrop 没有另搭一套服务端。
下文的“浏览器扩展”指安装形式，“客户端”则是对这些本地程序的统称。

#### 用 PKCE 完成授权

请求直接从客户端发出，因此首先要解决的是用户授权。
扩展包和应用包都要分发给用户，所以不能把需要保密的服务端密钥放进里面。
基于这样的使用场景，当前使用[带 PKCE 的授权码流程](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)：先让用户在 Microsoft 页面登录和授权，再由客户端拿授权码换取访问令牌。

先看一次登录请求里的 PKCE 流程：

客户端先生成一段随机的 `verifier`，对它做 SHA-256 摘要，再将摘要编码为 Base64URL 字符串，得到 `challenge`。
打开授权页时只发送 `challenge`；收到授权码以后，再把原始 `verifier` 一起交给 `token` 接口。
服务端按同样方法计算摘要，确认它与本次授权请求中的 `challenge` 一致，才继续兑换。
这样即使别人拿到授权码，也还需要对应的 `verifier`，不能只凭授权码完成这次兑换。
OneDrop 的生成代码如下：

![生成 PKCE verifier 和 challenge 的源码](https://res.cloudinary.com/sycamore/image/upload/v1793271791/Typora/2026/10/29/onedrop-tech-pkce.png)

这里，`64` 表示生成随机内容时使用的字节数，之后还要转换成 Base64URL 字符串。
授权请求把 `code_challenge_method` 设为 `S256`，告诉 Microsoft 使用 SHA-256 校验。
同时生成一个独立的随机值 `state`，由 Microsoft 在登录回调中原样带回；客户端核对它，确认收到的结果对应自己发起的这次登录。
缺少授权码、`state` 不一致或者授权页面返回错误，都会中止兑换。

#### 登记应用与配置填写

如果要自行构建 OneDrop，先要在 Microsoft Entra 中注册应用。
[Entra](https://entra.microsoft.com/) 是 Microsoft 管理应用登录与授权配置的服务，应用注册相当于先登记“是谁在请求用户登录”。
使用已经发布的安装包时，这些信息已随构建配置好，用户只需登录自己的账户。

客户端的配置中一共有三个值：

- **Client ID：哪一个应用在发起登录。**
  在 Entra 管理中心进入“Entra ID → 应用注册（App registrations）”，新建或打开自己的应用，在“概述（Overview）”中复制“应用程序（客户端）ID / Application (client) ID”。
  它标识的是 OneDrop 这份应用注册，不是用户的 Microsoft 账户，也不是密码。
- **authority：到哪里登录、允许哪类账户登录。**
  OneDrop 默认使用 `https://login.microsoftonline.com/common`，这是 Microsoft 提供的公共登录入口。
  `common` 可面向工作、学校和个人 Microsoft 账户，但 Entra 中应用注册下面的“支持的账户类型”也要允许对应账户；要沿用这样的范围，应选择包含个人账户的多租户选项。
- **Redirect URI：登录完成后把结果送到哪里。**
  它不是 OneDrive 文件目录，而是客户端接收授权结果的地址。在应用注册的“身份验证（Authentication）”中登记这个地址，实际请求中的值必须与登记值匹配。

浏览器扩展的回调方式取决于浏览器提供的登录接口。
Identity API 是浏览器提供给扩展的一组身份验证接口，OneDrop 用它生成回调地址、打开授权窗口，并接收登录结果。
在本文对应的适配中，桌面 Edge 提供这些接口；Android Edge 也使用扩展回调地址，但可能遇到无法创建授权窗口的情况；iOS Edge 没有提供 Identity API，因此使用网页回调。

如果运行 OneDrop 的浏览器提供 `getRedirectURL` 接口，`browser.identity.getRedirectURL("auth")` 会返回类似 `https://<extension-id>.chromiumapp.org/auth` 的地址，其中 `<extension-id>` 是当前扩展的 ID。
尚未填写 Client ID 时，OneDrop 的配置提示页会显示 **Redirect URI**，可以复制之后再到 Entra 中登记；不要直接复制另一份扩展包的 ID。

如果浏览器没有提供这个接口，OneDrop 改用预先配置的网页回调地址，当前默认是 `https://onedrop.sycamore.top/auth.html`，按 SPA（单页应用）类型登记。
自行部署时若更换回调页，也要同步修改本地配置和 Entra 中的地址。

在项目根目录的 `.env.local` 中填写这些构建配置：

```bash
WXT_ONEDROP_ENTRA_CLIENT_ID=从应用概述页复制的客户端ID
WXT_ONEDROP_ENTRA_AUTHORITY=https://login.microsoftonline.com/common
# 浏览器未提供回调地址生成接口时使用的网页地址
WXT_ONEDROP_TAB_REDIRECT_URI=https://onedrop.sycamore.top/auth.html
```

修改后需要重启开发服务、重新加载扩展，让新配置生效。
应用注册的位置和字段可对照 Microsoft 的[注册说明](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)，账户范围则见[配置说明](https://learn.microsoft.com/en-us/entra/identity-platform/msal-client-application-configuration)。

#### 声明需要的权限

应用身份配置好以后，还要声明“希望得到什么权限”。
代码中的 `SCOPES` 就是随登录请求发送的权限范围列表：

```typescript
const SCOPES = [
  "openid",
  "profile",
  "offline_access",
  "https://graph.microsoft.com/Files.ReadWrite",
] as const;
```

这四项各有用途：

- `openid`：请求登录身份信息，使客户端可以取得 `ID token`，用来识别登录的用户。
- `profile`：请求姓名、用户名等基本资料，供账户界面显示。
- `offline_access`：请求刷新令牌，以便访问令牌过期后申请新的令牌，减少重复登录。这里的“offline”不是指断网时仍能访问 OneDrive。
- `Files.ReadWrite`：请求代表当前登录用户读写其文件。在应用注册的“API 权限 → 添加权限 → Microsoft Graph → 委托权限”中选择并添加 `Files.ReadWrite`。
  这里的 **委托权限**（Delegated permissions）就是以登录用户身份访问，而不是让应用脱离用户独立访问。

这些委托权限是 Microsoft 定义的，客户端提出请求，用户或所在组织允许授权后，才取得相应访问能力。
几项登录权限的具体含义可查看[官方说明](https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc)。

`Files.ReadWrite` 的授权范围比 OneDrop 的数据目录更大，并不只限于 `Apps/OneDrop`。
当前程序把消息和附件放在这个目录，是实际代码选择的读写位置；创建一个应用文件夹，并不会自动把已取得的权限缩小到这个文件夹内。

### 登录窗口与登录状态

#### 授权窗口与标签页登录

桌面 Edge 优先使用 Identity API 中的 `browser.identity.launchWebAuthFlow`，回调地址由前面提到的 `getRedirectURL("auth")` 生成。

如果浏览器没有提供 `launchWebAuthFlow` 接口，OneDrop 会在临时标签页中打开授权页面。
如果浏览器提供了该接口，但调用后返回“无法创建浏览器窗口”的错误，OneDrop 也会改用临时标签页继续登录。

因此 Entra 中登记的回调地址必须与实际入口一致，不能只配置一个地址就认为所有构建都能使用。

下面是根据浏览器接口选择授权窗口或临时标签页的源码片段：

![根据浏览器接口选择登录入口的源码截图](https://res.cloudinary.com/sycamore/image/upload/v1793267304/Typora/2026/10/29/onedrop-tech-login-flow.png)

标签页登录还会多一层恢复处理。
当浏览器没有提供 `launchWebAuthFlow` 接口时，程序会把 `state`、`verifier`、回调地址和发起时间保存到本地；重新查询登录状态时，先检查标签页是否已经到达回调地址，再完成兑换。

这里把需要用户操作登录窗口的流程称为交互登录；尝试沿用已有登录会话、不再次让用户输入信息的流程称为静默登录。
本地保存的待授权信息只保留五分钟，交互登录等待五分钟，静默登录等待三十秒。

**注意：** 上面说的时间，其目的是对一次授权流程获取的信息进行限制，这个时间不是登录成功后获得的 `access token` 的有效期。

#### 令牌的用途与保存

登录成功后会得到用途不同的令牌：`access token` 用于请求 Graph，`refresh token` 用于换取新的 `access token`，`ID token` 则携带用户身份信息。

浏览器扩展会把这些 `token` 保存在 `browser.storage.local`。
这是因为，浏览器关闭侧栏后，扩展执行后台任务要用到的环境也可能被浏览器停止，所以需要把令牌写入本地存储，这样下次启动时还可能读回，不必依赖一直存活的后台进程。
原生 iOS 使用系统钥匙串保存令牌，具体适配放在[《OneDrop 的跨平台适配》](/软件开发/应用开发/OneDrop%20的跨平台适配/)说明。

#### 令牌刷新与重新登录

每次需要访问 Graph 时，`getCurrentAccessToken()` 都会先检查令牌是否仍可使用。
代码预留了六十秒余量，接近过期时使用 `refresh token` 刷新，并通过一个共享的 `refreshInFlight` `Promise` 合并同时发生的刷新请求。
否则几个并行读取操作可能各自刷新一次，既增加请求，也容易让本地保存顺序变得混乱。

下图中，`refreshInFlight ??=` 会复用尚未结束的刷新任务。任务结束后再清空它，让下一次需要刷新时可以重新发起请求。

![复用令牌刷新任务的源码截图](https://res.cloudinary.com/sycamore/image/upload/v1793267307/Typora/2026/10/29/onedrop-tech-token-refresh.png)

刷新失败也区分原因。
普通接口失败会返回错误；遇到 `invalid_grant`、`interaction_required` 等需要重新授权的情况，程序先尝试 `prompt=none` 的静默授权。
当静默授权也不能继续时，才会清掉已保存的 `token`，让界面回到需要登录的状态。
退出 OneDrop 会清理它自己的 `token`，并不会同时退出浏览器中的 Microsoft 账户。

界面上的姓名和用户名来自 `ID token` 的解码结果。
对应函数叫做 `readUnverifiedIdTokenClaims`：它解码 `ID token` 中的字段，并没有在客户端完成签名验证。
这些字段用于账户信息显示；用户名也会作为静默授权的 `login_hint`，提示 Microsoft 优先使用哪个账户。

### Apps/OneDrop 存储目录

消息、附件和设置都统一放在 `Apps/OneDrop` 下，各台设备就能从同一个位置找到数据，不需要分别记录一套目录位置。
用户也可以在 OneDrive 中直接找到这个文件夹，查看和管理 OneDrop 的文件；需要恢复目录时，程序仍按约定路径逐级检查。

目前的逻辑中，获得 `token` 后，程序还会确认存储目录是否存在。
当前使用 Graph 路径 `/me/drive/root:/Apps/OneDrop`：`me` 指当前登录用户，`drive/root` 指其 OneDrive 根目录，后面是相对根目录的文件夹路径。
程序先检查这个位置，如果返回 404，表示目录缺失，然后再创建需要的目录。

这种显式路径也让目录恢复逻辑更加方便：`Apps` 不存在就创建 `Apps`，`OneDrop` 不存在再创建应用目录。
创建时使用冲突失败策略，即如果另一台设备已经抢先创建，就重新读取现有目录，停止创建流程。
如果直接覆盖同名对象，就可能破坏另一台设备已经创建或写入的内容。
下篇的消息块写入和归档也会用到相似的处理方式。

## 文本与文件怎样保存和传输

### 分离消息记录和附件

#### 云端目录结构

消息列表里文字和文件放在一起，但在 OneDrive 中不以相同方式保存。
文本本身很小，可以直接放进 JSON；文件则应该单独上传，消息里只保存它的位置和显示所需的信息。
下面以示意年月展示目录关系：

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

`messages` 保存当前使用的分块消息记录，`archive` 保存已经归档的月份，`files` 保存附件。
设置单独放在 `settings` 中，分设备存放，这样避免一次修改设置就要重写整份记录。
`tombstones` 则保存按消息 ID 登记的删除标记，读取消息时会先检查这份记录，并剔除消息中标记为删除的记录。
月份统一按 UTC（协调世界时）划分，避免不同设备因本地时区不同，把同一条消息分进不同月份。

#### 消息字段与数据校验

消息模型通过 Zod 定义。
Zod 是数据校验库，这里既用它描述消息结构，也用它检查实际读到的数据，避免仅有 TypeScript 类型、读入的 JSON 却不符合约定。

基础字段包括表示数据格式版本的 `schemaVersion`、UUID 格式的消息标识 `id`、创建时间 `createdAt`，以及可选的发送设备标识 `senderDeviceId`。
UUID 是一种通用的唯一标识格式，这里用来区分消息，后续重试和合并操作也要依靠唯一的 ID 找到原记录。
注意：这里的 `senderDeviceId` 是每份安装生成的设备标识，用来区分本机与其他设备发送的内容，不是 Microsoft 账户 ID。

这些公共字段的定义如下，后面的文字和文件消息都在此基础上补充各自字段：

```typescript
const messageBaseSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  senderDeviceId: z.uuid().optional(),
});
```

不同类型再补自己的字段。
文本的规则很直接：

```typescript
export const textMessageSchema = messageBaseSchema.extend({
  type: z.literal("text"),
  text: z.string().trim().min(1).max(20_000),
});
```

文本首尾的空白会先被裁掉，裁剪后不能为空，长度上限是 20,000。
文件消息则包含 `attachment.driveItemId`、文件名、大小和 MIME 类型，还可以携带图片宽高与 `thumbHash`。
`DriveItem` 是 Graph 对文件或文件夹的描述，`driveItemId` 用来定位具体对象；MIME 类型则说明内容属于哪种格式，例如 `image/png`。
这些信息让界面不用先下载完整文件，就能显示附件名称、大小和图片占位；真正取文件时仍然通过 `driveItemId` 访问云端对象。

多条消息会组成一个消息块，块本身也有 `schemaVersion`、`month` 和 `messages` 数组。
读取云端 JSON 时，程序同样会通过 Zod 检查块的结构，以及其中每条消息的字段格式和内容限制。
OneDrive 文件可能被用户手动编辑、移动或损坏，因此程序不能假定“文件曾经由自己写入，就永远符合类型定义”。

对于图片消息，发送前还会尝试读取原始宽高，并生成 ThumbHash，用一段较短的数据保存模糊预览。
程序优先用 `createImageBitmap` 解码，失败时回退到本地图片对象；然后保持比例，把最长边缩到不超过 100 像素，在临时 canvas 上读取 RGBA，再生成 ThumbHash。
缩小的只是用于计算占位的画布，上传附件仍然是原来的文件。
元数据读取失败会返回空结果，文件仍可继续发送，只是没有这部分预览信息。

下图是图片加载时来自 ThumbHash 的模糊预览。

![图片加载时的 ThumbHash 模糊预览和加载状态](https://res.cloudinary.com/sycamore/image/upload/v1793270442/Typora/2026/10/29/onedrop-tech-thumbhash-preview.png)

### 本地待发送任务

发送过程中需要保留一些还不能算作云端消息的内容：
用户输入的文字、待上传的文件、正在提交还是提交失败，以及重试需要的附件信息。

这些任务需要在重新打开界面后继续读取，不能只保存在内存中。
浏览器扩展还会遇到 Manifest V3 的 [service worker 被终止](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)的情况，因此需要把未完成的任务保存到本地。

OneDrop 使用浏览器中的本地数据库 IndexedDB 保存这些任务。
待发送文字保存在 `pending text` 记录里，待传输附件保存在 `pending transfer` 记录里；文件的二进制内容以 `Blob` 对象保存，重试时可以重新取出。

下面是待传输任务的保存和读取方法。`putPendingTransfer()` 写入记录，`getPendingTransfer()` 按 ID 读取单个任务，`listPendingTransfers()` 则按创建时间列出任务。

![保存和读取本地待传输任务的源码](https://res.cloudinary.com/sycamore/image/upload/v1793271796/Typora/2026/10/29/onedrop-tech-pending-storage.png)

本地记录和云端记录的职责不同。
云端保存其他设备应当读到的消息；本地 `pending` 记录保存当前设备尚未完成的工作。
界面可以先展示发送状态，但只有云端步骤完成以后，才把它当成已发送。
重试也需要保留同一条消息的标识，用来判断云端是否已经存在对应记录，而不是简单地再生成一条相同文本。

### 文件发送流程

文件上传最容易混淆的地方，是“附件已经传完”和“消息已经发送”并不是同一件事。
OneDrop 中，对文件发送请求（`files/send`）的处理，顺序是先登记占位、再上传附件、最后替换成正式文件消息。

占位记录的类型是 `file-uploading`，里面放的是 `pendingAttachment`，此时还没有最终的 `driveItemId`。
其他设备读到它，就知道有一个附件正在发送，而不用等整个文件上传完以后才第一次看到消息。
占位与最终消息沿用相同的消息 ID。

![OneDrop 文件发送的云端占位、附件上传与消息提交过程示意](https://res.cloudinary.com/sycamore/image/upload/v1793212423/Typora/2026/10/29/onedrop-tech-upload.png)

登记成功以后才开始传文件。
附件放在 `files/年/月/消息ID/原文件名` 下，每条消息都有独立目录，因此两个同名文件不必争用同一个路径。
上传成功返回 `DriveItem` 信息，再调用 `replaceMessage()` 把原来的占位换成 `type: "file"`。
这次替换同样需要检查目标块的 ETag，也就是服务端给文件附上的版本标记，确认远端内容没有在这期间被其他操作修改。
[《下篇》](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（下）/)会结合两台设备同时发送的情况，说明它怎样避免覆盖。

失败的位置会决定后续操作：

| 失败阶段 | 当前处理 |
| --- | --- |
| 占位登记失败 | 尝试移除可能已经写入的占位，返回 `upload-failed` |
| 附件上传失败或取消 | 尝试清掉占位，本地保留失败状态与后续处理责任 |
| 附件成功，正式消息替换失败 | 返回 `reconciling`（附件已上传，等待补交消息），保留附件信息，允许重试提交 |

最后一种情况发生时，不需要立刻把文件重新传一遍。
`files/retry-commit` 会用已有附件信息再次构造正式消息并尝试替换；如果目标已经是正式文件消息，替换函数会返回现有结果。
这里要分别写入占位、附件和正式消息，其中一步失败，并不会自动撤销前面已经完成的步骤。
程序因此需要保存“做到哪一步”的中间状态，失败后才能判断应该重新传文件，还是只补交消息。

消息时间和目标月份还来自两个不同位置。
`createdAt` 来自请求，附件目录也由这个时间计算；月消息写入的目标则在调用时通过 `getUtcMonth()` 取得。
通常它们属于同一个月，但长时间上传或跨月重试时不能把两者视为天然相等。
当前代码还没有把整个发送流程固定到一个不可变化的月份上下文中。

### 上传会话与分片

界面选好文件以后，需要把上传任务交给负责传输的业务代码。
这里把处理登录、传输和存储请求的这部分代码称为运行时。

浏览器扩展的界面把请求交给后台处理；原生 iOS 应用则接到自己的处理实现，它们都在用户设备上运行。
小文件可以先编码成 Base64 字符串，随请求交给运行时，再通过 HTTP `PUT` 请求把文件写入目标路径的 `/content` 接口。
更大的内容保留在共享 IndexedDB 中，由运行时读取 `Blob` 后使用 [upload session](https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0)（上传会话）。
`upload session` 是 Microsoft Graph 提供的上传方式：先调用 `createUploadSession` 创建会话，取得专用的上传地址，再按顺序把文件分片发送到这个地址。
这样也避免了把整个大文件变成 Base64 字符串，在界面和运行时之间来回传递。

#### 选择上传方式与分片大小

访问 OneDrive 的速度会受到网络环境影响，较大的请求可能需要等待较长时间。
分片后，某一片传输失败时可以单独重试，减少这次失败需要重传的数据量；每完成一片，也能更新已确认上传的字节数，让进度条更直观地反映上传进展。

分片大小遵守 [Graph 的要求](https://learn.microsoft.com/en-us/graph/api/driveitem-createuploadsession?view=graph-rest-1.0#upload-bytes-to-the-upload-session)：常规分片按 **320 KB** 的整数倍划分，最后一片发送剩余内容。

OneDrop 在这个基础上选择了三档大小：320 KB、640 KB 和 5 MB，分别是基准的 1 倍、2 倍和 16 倍。
大于 4 MB 的非图片文件使用 5 MB 分片；其余达到 1 MB 的文件使用 640 KB 分片，更小的文件使用 320 KB 分片。
较小的分片便于在慢速网络下较快获得一次上传反馈，较大的分片则能减少大文件需要发送的请求次数。

代码通过 `shouldUseUploadSession()` 判断是否采用上传会话，当前从 **320 KB** 开始使用。
这个起始阈值是 OneDrop 的选择，Graph 对分片对齐的要求并不意味着所有达到 320 KB 的文件都必须分片上传。
`MAX_DIRECT_FILE_BYTES = 4 * 1024 * 1024` 则是直接上传函数的上限保护，同时参与分片大小选择；正常发送仍然按 320 KB 阈值分流。
这些数值用于选择上传方式和分片大小，不是整个文件的大小上限。

分片大小由下面的函数决定。它与 `shouldUseUploadSession()` 分开，分别处理“是否分片”和“每片多大”：

![选择上传方式和分片大小的源码](https://res.cloudinary.com/sycamore/image/upload/v1793271794/Typora/2026/10/29/onedrop-tech-chunk-size.png)

#### 校验内容与提交分片

直接上传会先检查 Base64 解码后的字节数是否与文件大小一致，会话上传则检查 `Blob` 大小。
直接上传的目录准备和真正内容传输分别获得十二秒预算，避免前面几次目录请求用掉大半时间以后，实际上传立刻超时。
用户取消和请求超时也会返回不同的错误，便于界面提示下一步操作。

创建 `upload session` 时使用 Graph `token`，拿到 `uploadUrl` 后，后续请求直接向这个地址发送 `Blob` 切片。
每片带上 `Content-Range: bytes start-end/total`，其中结束位置是包含在范围内的下标，所以代码写作 `end - 1`。

分片还没有全部上传完成时，服务端通常返回 `202 Accepted`，客户端继续发送下一片。
最后一片上传完成、服务端保存文件后，会返回 `200 OK` 或 `201 Created`，响应中包含最终文件的 `DriveItem` 信息。
此时 OneDrop 再解析其中的文件 ID、名称和大小，检查字段格式，将它们整理成附件信息，并把上传进度更新为完成。

如果本地已经发完所有分片，却始终没有收到这个完成响应，程序就会报错，毕竟不能仅凭“分片都发出去了”就认定附件已保存成功。

#### 失败重试与进度恢复

分片重试最多尝试三次，中间等待 500 毫秒和 1 秒。
代码列出了 429 和几种 5xx 响应，但错误会进入同一个 `catch`，非取消异常也可能继续尝试。
因此，当前重试行为并没有严格限定在列出的几种 HTTP 状态内，也没有读取 `Retry-After` 来调整等待时间。
取消时则通过 `AbortController` 停止正在执行的请求。

手动重发还可以检查原上传路径是否已有同名、同样大小的文件，存在时直接复用这个对象。
这里比较的是路径和大小，没有校验内容哈希；它减少了部分重复上传，但不提供文件内容完全相同的验证。

进度信息包括已经确认上传的字节数、当前分片结束位置和历史平均速度。
平均速度只是帮助界面估计进度，读写这部分本地统计失败不会阻止上传。
当前会话循环没有持久化 `uploadUrl` 和上传偏移，也没有在重启后向服务端查询缺失范围。
因此程序退出后，还不能直接接着原会话的最后一个分片继续传输。

### 下载记录与文件复用

#### 下载地址与图片预览

下载时先通过 `driveItemId` 查询 `@microsoft.graph.downloadUrl`，再交给对应平台处理。
注意：这个下载地址是临时取得的，消息 JSON 中长期保存的是对象 ID，不是一次下载得到的 URL。

除了把附件下载到本地，消息列表还需要直接显示图片。
为此，OneDrop 提供了一个图片预览接口，从 `/content` 读取字节，转换成 Base64 后组成 data URL，让页面直接用这个地址展示图片。
data URL 将图片内容包含在地址字符串里，这个预览接口限制在 4 MB 以内。
大小检查则发生在内容读完以后，这个数值约束的是该预览接口，不是普通附件下载或上传的大小上限。

#### 复用已有下载

桌面扩展维护一份 `driveItemId` 与浏览器下载 ID 的对应记录。
再次打开附件时，先检查浏览器里的下载是否还存在、是否完成、是否中断；有效的已有记录可以复用，失效记录则删除后重新下载。
“另存为”和强制重新下载会绕过这一步。

`openExistingDownload()` 负责检查已有下载。记录不存在、文件已移除或下载中断时返回 `false`；下载仍在进行时返回其状态，已经完成时则登记本次打开。

![检查和复用已有下载记录的源码](https://res.cloudinary.com/sycamore/image/upload/v1793271800/Typora/2026/10/29/onedrop-tech-download-reuse.png)

#### 确认浏览器下载完成

桌面扩展通过 `browser.downloads.download()` 把下载任务交给浏览器，传入下载地址、文件名，以及是否弹出“另存为”窗口等选项。
调用成功后取得的 `downloadId` 是浏览器分配的任务编号，只表示下载已经开始，不代表文件已经下载完成；它与 OneDrive 中的 `driveItemId` 是两套不同的标识。
下载处理还会清理文件名中的控制字符和路径字符，并为同名文件处理后缀。

为了确认下载结果，OneDrop 先调用 `browser.downloads.search({ id: downloadId })`，查询这项任务的当前状态。
`in_progress` 表示正在下载，`complete` 表示下载完成，`interrupted` 表示下载中断。
如果已经完成且文件未被标记为不存在，就可以继续保存下载记录；如果已中断，则返回对应错误。

任务还在进行时，程序通过 [`browser.downloads.onChanged.addListener()`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/onChanged) 注册一个回调函数。
这就是这里说的“监听”：浏览器中的下载任务发生状态等属性变化时，会调用这个函数，把发生变化的任务 ID 和属性传进来。
OneDrop 先检查 ID 是否对应当前附件，再查询这项任务的完整状态；确认完成或中断后，移除回调，结束等待。

注册回调后，程序还会立即查询一次状态。
因为文件可能恰好在“第一次查询结束”和“回调注册完成”之间下载完，那次完成通知就不会被新注册的回调收到。
补查一次就能发现这种情况，避免文件已经下载完，界面却还在等待完成通知。代码中的 `finish()` 负责查询和处理结果：

```typescript
browser.downloads.onChanged.addListener(onChanged);
// 注册回调后，再检查一次当前下载状态。
void finish();
```

确认下载完成后，OneDrop 才保存 `driveItemId` 与 `downloadId` 的对应关系，供下次打开附件时复用。
普通下载遇到 `FILE_EXISTS` 中断时，最多尝试三次选择可用名称；“另存为”则把这次失败交给用户处理。
因此 OneDrop 管理的是下载登记信息，已经由用户保存到本地的文件并不会因为云端消息删除而跟着被删除。

---

到这里，消息和附件已经可以保存到 OneDrive，但另一台设备还需要读取这些内容，多台设备也可能同时修改同一份记录。
[《下篇》](/软件开发/应用开发/OneDrop%20的消息存储与多端同步（下）/)接着讨论消息同步、写入冲突，以及归档和删除后的数据维护。
