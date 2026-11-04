# Steam 家庭库每日同步

每天北京时间 08:17，由 GitHub Actions 更新；定时任务可能受 GitHub 队列延迟。当前家庭库接入须完成首次授权与一次云端验证，不能把本地测试通过视为已启用。

## 首次授权与重新授权

在仓库根目录执行（需要 Node 24 和已登录本仓库的 `gh`）：

```sh
npm ci --prefix lib/steam-auth --ignore-scripts --no-audit --no-fund
node lib/steam-auth/login.cjs
```

打开 `http://127.0.0.1:46801`，准备好手机后点击“生成二维码”，用 Steam 手机 App 扫码确认。核对账号 `76561199368056520`，不要将密码、验证码或令牌发到聊天、日志或 Git 仓库。本机单次等待最多 5 分钟，不代表 Steam 保证二维码有效 5 分钟；失效时在页面点击重新生成即可。若端口被占用，先结束前一个授权进程。

脚本使用 MobileApp 类型的独立登录会话，验证账号与刷新能力后：

- 将随机 AES-256-GCM 解密密钥经 `gh secret set` 的标准输入写入仓库 Secret `STEAM_TOKEN_KEY`。
- 将刷新凭据加密写入 `.github/steam-session.enc.json`。此文件可以提交，但解密密钥不可以。
- 不保存 Steam 密码，也不输出任何令牌。无需 `STEAM_ACCESS_TOKEN` Secret。

授权成功后，提交密文和配套同步实现，再手动执行一次 `Sync Steam`，确认采集与发布成功。重新授权会更换密钥，因此新的密文也必须立即同步到 source 分支，旧密文不能继续使用。

## 自动续期和持久化

每日任务先解密刷新凭据，调用 Steam 的续期方法取得新的访问令牌。Steam 是否轮换刷新凭据由服务端决定；轮换后旧凭据可能立即失效，因此先保存新密文、上传加密恢复副本并推送 source，再开始采集。访问令牌仅经掩码后的运行环境传递，不写入站点或产物。

所有刷新凭据只以密文存在。`STEAM_TOKEN_KEY` 仅在续期步骤提供。无需新增具有修改 Secrets 权限的 GitHub PAT。执行中的工作流不能相互取消。

若 Steam 撤销授权、凭据过期、家庭接口出错，任务失败并保留已有站点快照。收到 GitHub Actions 失败通知后查看步骤状态；凭据失效时重新扫码，不承诺无限期免登录。

若续期成功但 source 推送失败，失败运行的 `steam-encrypted-session` artifact 保存了新密文（30 天）。恢复该文件到 source 后再运行；不要恢复旧的已失效凭据。若恢复副本也丢失，重新扫码。

## 数据范围与校验

用 `GetFamilyGroupForUser` 定位家庭，用 `GetSharedLibraryApps` 读取该账号可用的家庭游戏，与自有游戏按 App ID 合并。软件、不可共享条目不会计入游戏数；不发布家庭 ID、其他成员 ID 或其游玩时长。所有统计采用当前账号的记录。

接口并非稳定公开契约，需要首次对照 Steam 客户端确认范围和时长；非 Steam 快捷方式、本地隐藏分类等客户端状态不在此接口中。未取得真实家庭数据之前不显示虚构的家庭库数量。

检查命令：

```sh
node tests/steam-auth.test.js
node tests/steam-family.test.js
node tests/steam-sync.test.js
node tests/steam.test.js
```

依赖依据：[steam-session](https://github.com/DoctorMcKay/node-steam-session#renewrefreshtoken)、[家庭接口协议](https://github.com/SteamTracking/Protobufs/blob/master/steam/steammessages_familygroups.steamclient.proto)。

## 仅展示已分类合集

`source/_data/steam-display.json` 保存允许展示的 App ID，不包含合集名称或其他 Steam 私人配置。本机导出命令：

```sh
node lib/steam-collections.cjs classified
```

仅只读当前账号的 Steam 合集缓存及待同步修改；合并所有非删除的静态合集，排除移除项及隐藏项。当前不支持动态合集规则，遇到它会报错而非悄悄导出不完整名单。名单与当前家庭库取交集。

GitHub Actions 每天从云端下载 namespace 1，更新全部已分类静态合集的并集。上面的本机导出命令仅作为故障排查备用，日常不需要手动导出。读取或解析失败会停止本次发布，保留线上已有名单。动态合集暂不支持，遇到规则型合集会明确失败。

### 本地待发布的展示名称与分页

`steam-display.json` 的 `titles` 按 App ID 配置中文显示名和可选 `edition`。原始同步名称不改写，标题提示保留原名；未知游戏使用同步名称。重新导出合集时保留这些名称配置。游戏列表先排序、筛选，再按每页 12 款分页；切换排序或筛选回到第一页。总游戏数与时长仍统计全部游戏库。

### 云端合集调查（2026-11-04）

已在 Steam 客户端 `sp.js` 的 `DownloadFromServer` 中确认：通过 `m_CMInterface.GetServiceTransport()` 调用 `CloudConfigStore.Download#1`，传入 namespace/version，返回 entries。来源：https://github.com/SteamTracking/SteamTracking/blob/master/ClientExtracted/steamui/sp.js 。这是已登录 CM 连接上的统一消息，不能把未认证 HTTP 探测的 404 当作没有云端接口。

旧版 MobileApp 授权面向 web/mobile；现已迁移到面向 web/client 的客户端授权。一个客户端会话既读取云端合集，也生成家庭库使用的网页访问令牌。

### 客户端单凭据接入

本地 `lib/steam-auth/login.cjs` 现在请求 SteamClient QR 授权。二维码仅在本机页面按需生成；程序先建立 CM 连接，下载 namespace 1 合集，并验证同一会话生成的网页访问令牌可读取家庭库。两项成功后，才更新 `STEAM_TOKEN_KEY` 与加密状态文件，不额外增加登录密钥。无需提交账号密码。

`client.cjs` 固定 steam-user 5.3.0，通过其 CM 消息发送接口调用 `CloudConfigStore.Download#1`；每日开启 `renewRefreshTokens`，在 refreshToken 事件中立即加密保存轮换后的凭据。工作流继续每天 08:17（上海时间）运行，保存加密恢复副本，再采集、发布。移动端旧状态保留兼容路径，迁移成功后仅使用客户端状态。

已完成协议编解码（含 Steam 返回的 ByteBuffer）、合集解析、失败拒绝和加密轮换单元验证。2026-11-04 本机真实客户端会话读取 73 个已分类 App ID，家庭库验证通过；已实际请求续期，Steam 本次未签发替换 refresh token。GitHub Actions 完整运行 [41828865002](https://github.com/zixu0779/zixu0779.github.io/actions/runs/41828865002) 已成功完成登录续期、合集下载、家庭库采集和站点数据发布。真实轮换仍取决于 Steam 是否签发新 token，不能将本次未轮换说成轮换已实测。

本地待发布的显示规则：先拆出版本标签并中文化，版本标签和时长同排；剩余纯英文标题只有在实际宽度不足一行时才采用配置的中文名称。窗口缩放与分页后重新判断。LAST 14 DAYS 位于列表底部，只在近两周筛选下出现。
