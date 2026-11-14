---
title: Installing Windows 11 in VMware Workstation
translation_id: windows-11-vm
source_digest: 1ea6ae78cda80702d10839a36a395cbbe81934045d1d055a81440c06a55b077b
tags:
  - Windows
  - VMware
categories:
  - System
  - Virtual Machine
sections: {"downloading-the-windows-11-image": "win-11-镜像下载", "installing-windows-11-in-a-vm": "安装-win-11-虚拟机", "create-the-virtual-machine": "新建虚拟机", "add-the-tpm": "添加-tpm", "boot-and-install": "启动并安装系统", "installing-vmware-tools": "安装-vmware-tools", "activating-windows-11-pro": "win-11-专业版激活", "adding-a-shared-folder": "添加共享文件夹"}
---

I accidentally deleted all my virtual machines and didn’t have a backup. Here’s how I reinstalled Windows 11.

<!-- more -->

:::info
I used VMware Workstation 16.x and the March 2022 Windows 11 image, and installed the Pro edition. The steps and screenshots reflect that setup; newer releases may look different.
:::

## Downloading the Windows 11 image

I found the image on [NEXT, ITELLYOU](https://next.itellyou.cn/), run by the same team as [MSDN, I Tell You](https://msdn.itellyou.cn/). Open “原版软件” (original software) in the top navigation:

![Original software section on NEXT, ITELLYOU](https://res.cloudinary.com/sycamore/image/upload/v1792696186/Typora/2025/11/791dff305a14ba82d730664438c3b2eb.png)

Select Windows 11 from the operating system list:

![Selecting Windows 11](https://res.cloudinary.com/sycamore/image/upload/v1792696186/Typora/2025/11/2d57c74687e7f7757dedc6cfedff53cc.png)

I downloaded the `business editions` image and selected Pro during installation.

![Business editions and consumer editions images](https://res.cloudinary.com/sycamore/image/upload/v1792696187/Typora/2025/11/ff2d6147b7583139faac82d6b193eeec.png)

These are multi-edition images. Both include Pro; the business image includes Enterprise and the consumer image includes Home. Check the edition list in the image you downloaded.

This is the filename and ED2K link from my installation. For a new VM, the current image is also available from [Microsoft’s download page](https://www.microsoft.com/zh-cn/software-download/windows11).

```text
ed2k://|file|zh-cn_windows_11_business_editions_updated_march_2022_x64_dvd_7df6eae1.iso|5582235648|B7C9D076AE16A10C9D2610207577F28D|/
```

## Installing Windows 11 in a VM

### Create the virtual machine

Check the memory, disk and TPM configuration together before starting the installer.

1. Open **File → New Virtual Machine** and select the downloaded ISO as the installation source.

![Selecting the Windows 11 ISO](https://res.cloudinary.com/sycamore/image/upload/v1792696187/Typora/2025/11/d3a8942d2ad0b317c0cc62648ee8bf92.png)

2. My Workstation release had no Windows 11 entry, so I selected **Microsoft Windows → Windows 10 x64**. If your release offers **Windows 11 x64**, select that directly.

![Windows 10 x64 in the older guest selection menu](https://res.cloudinary.com/sycamore/image/upload/v1792696190/Typora/2025/11/338edd4301cc6cad326035c9a4221cc5.png)

3. I allocated 100 GB for the virtual disk. Windows 11 requires at least 64 GB; the screenshot’s 60 GB recommendation was for Windows 10.

![Allocating 100 GB of disk space](https://res.cloudinary.com/sycamore/image/upload/v1792696190/Typora/2025/11/2982c11f8bc33629ed97c7027051ecaa.png)

4. Before finishing the wizard, open **Customize Hardware** to adjust memory and processors. I used 4 GB RAM, four CPU cores and the 100 GB disk.

![Final memory, processor and disk configuration](https://res.cloudinary.com/sycamore/image/upload/v1792696191/Typora/2025/11/f5cdc00ac398b079aef715e9cef1d33d.png)

[Microsoft’s specifications](https://www.microsoft.com/zh-cn/windows/windows-11-specifications) include a compatible 64-bit dual-core processor, 4 GB of memory, 64 GB of storage, Secure Boot-capable UEFI and TPM 2.0.

> Leave the VM powered off for the next step.

### Add the TPM

Without a TPM, Setup can report that the PC can’t run Windows 11 even with enough memory and storage:

![Windows Setup reporting an unsupported PC](https://res.cloudinary.com/sycamore/image/upload/v1792696191/Typora/2025/11/41f08312d8479a1167c27196098b1ca3.png)

My version of Workstation required an encrypted VM before I could add a trusted platform module.

1. With the VM off, open **Options → Access Control → Encrypt**. Set a password and keep a copy.

![Encrypting the VM in Access Control](https://res.cloudinary.com/sycamore/image/upload/v1792696194/Typora/2025/11/863b1258fb1e625aad5724a82baee5c5.png)

The password unlocks the VM. Whether you’re prompted on subsequent launches depends on whether it was saved.

2. Under **Hardware → Add**, select **Trusted Platform Module** and finish the wizard.

![Adding the trusted platform module](https://res.cloudinary.com/sycamore/image/upload/v1792696194/Typora/2025/11/896f6935d4351cef18cdd1d971bd7487.png)

Check that **Options → Advanced** uses UEFI and has Secure Boot enabled. Save and start the installer. If it still rejects the configuration, recheck the processor and memory settings. See also [VMware’s Windows 11 guest installation notes](https://knowledge.broadcom.com/external/article/315650/installing-windows-11-as-a-guest-os-on-v.html).

### Boot and install

1. Click inside the VM so it receives keyboard input. When you see `Press any key to boot from CD or DVD...`, press a key promptly.

![The optical disc boot prompt](https://res.cloudinary.com/sycamore/image/upload/v1792696195/Typora/2025/11/ffcf4d54df07765c493a15ef76f6b25b.png)

If you miss it, the VM tries other boot devices. This EFI network timeout means the VM moved on to network boot; the installer hasn’t frozen. Restart and catch the disc prompt.

![EFI network boot timing out](https://res.cloudinary.com/sycamore/image/upload/v1792696195/Typora/2025/11/e0b203eb588dda997504fb10073d24db.png)

2. Choose the installer language and other options, then select an edition. I installed Windows 11 Pro.

![Selecting Windows 11 Pro](https://res.cloudinary.com/sycamore/image/upload/v1792696197/Typora/2025/11/0e49cc6f9b7014e5ed99939012d6ccf9.png)

3. Select **Custom: Install Windows only (advanced)** for a clean installation on this blank VM.

![Choosing a custom installation](https://res.cloudinary.com/sycamore/image/upload/v1792696198/Typora/2025/11/c63c3401280590e3a29245e4d714e38a.png)

4. Select the unallocated space, click **New**, choose a partition size and apply it. I used the entire 100 GB for the system without a separate D: drive. Setup creates the small system partitions it needs.

![Creating partitions from unallocated space](https://res.cloudinary.com/sycamore/image/upload/v1792696199/Typora/2025/11/b8e71588df1d8b52f1a3daf9d281e353.png)

Select the primary Windows partition, continue and wait for Setup to copy the files and restart.

![Windows preparing after the restart](https://res.cloudinary.com/sycamore/image/upload/v1792696199/Typora/2025/11/7b98b25772ebdc03a9bedc22257cb105.png)

5. Complete the region, keyboard and account setup.

![Choosing the country or region](https://res.cloudinary.com/sycamore/image/upload/v1792696201/Typora/2025/11/3db95d71ff0acde6daa635e63380e18b.png)

Wait for Windows to prepare the desktop.

![The final stage before reaching the desktop](https://res.cloudinary.com/sycamore/image/upload/v1792696202/Typora/2025/11/faa285dbc5a0c474b52248c6449a25e3.png)

## Installing VMware Tools

I wanted to copy commands and share files between host and guest, so I installed VMware Tools next.

1. Select **VM → Install VMware Tools** to mount the installation disc.

![Mounting the Tools disc from the VM menu](https://res.cloudinary.com/sycamore/image/upload/v1792696203/Typora/2025/11/f656802af2a999811f4fe02887b4a46d.png)

2. If the wizard doesn’t open automatically, open the virtual disc in File Explorer and run `setup64`. Mine was drive D:; yours may differ.

![Running setup64 from the virtual optical drive](https://res.cloudinary.com/sycamore/image/upload/v1792696205/Typora/2025/11/b3954036aa9224ddccd91c871f7f8893.png)

3. Follow the wizard and select **Typical**.

![The VMware Tools setup wizard](https://res.cloudinary.com/sycamore/image/upload/v1792696206/Typora/2025/11/9ae5db46573b558302c65d16791c0254.png)

Click **Finish** and restart the guest when prompted.

![Completing the Tools installation](https://res.cloudinary.com/sycamore/image/upload/v1792696206/Typora/2025/11/2d1c0f84cbcffce42beae398d2f623e9.png)

## Activating Windows 11 Pro

Check **Settings → System → Activation**. Mine showed Windows as unactivated:

![Windows 11 Pro showing as unactivated](https://res.cloudinary.com/sycamore/image/upload/v1792696207/Typora/2025/11/b46ec91f451c4de9a831ed9b69d5cc9a.png)

That doesn’t mean Windows will stop booting after a fixed period. I wanted to clear the warning. Activation requires a licence for the installed edition; for personal use, enter your product key here or use an existing digital licence.

The following records the KMS procedure for an environment with the appropriate volume licence and KMS service. This is the key I used then. I haven’t verified that it still works. See [Microsoft’s KMS client key guidance](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys) for the requirements.

1. Search for CMD and open Command Prompt as administrator.

![Opening an administrator command prompt](https://res.cloudinary.com/sycamore/image/upload/v1792696209/Typora/2025/11/e3b151d1971b81e2e763891ea9ecefb4.png)

2. Install the Windows 11 Pro KMS client key:

```bash
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
```

![Confirmation after installing the client key](https://res.cloudinary.com/sycamore/image/upload/v1792696212/Typora/2025/11/ced00a4b004c06e9f2356edb2e01e04c.png)

3. If you need to specify the KMS server manually, use `slmgr /skms <server-address>` with the address provided by your organisation. The address in the screenshot belongs to the original setup.

![Confirmation that the KMS address was saved](https://res.cloudinary.com/sycamore/image/upload/v1792696212/Typora/2025/11/9358882fffe07ef3c3e3db876afad89e.png)

Saving the address doesn’t establish that the service is reachable or that activation has succeeded.

4. Run `slmgr /ato` to request activation.

![The activation command response](https://res.cloudinary.com/sycamore/image/upload/v1792696211/Typora/2025/11/36bc8abb1ec174ec21129bf9f854bd61.png)

Return to Settings to check the result:

![The final activation status](https://res.cloudinary.com/sycamore/image/upload/v1792696213/Typora/2025/11/c27217ec83ab6a9f50cd4ca7f0d53139.png)

## Adding a shared folder

With VMware Tools installed, the guest can access a shared host directory, as in [my Windows 7 VM notes](/en/system/virtual-machine/setting-up-a-windows-7-virtual-machine/).

1. In VM settings, choose **Options → Shared Folders → Always enabled** and add the host directory.
2. In Windows 11 File Explorer, enter `\\vmware-host\Shared Folders` in the address bar and check that your folder appears.

To find the share by browsing **Network**, you may need network discovery for that network profile. The screenshot shows my setup. Direct access to the VMware path doesn’t require enabling discovery on public networks.

![Network discovery settings used for browsing](https://res.cloudinary.com/sycamore/image/upload/v1792696215/Typora/2025/11/a92c22729e15e0585a84fcc1e112af53.png)

3. To make the share easier to open later, choose **Map network drive** from **This PC**.

![Opening Map network drive](https://res.cloudinary.com/sycamore/image/upload/v1792696217/Typora/2025/11/e265ff58617284810bf17a32bce6bbd7.png)

4. Choose a drive letter. Enter the share path under **Folder**, or use **Browse**.

![Specifying the folder to map](https://res.cloudinary.com/sycamore/image/upload/v1792696217/Typora/2025/11/49ad0d1c6d3225352afa5ffe27df5cb8.png)

Expand `vmware-host → Shared Folders → VMware共享`. The final component is the share name I chose.

![Selecting the named share under vmware-host](https://res.cloudinary.com/sycamore/image/upload/v1792696219/Typora/2025/11/79379495f2c29c73d95616821a42be72.png)

Finish the wizard. The share will appear under network locations in **This PC** and you can open it from there.

![The mapped network drive](https://res.cloudinary.com/sycamore/image/upload/v1792696219/Typora/2025/11/ef8ab28424e1d5ed8eeea5da6f67beb4.png)
