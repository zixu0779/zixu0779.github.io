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
