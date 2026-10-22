---
title: Linux 后门实验环境搭建
date: 2022-03-21 21:36:37
updated: 2026-10-19 21:00:24
tags: ["Linux", "Kali", "VMware", "SSH"]
categories: [["网络安全", "Linux 后门"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f6bc736975fca644e150849c3e662711.png
---
这次用 Kali Linux 虚拟机作为实验服务器，在 Windows 主机上通过 Xshell 建立 SSH 连接，为后面的 Linux 后门实验准备环境。这里先记录连接过程，以及我遇到的几个问题。

<!-- more -->

:::info
本文的操作和截图来自 2022 年使用的 Kali 2022.1 与 Windows 下的 VMware。其他版本的界面、服务状态和 SSH 配置可能不同，下面的旧镜像链接留作版本对照。
:::

## VMware创建Kali虚拟机

我使用的是 VMware，创建虚拟机的过程就不展开了。如果不想从 ISO 镜像开始安装，可以直接下载 Kali 官方预配置的虚拟机镜像。

- [Kali 2022.1 VMware 镜像](https://old.kali.org/virtual-images/kali-2022.1/kali-linux-2022.1-vmware-amd64.7z)
- [Kali 2022.1 VirtualBox 镜像](https://old.kali.org/virtual-images/kali-2022.1/kali-linux-2022.1-virtualbox-amd64.ova)

新建环境可以从 [Kali 官方下载页](https://www.kali.org/get-kali/#kali-virtual-machines)选择当前版本。本文后面的操作以 Kali 为准。

## Xshell安装和会话创建

Xshell 的安装过程这里不展开，可以从 [NetSarang 官网](https://www.netsarang.com/en/xshell/)获取安装包。

打开 Xshell，选择“文件 → 新建”，创建一个 SSH 会话：

![Xshell 新建 SSH 会话的设置窗口](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ec0e3b63c1b6407381f5fc198204b88b.png)

会话名称可以自己填写，协议选择 **SSH**。如果没有修改 SSH 服务的监听端口，端口号就填 **22**；主机地址则填写 Kali 虚拟机的 IP。

启动虚拟机，在终端中输入 `ip addr` 查看网卡地址。下面是我使用 `ifconfig` 得到的结果；如果系统没有安装这个命令，使用 `ip addr` 即可。

![Kali 虚拟机的网卡与 IP 地址](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/03de79df0a7a5f15066393d8b3fdc732.png)

图中的地址是 **192.168.158.128**，把它填进会话的主机地址一栏。这个地址要以自己虚拟机的实际地址为准，不要填回环地址 `127.0.0.1`。

## Kali配置SSH连接（问题汇总）

创建完会话后，我还没有顺利连上，Xshell 显示了连接失败：

![Xshell 连接失败提示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/44ad2149c5ece1467cd8f0dee447a105.png)

服务没有启动、网络不通和认证失败是不同的问题，下面是排查的记录。

### SSH 是否开启

先在 Kali 中查看 SSH 服务状态，如果还没有运行，再启动它：

```bash
sudo systemctl status ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

这是使用 `service ssh status` 查看状态的截图，显示 `active (running)` 说明服务正在运行。

![SSH 服务运行状态](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/bf8774117739cb26e9767cc0b5a1f9f5.png)

如果希望虚拟机开机后自动启动 SSH，可以执行：

```bash
sudo systemctl enable ssh
```

不需要开机自启时，用 `sudo systemctl disable ssh` 取消。启动服务后可以直接重新连接，不需要为了这一步重启虚拟机。

### 能否 ping 通

如果服务已经启动，Xshell 仍然连不上，可以先在 Windows 主机上 ping 虚拟机的 IP，看看网络是否能通：

![Windows 主机 ping Kali 虚拟机失败](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c72106aee3f1d8b7ac9a24d572b59b36.png)

ping 不通不一定就是 SSH 的问题，也可能是地址、虚拟网卡或防火墙的设置。我遇到的是 VMnet8 的连接问题。

打开 VMware 的“编辑 → 虚拟网络编辑器”，点击“更改设置”，选中 **VMnet8**，勾选“将主机虚拟适配器连接到此网络”。

如果已经勾选，可以先取消勾选并应用，再重新勾选并应用，重新启用宿主机与虚拟网络的连接。

![VMnet8 的主机虚拟适配器设置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/97fccc2c2ee041cbd1e6feb5cacbf47d.png)

这样处理后就能连上了。不过重启电脑后还得再做一遍，确实有点麻烦 (￣_￣|||)

我也尝试过配置端口转发，但没有解决这个问题。Windows 宿主机可以通过 VMnet8 虚拟适配器直接访问同一私有网络里的 Kali；外部机器要主动访问 NAT 内的服务时，才需要考虑端口转发。具体网络模式可参考 [VMware 官方说明](https://knowledge.broadcom.com/external/article/309842/understanding-networking-types-in-hosted.html)。

这个问题还没有彻底解决，重新勾选只是临时处理。后续还需要检查 VMnet8 适配器、双方的子网地址和防火墙规则。

### SSH服务拒绝密码

网络连通后，我又遇到了另一个提示：

![Xshell 提示 SSH 服务器拒绝密码](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/4a17b7f6085ed11e25581ad4af01ad96.png)

这里使用 `root` 登录，提示“SSH 服务器拒绝了密码，请再试一次”。确认用户名和密码无误后，还需要检查账户状态和服务端的认证设置。

我修改了服务端的 `/etc/ssh/sshd_config`，配置如下：

![修改后的 sshd_config 配置，包含 PermitRootLogin yes](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/8900184ed3d063762a64a4307d9111e0.png)

图中的 `PermitRootLogin yes` 允许 root 登录。普通账户无需修改这一项，其他配置也只需按需要调整，不必全部取消注释。各项含义可以查看 [OpenSSH 配置手册](https://man.openbsd.org/sshd_config)。

修改配置后，先检查语法，再重启服务：

```bash
sudo /usr/sbin/sshd -t
sudo systemctl restart ssh
```

语法检查通过后再重启 `ssh` 服务，不需要重启虚拟机。

重新连接 Xshell，成功！

![Xshell 成功连接 Kali 虚拟机](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/bc8a0d69bbf2c5972d1bb2864e8e36f7.png)
