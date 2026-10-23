---
title: Kali 启动设置修改记录
date: 2023-09-03 15:26:39
updated: 2026-02-24 22:14:09
tags: ["Kali", "Linux", "虚拟机", "GRUB", "LightDM"]
categories: [["系统环境", "Linux"]]
cover: https://res.cloudinary.com/sycamore/image/upload/v1792696297/Typora/2026/02/b7ea9d1222bacb7781961d44117c400f.jpg
---
调整 Kali 虚拟机的自动登录、引导等待和锁屏设置，让启动过程少几步操作。

<!-- more -->

在准备[《Linux 后门实验环境搭建》](/网络安全/Linux%20后门/Linux%20后门实验环境搭建/)时，我反复重启虚拟机，每次都要等引导、输密码，实在有点麻烦，所以就想把这些步骤省下来 O(∩_∩)O

:::info
本文使用的是 2022 年的 Kali 虚拟机，桌面为 Xfce，登录管理器为 LightDM。下面的 root 自动登录和关闭锁屏设置用于个人实验虚拟机，执行此配置后，打开虚拟机就能直接进入桌面。
:::

## 允许 root 用户登录

如果只是执行需要管理员权限的命令，用 `sudo` 即可。需要使用 root 账户时，先在普通账户的终端中设置密码：

```bash
sudo passwd root
```

输入当前账户的密码，再按提示设置 root 密码。输入密码时终端不会显示字符。

下面是图形登录界面。注意，此图中“新版默认不行”的标注不够准确：能否登录取决于 root 账户状态和登录管理器的配置，不能只按 Kali 版本判断。
不同桌面的设置可参考 [Kali 官方说明](https://www.kali.org/docs/general-use/enabling-root/)。

![Kali 图形登录界面](https://res.cloudinary.com/sycamore/image/upload/v1792696298/Typora/2026/02/a402df1a20b236ddcbcf1eee3e254813.png)

### GRUB 临时启动参数

如果配置过程中需要重置 root 密码，又无法通过现有账户使用 sudo，可以修改 GRUB 的临时启动参数，进入 root Shell 后执行 `passwd root` 设置密码，再重启回到正常的登录流程。

在引导菜单中选中 Kali，按 **E** 可以编辑本次启动项：

![在 GRUB 菜单中按 E 编辑启动项](https://res.cloudinary.com/sycamore/image/upload/v1792696298/Typora/2026/02/ee9e095803026b6734c0a8c908209e6f.png)

下面两张图记录了 `linux` 行末尾参数的变化，原来的内容是 `ro quiet splash`：

![修改前的 GRUB 内核参数 ro quiet splash](https://res.cloudinary.com/sycamore/image/upload/v1792696299/Typora/2026/02/511e5615a8474f12b4de12e701c32d67.png)

修改后是 `rw init=/bin/sh splash`：

![修改后的 GRUB 内核参数 rw init=/bin/sh splash](https://res.cloudinary.com/sycamore/image/upload/v1792696301/Typora/2026/02/2711dc66462686c032f9aaa47489fe83.png)

其中 `rw` 表示以读写方式挂载根文件系统，`init=/bin/sh` 指定启动 `/bin/sh`，替代正常的初始化程序。按 **Ctrl + X** 是按修改后的参数继续启动，修改只对这次启动生效。正常进入桌面时保留原来的启动参数即可。参数含义可查阅 [Linux 内核文档](https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html)。

## 跳过登录页面直接进

自动登录通过 LightDM 配置，不需要修改 GRUB。先备份要改的配置文件，再打开终端执行：

```bash
sudo vim /etc/lightdm/lightdm.conf
```

找到没有被注释的 **`[Seat:*]`** 配置段。文件前面也有相关说明，不要把配置写进注释里。

![lightdm.conf 中的 Seat 配置段](https://res.cloudinary.com/sycamore/image/upload/v1792696303/Typora/2026/02/3d4b0b74cf92beadd8ecd4dfd9f9907c.png)

在这个配置段中添加或修改以下两项：

```ini
autologin-user=root
autologin-user-timeout=0
```

`autologin-user` 是自动登录的用户名，我这里填 `root`，也可以换成自己的普通账户；`autologin-user-timeout=0` 表示不等待，直接登录。

![设置自动登录账户及等待时间](https://res.cloudinary.com/sycamore/image/upload/v1792696309/Typora/2026/02/79cd91f5f023cbad0cc14f46c39d0119.png)

按 **Esc**，输入 `:wq` 并回车，保存退出。

如果使用 root 自动登录，还需要检查 `/etc/pam.d/lightdm-autologin`：

```bash
sudo vim /etc/pam.d/lightdm-autologin
```

下面这一行要求用户名不是 root，会阻止 root 自动登录。如果文件中存在这项限制，在行首加 `#` 将它注释掉；如果使用的是普通账户，最后保留这一行。

```text
# auth required pam_succeed_if.so user != root quiet_success
```

截图标出了需要修改的位置（图中尚未添加 `#`）：

![lightdm-autologin 中限制 root 自动登录的配置行](https://res.cloudinary.com/sycamore/image/upload/v1792696306/Typora/2026/02/2d63a7f739e8266cde13b950dfe93f9b.png)

保存后执行 `sudo reboot`，检查是否直接进入指定账户的桌面。想恢复登录页面时，将添加的自动登录配置注释掉，并恢复修改过的 PAM 配置。

## 启动跳过5s引导界面

自动登录设置好了，但启动时还有如下图所示的 GRUB 菜单要等。默认会等待 5 秒，当然按回车也能立即启动：

![GRUB 引导菜单的倒计时](https://res.cloudinary.com/sycamore/image/upload/v1792696307/Typora/2026/02/7bf93978563fcf67505a8dc94ac19443.png)

如果想省掉这段等待，可以修改 `/etc/default/grub`：

```bash
sudo vim /etc/default/grub
```

找到 `GRUB_TIMEOUT`。下图是修改前的配置，值为 `5`，单位是秒：

![修改前的 GRUB_TIMEOUT 为 5 秒](https://res.cloudinary.com/sycamore/image/upload/v1792696308/Typora/2026/02/df74a7f1e325b85e1e40d39e1520b6d9.png)

将它改为：

```ini
GRUB_TIMEOUT=0
```

`0` 表示立即启动默认项，不显示菜单。经常需要选择其他内核或恢复选项的话，可以保留几秒等待。参数说明见 [GRUB 手册](https://www.gnu.org/software/grub/manual/grub/html_node/timeout.html)。

保存后执行以下命令，重新生成引导配置：

```bash
sudo update-grub
```

![执行 update-grub 生成引导配置](https://res.cloudinary.com/sycamore/image/upload/v1792696310/Typora/2026/02/cc110976411f12bcacdd0c9fa001c7d6.png)

确认没有报错后，执行 `sudo reboot` 查看效果。需要恢复等待时，把 `GRUB_TIMEOUT` 改回 `5`，再运行一次 `sudo update-grub`。

## 关闭自动锁屏

等 Kali 完成较长时间的命令时，如果长时间不进行操作，桌面会被锁住，必须输一次密码才能重新进入桌面。
所以我也调整了锁屏设置，关闭 Kali 的自动锁屏。

点击面板上的电源图标，选择 **Settings…**，打开电源管理器：

![从电源菜单打开设置](https://res.cloudinary.com/sycamore/image/upload/v1792696312/Typora/2026/02/0759d1a59a1f52034cc9405a21936f9c.png)

进入 **Security**，这里有两项需要区分：

- **Automatically lock the session**：控制屏保触发的自动锁屏。不需要时，将下拉选项改为 **Never**。
- **Lock screen when system is going to sleep**：控制进入休眠时是否锁屏，不需要时取消勾选。

下面的截图只取消了第二项，第一项仍是 **When the screensaver is activated**。要关闭这两种自动锁屏，需要一起调整。

![电源管理器中的屏保锁屏和休眠锁屏设置](https://res.cloudinary.com/sycamore/image/upload/v1792696315/Typora/2026/02/5d4bcd7102648ae38c3565ddc0802b9c.png)

这个设置窗口修改后直接生效，关闭窗口即可。
