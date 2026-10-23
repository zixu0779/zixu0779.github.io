---
title: Win 7 虚拟机搭建 FTP
updated: 2025-09-18 21:42:15
date: 2022-08-21 21:17:46
tags: ["3CDaemon", "FTP", "文件传输"]
categories: [["系统环境", "虚拟机"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/65ded4aab38ef01f86a17c06e881f706.jpg
---
用 3CDaemon 在宿主机搭建 FTP 服务，给 Win 7 虚拟机传文件。
<!-- more -->

## 为什么要搭 FTP

我在装 Win 7 虚拟机时，VMware Tools 一直报驱动签名错误，需要先补上 SHA-2 支持更新。具体问题和补丁说明放在了[《Win 7 虚拟机配置记录》](/系统环境/虚拟机/Win%207%20虚拟机配置记录/)，这里接着说怎么把文件传进去。

当前面对的问题是：VMware Tools 遇到错误还没装好，共享文件夹也暂时用不了，而推进修复又需要传递补丁文件。
我就想先在宿主机上开一个 FTP 服务，让虚拟机连过来下载补丁。这样只需要两边的网络互通，不用让虚拟机访问外网。

为了少折腾一些配置，我选了 **3CDaemon**，这篇就记录一下它的设置和传文件的过程。

## 简单介绍 3CDaemon

3CDaemon 是一个小型服务器工具，包含 TFTP 服务器、FTP 服务器、Syslog 服务器和 TFTP 客户端。本文只用其中的 FTP 服务器功能。

这里先区分一下两边的用途：**宿主机运行 3CDaemon，是服务端；Win 7 虚拟机运行 FTP 命令，是客户端。** 后面的用户和共享目录都在宿主机上设置，虚拟机只负责连接和下载。

下面是程序图标：

![3CDaemon 程序图标](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f10a491d66c5e04a1016ecd31a49031e.png)

打开后可以看到，各项功能都放在左侧，右侧显示对应的运行日志。

![3CDaemon 主界面](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f7b3d6d129125031066cacd9ce5c10dd.png)

我用的是中文版，[下载页面](https://wwfx.lanzouw.com/iZB1B1jhcvab)能打开，但目前此安装包没有重新做安全检测，不能保证文件安全。

## 宿主机配置 FTP 服务器

要让虚拟机下载文件，需要先在宿主机上设置一个 FTP 用户，并指定它能访问的目录。
这个目录就是后面放补丁的地方，和 VMware 自带的共享文件夹功能是两回事。

打开 3CDaemon，在左侧选择“FTP 服务器”，点击“设置 FTP 服务器”，进入“FTP 用户”页：

1. 填写用户名，点击“设置/改变用户口令”设置密码。
2. 选择用户目录，也就是准备放文件的宿主机目录。
3. 设置权限，点击“保存用户”，再确认退出。

![设置 FTP 用户、密码、用户目录和权限](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/615423cb09e8cc30df25f514104b5c75.png)

截图里我把权限都勾上了，不过这里只需要登录和下载，不必照着开放上传、删除等权限。保存后，确认左侧显示“FTP 服务器已经启动”，右侧有监听地址的日志。

## 虚拟机连接 FTP 服务器

服务器已经准备好了，接下来从 Win 7 连接过去。这里用的是 Windows 自带的 `ftp` 命令，不需要在虚拟机里安装 IIS 或启用 FTP 服务器。

先确认宿主机和虚拟机之间的网络可以通信。我用 `ping` 检查了宿主机地址，截图中的地址是 `192.168.43.124`：

![在 Win 7 中 ping 宿主机](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/0e1c4286c2cb31e9e631e93a9c8d54fc.png)

`ping` 通只能说明这次 ICMP 检查有响应，FTP 能否连接还要看服务是否监听、防火墙是否放行。默认的 TCP 21 端口在**宿主机的服务端**，要检查的是这一侧的入站规则，不是让虚拟机也开一个 FTP 服务。防火墙保持开启，按需要允许这两台机器间的 FTP 通信即可。

在虚拟机中打开 CMD，输入以下命令。IP 换成宿主机上虚拟机能够访问的地址：

```text
ftp 192.168.43.124
```

接着输入前面设置的 FTP 用户名和密码。密码输入时没有回显，正常输入后按回车就行。看到 `230 用户已登录` 和 `ftp>` 提示符，说明登录成功。

![连接宿主机 FTP 并输入用户名和密码](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/8e5854aa74837703492c041e50623116.png)

## 用 FTP 下载文件

登录后，远端目录对应前面为这个 FTP 用户设置的宿主机目录。把补丁放到那里，再回到虚拟机下载，步骤如下。

1. 在宿主机的用户目录里放入需要传输的文件。图中将补丁命名为 `windows6.1.msu`，后面的命令也用这个文件名。

![把补丁放入 FTP 用户目录](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/d61ef3630797bf07569662996c7a5799.png)

2. 在虚拟机的 `ftp>` 提示符下输入 `dir`，查看远端目录，确认文件已经出现。

![在 FTP 会话中列出远端文件](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/765abe5446678f53520039688ba854cc.png)如果已经登录，但 `dir` 或下载一直卡住，还要检查 FTP 的数据连接。FTP 的登录和传输使用不同的连接，不能只看到 21 端口能连接就认为文件一定能传。

3. 先确认下载文件的本地位置，再下载补丁。如果没有切换目录，文件默认保存在启动 `ftp` 时所在的目录中。需要换位置时，可以用 `lcd` 指定虚拟机里已经存在的目录，例如：

```text
lcd C:\Users\Sycamore\Desktop
```

这里的用户名和路径需要换成自己的。然后设置二进制传输，再运行 `get`：

```text
binary
get windows6.1.msu
```

补丁属于二进制文件，要用 `binary`，避免按默认的 ASCII 模式传输。命令说明可以对照微软的 [binary 文档](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ftp-binary)和 [lcd 文档](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ftp-lcd)。

![使用 get 下载补丁到虚拟机](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/4309f3c1ed612bc24c6245b64c6b0fff.png)

这张截图只截到了 `get`，没有展示前面的 `binary`，记得要先切换传输模式。另外，这张图的宿主机 IP 是 `10.4.13.131`，与前面的截图不同，连接时以自己当前的地址为准。

4. 传输完成后，输入 `bye`，结束连接并退出客户端。

![退出 FTP 会话后的 221 响应](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/1fba97d8fa5d61327fc9bb7f07b7e139.png)截图中输入的是缩写 `by`，这里完整的写法是 `bye`。
返回的 `221` 是服务器关闭控制连接的响应码，不是端口号，也不表示宿主机上的 FTP 服务已经停止。退出命令的说明见[微软文档](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ftp-bye)。

文件传好后，就可以继续安装补丁了。如果不再需要传文件，再回到宿主机停止 3CDaemon 的 FTP 服务。
