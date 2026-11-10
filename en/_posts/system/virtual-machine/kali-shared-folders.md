---
title: Sharing folders with a Kali VM
translation_id: kali-shared-folders
source_digest: e11ac074d2554f87476f0e043949301880b8201d87c0209e599812abd5085de1
tags:
  - Kali
  - VMware
  - Shared Folders
categories:
  - System
  - Virtual Machine
sections: {"setup": "步骤", "1-add-the-folder-in-vmware": "1-vmware-添加共享目录", "2-install-open-vm-tools": "2-安装-open-vm-tools", "3-list-the-shares": "3-查看共享目录", "4-create-a-mount-point": "4-创建挂载目录", "5-mount-the-shared-folders": "5-挂载共享文件夹", "6-mount-at-startup": "6-开机自动挂载共享文件夹", "recap": "总结"}
---

I’ve been rebuilding virtual machines quite a bit lately. Shared folders make it much easier to move files between the host and the guest, so I wrote down the setup.

<!-- more -->

:::info
These notes cover a Kali guest in VMware on a Windows host. Apart from the VMware settings, all commands run inside Kali. The screenshots show a root session. If you use a regular account, keep the `sudo` in the commands below.
:::

## Setup

### 1. Add the folder in VMware

Right-click the virtual machine and open Settings. Under Options → Shared Folders, choose Always enabled and click Add.

![Enabling shared folders in VMware](https://res.cloudinary.com/sycamore/image/upload/v1792696178/Typora/2026/03/d6ab80b4096b31d9e8277a1d2d17e15d.png)

For Host path, select the directory on the host. Name defaults to the folder name, but you can change it. I used `kali-Attack`, which is how the share will appear in Kali.

![Host path and share name in VMware](https://res.cloudinary.com/sycamore/image/upload/v1792696178/Typora/2026/03/c59203c3a6958a3352bb21e94c16cb71.png)

### 2. Install open-vm-tools

Kali may already have open-vm-tools. If the guest can list and mount the share, skip this step. Otherwise run:

```bash
sudo apt-get update
sudo apt-get install open-vm-tools-desktop fuse
```

`apt-get update` refreshes the package index. If the package still can’t be found, check the configured repositories and the network connection. Having a package installed already doesn’t itself cause an installation error or mean you need to reinstall it.

The [Kali documentation](https://www.kali.org/docs/virtualization/install-vmware-guest-tools/) covers installation and troubleshooting, including a helper script available through `kali-tweaks`. The rest of these notes use the manual mount procedure.

### 3. List the shares

```bash
vmware-hgfsclient
```

The output should include the name you set in VMware. Mine shows `kali-Attack`: the guest can see the share, but it still needs to mount it before it can read the files.

![The guest lists the kali-Attack share](https://res.cloudinary.com/sycamore/image/upload/v1792696178/Typora/2026/03/fd165b4e941f29eb2b73528b4c890149.png)

### 4. Create a mount point

```bash
sudo mkdir -p /mnt/hgfs
```

The next step mounts all the shares under `/mnt/hgfs`. That’s the only directory you need to create. In the screenshot I also created a `kali-Attack` subdirectory; you can skip that, because the share name appears automatically after mounting.

![Creating the mount point and an optional subdirectory](https://res.cloudinary.com/sycamore/image/upload/v1792696182/Typora/2026/03/fde917c65af6fc2e96f68686e71cfeb5.png)

### 5. Mount the shared folders

```bash
sudo /usr/bin/vmhgfs-fuse .host:/ /mnt/hgfs/ -o subtype=vmhgfs-fuse,allow_other
```

`.host:/` selects all the host’s shared folders. `/mnt/hgfs/` is the mount point. `allow_other` lets users other than the one who mounted the share access it, subject to file permissions and VMware’s sharing settings.

After mounting, list the files in the host folder:

```bash
ls /mnt/hgfs/kali-Attack
```

![The mounted share and its contents](https://res.cloudinary.com/sycamore/image/upload/v1792696182/Typora/2026/03/a6c609c7898331e555c1e1a2e217fd26.png)

### 6. Mount at startup

The manual mount lasts for the current session. Once you’ve confirmed it works, you can add it to `/etc/fstab` to mount it at startup. Back up the file before editing:

```bash
sudo cp -a /etc/fstab /etc/fstab.bak
sudo vim /etc/fstab
```

Append this line, keeping the existing entries:

```text
.host:/  /mnt/hgfs/  fuse.vmhgfs-fuse  allow_other  0  0
```

![The new shared-folder entry at the end of fstab](https://res.cloudinary.com/sycamore/image/upload/v1792696183/Typora/2026/03/4bc901d11c40cdadad0e5a26b4113a8f.png)

Save, run `sudo systemctl daemon-reload`, then run `sudo mount -a` to check for errors. If there’s an error, fix the new line or comment it out before rebooting. After restarting, check that `/mnt/hgfs/kali-Attack` is accessible.

## Recap

Add the shared directory in VMware, confirm its name with `vmware-hgfsclient`, then mount it under `/mnt/hgfs` with `vmhgfs-fuse`. Add an `/etc/fstab` entry if you want it mounted at startup.
