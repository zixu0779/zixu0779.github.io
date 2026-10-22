---
title: Kali 虚拟机共享文件夹
date: 2022-04-09 15:53:08
updated: 2026-10-19 22:26:47
tags: ["Kali", "VMware", "共享文件夹"]
categories: [["系统环境", "虚拟机"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/d264247e34cfddb13d09c3a03d792b0e.png
---
最近总是要反复建虚拟机，共享文件夹又方便了主机和虚拟机之间的文件传输，所以写下这篇文章，记录一下配置过程。

<!-- more -->

:::info
本文记录的是 2022 年在 VMware 中为 Kali 配置共享文件夹的过程，截图中的主机为 Windows。除 VMware 设置外，下面的命令都在 Kali 虚拟机内执行；截图使用 root 账户，普通账户执行时需要加上文中的 `sudo`。
:::

## 步骤

### ① VMware 添加共享目录

选中要设置的虚拟机，右键打开“设置”，进入“选项 → 共享文件夹”，选择“总是启用”，再点击“添加”：

![在 VMware 设置中启用并添加共享文件夹](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/d6ab80b4096b31d9e8277a1d2d17e15d.png)

“主机路径”填写主机上要共享的文件夹位置；“名称”默认使用该文件夹的名称，也可以自行修改。这里使用 `kali-Attack`，后面会在 Kali 中看到这个名称。

![设置主机路径和共享名称 kali-Attack](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c59203c3a6958a3352bb21e94c16cb71.png)

### ② 安装 open-vm-tools

Kali 可能已经安装了 open-vm-tools。如果后面能够正常查看和挂载共享目录，可以跳过安装。缺少工具时，在 Kali 终端中执行：

```bash
sudo apt-get update
sudo apt-get install open-vm-tools-desktop fuse
```

`apt-get update` 更新的是软件包索引。如果仍然提示找不到软件包，需要检查 Kali 的软件源和网络连接。已安装软件包本身不会导致安装报错，也不用仅因为已经安装就手动重装。

安装及故障处理可参考 [Kali 官方文档](https://www.kali.org/docs/virtualization/install-vmware-guest-tools/)。文档也提供了通过 `kali-tweaks` 安装共享文件夹辅助脚本的方法，下面继续记录手动挂载的步骤。

### ③ 查看共享目录

```bash
vmware-hgfsclient
```

输出应包含 VMware 中设置的共享名称。这里显示的是 `kali-Attack`，说明虚拟机已经能发现该共享目录，但还需要挂载后才能访问其中的文件。

![vmware-hgfsclient 列出共享名称 kali-Attack](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/fd165b4e941f29eb2b73528b4c890149.png)

### ④ 创建挂载目录

```bash
sudo mkdir -p /mnt/hgfs
```

下一步会把所有共享目录挂载到 `/mnt/hgfs` 下，只需创建这个挂载点。下图还创建了 `kali-Attack` 子目录，这一步可以省略，挂载后会自动显示 VMware 中设置的共享名称。

![创建目录的操作截图，其中 kali-Attack 子目录无需手动创建](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/fde917c65af6fc2e96f68686e71cfeb5.png)

### ⑤ 挂载共享文件夹

```bash
sudo /usr/bin/vmhgfs-fuse .host:/ /mnt/hgfs/ -o subtype=vmhgfs-fuse,allow_other
```

`.host:/` 表示主机提供的全部共享目录，`/mnt/hgfs/` 是挂载位置，`allow_other` 允许挂载者以外的用户访问，实际读写仍受文件权限和 VMware 共享设置限制。

挂载后，进入 `/mnt/hgfs/kali-Attack`，就能看到主机共享文件夹中的文件：

```bash
ls /mnt/hgfs/kali-Attack
```

![挂载共享文件夹并查看其中的文件](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a6c609c7898331e555c1e1a2e217fd26.png)

### ⑥ 开机自动挂载共享文件夹

手动挂载只对当前运行有效。确认能正常访问文件后，可以在 `/etc/fstab` 中添加配置，让系统开机时挂载。

先备份文件，再打开编辑：

```bash
sudo cp -a /etc/fstab /etc/fstab.bak
sudo vim /etc/fstab
```

在文件末尾新增一行，保留已有配置：

```text
.host:/  /mnt/hgfs/  fuse.vmhgfs-fuse  allow_other  0  0
```

![在 fstab 末尾添加共享文件夹挂载配置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/4bc901d11c40cdadad0e5a26b4113a8f.png)

保存后执行 `sudo systemctl daemon-reload`，再运行 `sudo mount -a` 检查是否报错。若有报错，先修正或注释掉新增的一行，再重启；重启后检查 `/mnt/hgfs/kali-Attack` 能否正常访问。

## 总结

先在 VMware 中添加共享目录，再在 Kali 中用 `vmware-hgfsclient` 确认共享名称。准备好 `/mnt/hgfs` 后，通过 `vmhgfs-fuse` 挂载；需要开机自动挂载时，再配置 `/etc/fstab`。
