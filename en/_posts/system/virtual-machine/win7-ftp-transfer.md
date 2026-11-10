---
title: Transferring files to a Windows 7 VM over FTP
translation_id: win7-ftp-transfer
source_digest: 363359cc331f611f2c01a8a24408cbba68ed08b1d97ede1adb3fb851b40201eb
tags:
  - FTP
categories:
  - System
  - Virtual Machine
sections: {"why-ftp": "为什么要搭-ftp", "a-quick-look-at-3cdaemon": "简单介绍-3cdaemon", "configure-the-ftp-server-on-the-host": "宿主机配置-ftp-服务器", "connect-from-the-guest": "虚拟机连接-ftp-服务器", "download-the-file": "用-ftp-下载文件"}
---

I used 3CDaemon to run an FTP server on the host and transfer files into my Windows 7 virtual machine.

<!-- more -->

## Why FTP?

While installing VMware Tools in Windows 7, I kept hitting a driver signature error. I needed to install a SHA-2 support update first. [My Windows 7 VM notes](/en/系统环境/虚拟机/Win%207%20虚拟机配置记录/) cover the error and the update; this post is about getting the file into the VM.

Shared folders weren’t available because VMware Tools wasn’t installed, yet installing it required a patch that was sitting on the host. Running an FTP server on the host let the guest download the file. The two machines only needed to reach each other; the guest didn’t need internet access.

I picked **3CDaemon** to keep the setup short.

## A quick look at 3CDaemon

3CDaemon includes TFTP and FTP servers, a Syslog server and a TFTP client. I only used the FTP server. The host runs 3CDaemon and holds the files. The Windows 7 guest runs the FTP client. All the user and directory settings below belong to the host.

Here’s the application icon:

![The 3CDaemon application icon](https://res.cloudinary.com/sycamore/image/upload/v1792696286/Typora/2025/09/f10a491d66c5e04a1016ecd31a49031e.png)

The tools are listed on the left, with the selected tool’s log on the right.

![The main 3CDaemon window](https://res.cloudinary.com/sycamore/image/upload/v1792696288/Typora/2025/09/f7b3d6d129125031066cacd9ce5c10dd.png)

I used the Chinese version. Its [download page](https://wwfx.lanzouw.com/iZB1B1jhcvab) was accessible when I checked, but I haven’t rechecked the installer itself for malware, so I can’t vouch for the file.

## Configure the FTP server on the host

Create an FTP user and choose the host directory it can access. That’s where the patch will go. This directory is served by 3CDaemon independently of VMware’s shared folders feature.

Select **FTP Server** on the left, open **Configure FTP Server**, then go to the FTP users tab:

1. Enter a username and set its password.
2. Select the user directory on the host.
3. Set the permissions, save the user and confirm.

![Configuring an FTP user and home directory](https://res.cloudinary.com/sycamore/image/upload/v1792696288/Typora/2025/09/615423cb09e8cc30df25f514104b5c75.png)

I enabled all the permissions in the screenshot, but this transfer only needs login and download access. Upload and deletion aren’t required. After saving, check for the server-started message on the left and the listening address in the log.

## Connect from the guest

Use the built-in Windows `ftp` command in the guest. There’s no need to install IIS or enable an FTP server there.

First check that the host and guest can communicate. I pinged the host, which was at `192.168.43.124` in this screenshot:

![Checking connectivity from the guest to the host](https://res.cloudinary.com/sycamore/image/upload/v1792696289/Typora/2025/09/0e1c4286c2cb31e9e631e93a9c8d54fc.png)

A ping reply confirms an ICMP response. For FTP, the service must also be listening and the host firewall must allow the connection. The default control port, TCP 21, is on the **host**. Leave the firewall on and allow the traffic needed between the two machines.

Open Command Prompt in the VM and substitute a host address reachable from the guest:

```text
ftp 192.168.43.124
```

Enter the FTP credentials you set earlier. Nothing is echoed as you type the password. A `230` login response followed by the `ftp>` prompt means the login succeeded.

![Successful FTP login from Windows 7](https://res.cloudinary.com/sycamore/image/upload/v1792696290/Typora/2025/09/8e5854aa74837703492c041e50623116.png)

## Download the file

After login, the remote directory corresponds to the host directory assigned to this FTP account.

1. Put the file in that directory on the host. I named the patch `windows6.1.msu`; the commands below use that name.

![The patch in the FTP user directory](https://res.cloudinary.com/sycamore/image/upload/v1792696293/Typora/2025/09/d61ef3630797bf07569662996c7a5799.png)

2. At the guest’s `ftp>` prompt, enter `dir` and check that the file appears.

![Listing the remote directory](https://res.cloudinary.com/sycamore/image/upload/v1792696293/Typora/2025/09/765abe5446678f53520250918ba854cc.png)

If login succeeds but `dir` or a download hangs, check the FTP data connection. Login and file transfers use separate connections, so reaching TCP port 21 alone doesn’t establish that files can be transferred.

3. Decide where to save the patch. By default, the client uses the directory from which you launched it. To choose an existing guest directory, use `lcd`:

```text
lcd C:\Users\Sycamore\Desktop
```

Substitute your own username and path. Then set binary transfer mode and download the file:

```text
binary
get windows6.1.msu
```

The patch is binary, so switch out of the default ASCII mode before transferring it. Microsoft documents both [binary](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ftp-binary) and [lcd](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ftp-lcd).

![Downloading the patch with get](https://res.cloudinary.com/sycamore/image/upload/v1792696293/Typora/2025/09/4309f3c1ed612bc24c6245b64c6b0fff.png)

The screenshot shows `get` but omits the earlier `binary` command. It also shows a different host address, `10.4.13.131`; use the address for your current setup.

4. Once the transfer finishes, type `bye` to close the session and exit the client.

![The 221 response when leaving the FTP session](https://res.cloudinary.com/sycamore/image/upload/v1792696294/Typora/2025/09/1fba97d8fa5d61327fc9bb7f07b7e139.png)

The screenshot uses the abbreviation `by`. The full command is [bye](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ftp-bye). The server replies with status code `221` when closing the control connection. That’s a response code, not a port number; the host’s FTP service is still running.

You can now install the patch in the guest. When you’ve finished transferring files, stop the FTP service in 3CDaemon on the host.
