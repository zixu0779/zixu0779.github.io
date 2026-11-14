---
title: Setting Up a Windows 7 Virtual Machine
translation_id: windows-7-vm
source_digest: 9195f6bcee185c428753a1f27038b218694c6de7357c56222c6a84b8db700729
tags:
  - Windows
  - VMware
  - SSH
  - Shared Folders
categories:
  - System
  - Virtual Machine
sections: {"downloading-and-installing-windows-7": "下载安装-win7-镜像", "choose-an-image": "镜像下载挑选", "install-the-guest": "安装-win7-虚拟机", "installing-vmware-tools": "安装-vmware-tools", "manual-installation": "手动安装步骤", "troubleshooting": "错误处理", "install-vmware-tools-is-greyed-out": "选项安装-vmware-tools-为-灰色", "windows-cant-verify-the-driver-publisher": "windows-无法验证此驱动程序软件的发布者", "setting-up-shared-folders": "创建-win7-共享文件夹", "add-the-share-in-vmware": "vmware-虚拟机设置中添加", "map-a-drive-in-the-guest": "win7-虚拟机中-映射网络驱动器", "connecting-over-ssh": "安装建立-ssh-连接", "why-add-ssh": "为什么还要装-ssh", "download-install-and-configure-openssh": "下载-安装-配置-openssh", "download": "下载", "install": "安装", "configure": "配置", "test-from-xshell": "xshell-连接试验"}
---

Installing a Windows 7 guest, VMware Tools, shared folders and SSH.

<!-- more -->

I set up a Windows 7 VM for Windows security testing. Installing Windows itself was straightforward. Getting VMware Tools running, moving files across and connecting over SSH took longer, so I wrote down the whole setup.

:::info
I used VMware Workstation Pro 16 and Windows 7 Enterprise SP1 x64. The screenshots show VMware Tools 11.2.6. Check compatibility if you’re using different versions.
:::

## Downloading and installing Windows 7

### Choose an image

I found the image details on [MSDN, I Tell You](https://msdn.itellyou.cn/), a third-party site. I chose Windows 7 Enterprise SP1 x64. SP1 and its updates also matter for the Tools installation later.

![Selecting the Enterprise SP1 x64 image](https://res.cloudinary.com/sycamore/image/upload/v1792696223/Typora/2025/09/732bbc1c86ae1a240189d78f76323dde.png)

This is the ED2K link for that image; it needs a downloader that understands the protocol:

```text
ed2k://|file|cn_windows_7_enterprise_with_sp1_x64_dvd_u_677685.iso|3265574912|E9DB2607EA3B3540F3FE2E388F8C53C4|/
```

### Install the guest

1. Press `Ctrl + N` or open **File → New Virtual Machine**.

![Opening the new VM wizard](https://res.cloudinary.com/sycamore/image/upload/v1792696223/Typora/2025/09/9f57f4f5c20651c0c7345d6525ab8705.png)

2. Choose **Typical** and continue.

![Typical configuration](https://res.cloudinary.com/sycamore/image/upload/v1792696224/Typora/2025/09/f6dc889e5b91bffc0f7c7a09001cd10a.png)

3. Choose **Installer disc image file** and select the ISO.

![Selecting the Windows 7 ISO](https://res.cloudinary.com/sycamore/image/upload/v1792696227/Typora/2025/09/73142fdc9301d5fc842da5723fd1884d.png)

4. Fill in the Easy Install details. Check the edition and set a username and password. I used this account later for SSH.

![Easy Install account details](https://res.cloudinary.com/sycamore/image/upload/v1792696227/Typora/2025/09/53ac1d29ff5046b17161e7d8c8686b21.png)

You can leave the product key blank and choose **Yes** when prompted to continue. Installation and activation are separate; use the appropriate licence to activate Windows afterwards.

![Continuing without entering a product key](https://res.cloudinary.com/sycamore/image/upload/v1792696228/Typora/2025/09/c978f6c017b98d82eef567df860c9033.png)

> The key in my original setup, `33PXH-7Y6KF-2VJC9-XBBR8-HVTHH`, is a Windows 7 Enterprise KMS client setup key. It requires an appropriately licensed KMS host and won’t activate the guest on its own. See [Microsoft’s KMS client key documentation](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys). I can’t guarantee that the key will work in your environment.

5. Name the VM and choose where to save its files.

![Naming the guest and choosing a location](https://res.cloudinary.com/sycamore/image/upload/v1792696228/Typora/2025/09/4bb7d478563dee6ac3eba031d54bcd80.png)

6. I kept the default 60 GB virtual disk and split it into multiple files. With this growable disk, creating it doesn’t consume all 60 GB immediately, but the host still needs sufficient space as the guest grows.

![Choosing the virtual disk capacity](https://res.cloudinary.com/sycamore/image/upload/v1792696231/Typora/2025/09/27e06d25f47f9fa092c86337b9ff76e7.png)

7. Review the settings and finish. Wait for VMware to create the disk and install Windows.

![Creating the virtual disk](https://res.cloudinary.com/sycamore/image/upload/v1792696231/Typora/2025/09/ba138c24863acc2f766c9dc2c97e4e7c.png)

![Windows installation in progress](https://res.cloudinary.com/sycamore/image/upload/v1792696232/Typora/2025/09/c67cd9c3eca856dcf7b9afffe42ce04b.png)

Once the Windows desktop appears, the operating system is installed.

## Installing VMware Tools

Check whether Easy Install installed Tools automatically. If it didn’t finish, install it manually.

### Manual installation

1. Select **VM → Install VMware Tools** to mount the installer disc. If no window opens, look in **Computer** for the VMware Tools optical drive.

![Opening the VMware Tools disc](https://res.cloudinary.com/sycamore/image/upload/v1792696232/Typora/2025/09/9518839fc213f5938b8332abff0dc02b.png)

2. For this 64-bit guest I used `setup64.exe`. You can also choose it in AutoPlay.

![The 64-bit installer in AutoPlay](https://res.cloudinary.com/sycamore/image/upload/v1792696235/Typora/2025/09/5db950f7def8f35c953c8b3c4a42d881.png)

Wait for setup to initialise:

![VMware Tools preparing setup](https://res.cloudinary.com/sycamore/image/upload/v1792696235/Typora/2025/09/797cdb56de4efbdd991810b2c51b8bc9.png)

![Windows Installer preparing the installation](https://res.cloudinary.com/sycamore/image/upload/v1792696236/Typora/2025/09/664d1586ebe92c056b2f6942ec1da5db.png)

Choose **Next** in the wizard.

![VMware Tools 11.2.6 wizard](https://res.cloudinary.com/sycamore/image/upload/v1792696236/Typora/2025/09/1c360a3a308086b1e217dc746532a859.png)

3. Choose **Typical** and continue.

![Typical Tools installation](https://res.cloudinary.com/sycamore/image/upload/v1792696239/Typora/2025/09/cfee97b9944dbec5002894eb353bc189.png)

Finish the wizard and restart the guest if prompted.

![Installation complete](https://res.cloudinary.com/sycamore/image/upload/v1792696240/Typora/2025/09/fae7cf18234e155a74fa9d3acb0bcb1d.png)

### Troubleshooting

I ran into two separate problems.

#### Install VMware Tools is greyed out

The menu item was disabled:

![Disabled Tools menu item](https://res.cloudinary.com/sycamore/image/upload/v1792696241/Typora/2025/09/c4f0dc2b49eaa529a837a52443102b74.png)

In my case the virtual floppy disk from Easy Install was still attached. I shut down the guest:

![Shutting down the guest](https://res.cloudinary.com/sycamore/image/upload/v1792696248/Typora/2025/09/409c36c79d3f79d5fc923038d1cae855.png)

In VM settings I selected the floppy drive, clicked **Remove** and saved.

![Removing the Easy Install virtual floppy](https://res.cloudinary.com/sycamore/image/upload/v1792696244/Typora/2025/09/97933ab1b93b6f58c9bf98de5a695e25.png)

After restarting the guest, the Tools menu item was available again.

![The Tools installer is available again](https://res.cloudinary.com/sycamore/image/upload/v1792696244/Typora/2025/09/27bb09d7fbc23a99fdad2bb17465de90.png)

That was the cause on this particular VM. If there’s no floppy drive or removing it doesn’t help, check the optical drive configuration and the Easy Install state as well.

#### Windows can’t verify the driver publisher

Setup warned about the driver signature:

![Windows driver publisher warning](https://res.cloudinary.com/sycamore/image/upload/v1792696250/Typora/2025/09/7344a093df7c3d0378f6ad0272d2da46.png)

Continuing led to a VMCI driver installation failure and an early exit from the wizard.

![VMCI driver installation failure](https://res.cloudinary.com/sycamore/image/upload/v1792696248/Typora/2025/09/9fbc42a80baf094cf36a2a1ee0faa1a0.png)

![The installer ending prematurely](https://res.cloudinary.com/sycamore/image/upload/v1792696248/Typora/2025/09/a8266fa96d0098dd1d0ebf67c259dbc3.png)

My Windows 7 SP1 guest needed the updates that let it verify SHA-2 signatures. In the Microsoft Update Catalog, look up [KB4474419](https://www.catalog.update.microsoft.com/Search.aspx?q=KB4474419) and select the Windows 7 x64 entry. Check the product and architecture rather than relying on the order of the results.

![Selecting KB4474419 for Windows 7 x64](https://res.cloudinary.com/sycamore/image/upload/v1792696252/Typora/2025/09/9d7cf0dc62e194752ce64acff268a0f4.png)

Also check for the servicing stack update [KB4490628](https://www.catalog.update.microsoft.com/Search.aspx?q=KB4490628). Install it if missing and restart. [Microsoft’s SHA-2 support notes](https://support.microsoft.com/zh-cn/servicing/os/windows/2020/09/2019-sha-2-code-signing-support-requirement-for-windows-and-wsus) explain the roles and requirements of the two updates.

Shared folders weren’t available before Tools was working. I used 3CDaemon on the host to transfer the patch over FTP, as described in [Transferring files to a Windows 7 VM](/en/system/virtual-machine/transferring-files-to-a-windows-7-vm-over-ftp/). FTP needs connectivity between host and guest; a guest without Tools can still have network access.

Double-click the update in the guest. For KB4474419, wait for the checks and confirm installation:

![Checking the update package](https://res.cloudinary.com/sycamore/image/upload/v1792696252/Typora/2025/09/3b78e80e548be7f2ffd94ad11df0b24f.png)

![Confirming KB4474419](https://res.cloudinary.com/sycamore/image/upload/v1792696254/Typora/2025/09/139f37b41fb83453846760f2e9d7f95f.png)

![The update installing](https://res.cloudinary.com/sycamore/image/upload/v1792696256/Typora/2025/09/0c6bb7564a7959d634afe58301666b43.png)

![Restarting after the update](https://res.cloudinary.com/sycamore/image/upload/v1792696256/Typora/2025/09/0c8795cbb61aa3496c107f37ec56c38c.png)

After restarting, I reran VMware Tools and the installation completed.

## Setting up shared folders

With Tools installed, I could use shared folders for file transfers.

### Add the share in VMware

1. Open the VM settings.

![VM settings](https://res.cloudinary.com/sycamore/image/upload/v1792696258/Typora/2025/09/4a53a9e9813aec7a05d218b75e3e8667.png)

2. Under **Options → Shared Folders**, select **Always enabled** and choose **Add**.

![Enabling shared folders](https://res.cloudinary.com/sycamore/image/upload/v1792696259/Typora/2025/09/a8613435610b1698b6f64c749d906a24.png)

3. Continue through the wizard.

![The shared folder wizard](https://res.cloudinary.com/sycamore/image/upload/v1792696259/Typora/2025/09/cf59190da10a0138614a134e7cfb9a25.png)

Select the host directory and enter a share name. I used `Win7`, which is the name the guest sees.

![Setting the host directory and share name](https://res.cloudinary.com/sycamore/image/upload/v1792696260/Typora/2025/09/63ce694dc5f2b1428595f2fc187ad1b9.png)

Check **Enable this share** and finish. You can also make the share read-only if the guest only needs to read files.

![Enabling the share and choosing its access mode](https://res.cloudinary.com/sycamore/image/upload/v1792696262/Typora/2025/09/a051de4369b412a3cdfb32ef6896ab0a.png)

### Map a drive in the guest

In **Control Panel → Network and Internet → Network and Sharing Center**, I marked my lab network as a Work network. That’s how my screenshots were taken. VMware shared folders are distinct from ordinary Windows network shares; you don’t need to mark every network as Home or Work to use them.

![The lab network profile](https://res.cloudinary.com/sycamore/image/upload/v1792696263/Typora/2025/09/c4aed9b3c78629168582da06c5028d62.png)

Open **Computer → Map network drive**. Choose an unused drive letter and enter `\\vmware-host\Shared Folders\Win7`, or browse under `vmware-host`. Substitute the share name you configured.

![Mapping the VMware shared folder](https://res.cloudinary.com/sycamore/image/upload/v1792696270/Typora/2025/09/7241038b0f9c1810e40eca0d9e61063f.png)

The drive appears in **Computer**. Mine was `Z:`; opening it takes me to the host folder.

![The share mapped to drive Z](https://res.cloudinary.com/sycamore/image/upload/v1792696264/Typora/2025/09/849b4af650d6a33c3e897cf93adf25b6.png)

## Connecting over SSH

### Why add SSH?

Shared folders made transferring files easier, but I still prefer Xshell and Xftp. I often switch between several VMs during a lab. Opening each graphical desktop, unlocking it and finding a terminal gets old. Xshell remembers separate sessions; I can still switch to VMware whenever I need the GUI.

### Download, install and configure OpenSSH

#### Download

Get the compiled package from the [Win32-OpenSSH releases](https://github.com/PowerShell/Win32-OpenSSH/releases). My screenshots show v8.9.1.0; I used `OpenSSH-Win64.zip`.

![Release assets for Win32-OpenSSH](https://res.cloudinary.com/sycamore/image/upload/v1792696266/Typora/2025/09/d71056d7226535c865c84cfb32993188.png)

Choose the 64-bit program archive for this system, rather than the 32-bit build, debug symbols or source archive. Check OS support when choosing another release. The [project’s installation guide](https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH) covers the installation methods.

#### Install

Transfer the ZIP through the shared folder and extract it into `C:\Program Files\OpenSSH-Win64`.

![The extracted OpenSSH directory](https://res.cloudinary.com/sycamore/image/upload/v1792696267/Typora/2025/09/e103c81a48ea89479a4c58bdadff4e51.png)

Open an administrator Command Prompt, change to that directory and register the sshd service:

```bash
cd /d "C:\Program Files\OpenSSH-Win64"
powershell.exe -ExecutionPolicy Bypass -File install-sshd.ps1
```

![Running the service installation script](https://res.cloudinary.com/sycamore/image/upload/v1792696268/Typora/2025/09/7f0e2aeede30e9e7bef278cd799999d6.png)

#### Configure

**1. Add OpenSSH to the environment.** Right-click **Computer → Properties → Advanced system settings**.

![Opening Computer properties](https://res.cloudinary.com/sycamore/image/upload/v1792696270/Typora/2025/09/96b3372363059f03c69026e1df16a6a4.png)

![Advanced system settings](https://res.cloudinary.com/sycamore/image/upload/v1792696274/Typora/2025/09/2498a6600d64e23cb30890f4774f5ed7.png)

Open **Environment Variables** and append `;C:\Program Files\OpenSSH-Win64` to the system `Path`. The semicolon separates entries. Keep the existing paths.

![Adding the OpenSSH directory to Path](https://res.cloudinary.com/sycamore/image/upload/v1792696278/Typora/2025/09/b42c72c3269992563814f5085e0d7c0c.png)

Open a fresh Command Prompt and type `ssh`. Seeing the usage message confirms that the shell finds the command. It doesn’t establish that the server is running.

![Checking that ssh is available](https://res.cloudinary.com/sycamore/image/upload/v1792696276/Typora/2025/09/ad67bc3965d7e26632fc679eb4b830fd.png)

**2. Configure the sshd service.** In an administrator Command Prompt, enable automatic startup. Keep the space after `start=`:

```bash
sc config sshd start= auto
```

![Configuring automatic startup](https://res.cloudinary.com/sycamore/image/upload/v1792696280/Typora/2025/09/a13290b8e8e00b19358fbf1a09101eb6.png)

Start the service:

```bash
net start sshd
```

![Starting sshd](https://res.cloudinary.com/sycamore/image/upload/v1792696280/Typora/2025/09/487dc56353077dac03f1a549065a0410.png)

If SSH isn’t already allowed through Windows Firewall, add an inbound rule for TCP 22:

```bash
netsh advfirewall firewall add rule name=sshd dir=in action=allow protocol=TCP localport=22
```

![Adding the SSH inbound rule](https://res.cloudinary.com/sycamore/image/upload/v1792696280/Typora/2025/09/733b5d4ef353b9436e8e4fc75ccbb569.png)

#### Test from Xshell

1. Run `ipconfig` in the guest to find its IPv4 address. Mine was `192.168.158.135`; use your guest’s address.

![Looking up the guest IP address](https://res.cloudinary.com/sycamore/image/upload/v1792696282/Typora/2025/09/8ba32cc228e050ff54b5daa5b41e357a.png)

2. Create a session in Xshell on the host. Choose SSH, enter the guest address and leave the default port at 22.

![Xshell session settings](https://res.cloudinary.com/sycamore/image/upload/v1792696283/Typora/2025/09/d86af85d7896e644d181c9f1373a6a16.png)

3. On first connection, check that the unknown host key belongs to your guest before accepting and saving it.

![First connection host-key prompt](https://res.cloudinary.com/sycamore/image/upload/v1792696284/Typora/2025/09/cf3013572443782af0cc280791d0a5f8.png)

4. Sign in with the Windows 7 username and password. Run `whoami` in the resulting shell to confirm which account you’re using.

![Logging in and checking the active account](https://res.cloudinary.com/sycamore/image/upload/v1792696284/Typora/2025/09/73a799a15a695318a344898afe732f73.png)
