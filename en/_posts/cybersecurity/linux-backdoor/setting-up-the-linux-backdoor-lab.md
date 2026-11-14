---
title: Setting Up the Linux Backdoor Lab
translation_id: kali-lab-ssh
source_digest: 1486bd87ac77b8eca4973d2e0aaaa6eeabc178638f75cc1ccfde20efb565b924
tags:
  - Linux
  - Kali
  - VMware
  - SSH
categories:
  - Cybersecurity
  - Linux Backdoor
sections: {"create-the-kali-vm": "vmware创建kali虚拟机", "create-an-xshell-session": "xshell安装和会话创建", "troubleshooting-ssh": "kali配置ssh连接问题汇总", "is-the-service-running": "ssh-是否开启", "can-the-host-reach-the-guest": "能否-ping-通", "the-ssh-server-rejects-the-password": "ssh服务拒绝密码"}
---

I used a Kali Linux guest as the lab server and Xshell on a Windows host to connect over SSH. This was the setup for my Linux backdoor experiments. Here’s how I connected and what I checked when the first attempt failed.

<!-- more -->

:::info
The screenshots are from my Kali 2022.1 installation in VMware on Windows in 2022. Menus, default service state and SSH settings vary between versions. The old image links identify the release in this post.
:::

## Create the Kali VM

I used VMware. I’ll skip the wizard here. Alongside installing from an ISO, Kali offers preconfigured guests:

- [Kali 2022.1 VMware image](https://old.kali.org/virtual-images/kali-2022.1/kali-linux-2022.1-vmware-amd64.7z)
- [Kali 2022.1 VirtualBox image](https://old.kali.org/virtual-images/kali-2022.1/kali-linux-2022.1-virtualbox-amd64.ova)

The [official Kali download page](https://www.kali.org/get-kali/#kali-virtual-machines) lists images for a fresh installation. The rest of my notes assume a Kali guest.

## Create an Xshell session

The Xshell installer is available from [NetSarang](https://www.netsarang.com/en/xshell/). Choose **File → New** and create an SSH session:

![Creating an SSH session in Xshell](https://res.cloudinary.com/sycamore/image/upload/v1792696473/Typora/2025/11/ec0e3b63c1b6407381f5fc198204b88b.png)

Give the session a name, choose SSH and use port 22 unless you’ve changed the service port. Set the host to the guest’s IP address.

Inside the guest, `ip addr` lists the interfaces. I used `ifconfig` for this screenshot; if it isn’t installed, `ip addr` works.

![Interfaces and address of the Kali guest](https://res.cloudinary.com/sycamore/image/upload/v1792696474/Typora/2025/11/03de79df0a7a5f15066393d8b3fdc732.png)

My guest was at `192.168.158.128`. Use the address assigned to yours. The loopback address `127.0.0.1` would refer to the host when entered in Xshell.

## Troubleshooting SSH

My first connection failed:

![Xshell reporting a connection failure](https://res.cloudinary.com/sycamore/image/upload/v1792696474/Typora/2025/11/44ad2149c5ece1467cd8f0dee447a105.png)

A stopped service, an unreachable guest and a rejected login need different checks.

### Is the service running?

Check the SSH service inside Kali and start it if needed:

```bash
sudo systemctl status ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

The screenshot shows `service ssh status`. The important part is `active (running)`.

![The running SSH service](https://res.cloudinary.com/sycamore/image/upload/v1792696477/Typora/2025/11/bf8774117739cb26e9767cc0b5a1f9f5.png)

To start the service automatically on boot:

```bash
sudo systemctl enable ssh
```

Undo that setting with `sudo systemctl disable ssh`. You can reconnect after starting the service without restarting the VM.

### Can the host reach the guest?

Once the server was running, I tried pinging the guest’s IP from Windows:

![The host cannot reach the guest by ping](https://res.cloudinary.com/sycamore/image/upload/v1792696477/Typora/2025/11/c72106aee3f1d8b7ac9a24d572b59b36.png)

A failed ping can be an address, adapter or firewall issue. In my case the problem was VMnet8. In VMware’s **Edit → Virtual Network Editor**, choose **Change Settings**, select VMnet8 and enable the host virtual adapter’s connection to the network. If it’s already selected, clearing it, applying, then selecting and applying again re-establishes the host connection.

![The host adapter option for VMnet8](https://res.cloudinary.com/sycamore/image/upload/v1792696477/Typora/2025/11/97fccc2c2ee041cbd1e6feb5cacbf47d.png)

That got me connected, although I had to repeat it after restarting the computer (￣_￣|||). I tried port forwarding too, but it didn’t solve this issue. The host can use its VMnet8 adapter to reach a guest on the same private network. Port forwarding is worth considering when an external machine needs to initiate a connection to a service behind NAT. See [VMware’s network mode overview](https://knowledge.broadcom.com/external/article/309842/understanding-networking-types-in-hosted.html).

Reconnecting the adapter was a workaround. I still needed to check the VMnet8 adapter, the two subnet configurations and firewall rules to find the persistent cause.

### The SSH server rejects the password

Once the guest was reachable, Xshell reported another error:

![The SSH service rejects a password](https://res.cloudinary.com/sycamore/image/upload/v1792696478/Typora/2025/11/4a17b7f6085ed11e25581ad4af01ad96.png)

I was trying to log in as root, and Xshell reported “The SSH server rejected your password. Please try again.” After checking the credentials, I looked at the account’s state and the server’s authentication policy in `/etc/ssh/sshd_config`.

![The guest’s SSH server settings](https://res.cloudinary.com/sycamore/image/upload/v1792696481/Typora/2025/11/8900184ed3d063762a64a4307d9111e0.png)

In this specific VM the screenshot shows `PermitRootLogin yes`. An ordinary user account doesn’t require that change. Leave other settings alone unless your setup needs them. The [OpenSSH configuration manual](https://man.openbsd.org/sshd_config) explains each directive.

After editing, validate the configuration before restarting the service:

```bash
sudo /usr/sbin/sshd -t
sudo systemctl restart ssh
```

Once the syntax check passes, restart SSH. The VM itself doesn’t need to reboot. Reconnecting from Xshell finally worked:

![Xshell connected to the Kali guest](https://res.cloudinary.com/sycamore/image/upload/v1792696482/Typora/2025/11/bc8a0d69bbf2c5972d1bb2864e8e36f7.png)
