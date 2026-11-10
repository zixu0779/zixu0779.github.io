---
title: Building Bash with network redirections
translation_id: building-bash
source_digest: 2eebe67f25f315d5e26415b5881dce1da8bdbc7cdb548751e80cb60c264d0c3a
tags:
  - Bash
  - Linux
  - Building from Source
  - Bash Network Redirection
categories:
  - System
  - Linux
sections: {"check-the-installed-shell-and-bash-version": "查看-bash-shell-版本", "download-and-install-bash": "下载安装-bash", "download": "下载", "extract-the-source": "解压", "configure-the-build": "配置编译选项", "compile-and-install": "编译与安装", "use-the-new-shell": "更换使用"}
---

I rebuilt Bash from source. These notes cover downloading the source, compiling it and switching to the new shell.

<!-- more -->

:::info
I used Bash 5.1.16 in a Kali virtual machine. It was already an older release when I documented this; choose the version appropriate to your own environment.
:::

## Check the installed shell and Bash version

First check the login shell configured for the account:

```bash
echo "$SHELL"
```

![The account’s configured login shell is zsh](https://res.cloudinary.com/sycamore/image/upload/v1792696314/Typora/2026/05/a6dc5cf7a829a5a6097d237405661fca.png)

`$SHELL` normally contains the login shell path. My guest used zsh by default, but also had Bash installed. Check its version separately:

```bash
bash --version
```

My installed version was Bash 5.1.16:

![Bash version output](https://res.cloudinary.com/sycamore/image/upload/v1792696316/Typora/2026/05/72468c0ebb118510e769b5b84090330a.png)

## Download and install Bash

I wanted to select a build option explicitly, so I built from source. You’ll need a C compiler and make. On Kali, `sudo apt install build-essential` installs the build tools.

### Download

Find the [5.1.16 source archive](https://ftp.gnu.org/gnu/bash/bash-5.1.16.tar.gz) in the [GNU Bash download directory](https://ftp.gnu.org/gnu/bash/) and download it with wget:

```bash
wget https://ftp.gnu.org/gnu/bash/bash-5.1.16.tar.gz
```

![Downloading the Bash source archive](https://res.cloudinary.com/sycamore/image/upload/v1792696325/Typora/2026/05/34cc060cd5b5566b1e3199248a5d1b9d.png)

### Extract the source

```bash
tar -zxvf bash-5.1.16.tar.gz
```

This creates a `bash-5.1.16` directory in the working directory:

![The extracted directory](https://res.cloudinary.com/sycamore/image/upload/v1792696318/Typora/2026/05/f735c3f744f1c15416e9ed316c072c5e.png)

Change into it:

```bash
cd bash-5.1.16
```

### Configure the build

Select a separate installation prefix and explicitly enable network redirections:

```bash
./configure --prefix=/usr/local/bash --enable-net-redirections
```

The `--prefix` option puts the installation under `/usr/local/bash`, leaving the system’s existing Bash binary in place.

![Configuring the prefix and build option](https://res.cloudinary.com/sycamore/image/upload/v1792696325/Typora/2026/05/56ff26d1b92b96426325dc707626d147.png)

### Compile and install

Build the configured source:

```bash
make
```

![Compiling Bash](https://res.cloudinary.com/sycamore/image/upload/v1792696320/Typora/2026/05/06946af30cebfad1df042a0913409994.png)

After the build succeeds, install it under the selected prefix:

```bash
sudo make install
```

I was running as root in the screenshot, so the command there is simply `make install`.

![Installing the compiled files](https://res.cloudinary.com/sycamore/image/upload/v1792696323/Typora/2026/05/071576989e4ab50a87b4319ab34c6adc.png)

## Use the new shell

You can launch it directly without changing the account’s login shell:

```bash
/usr/local/bash/bin/bash
```

To make it your login shell, check whether `/etc/shells` already lists `/usr/local/bash/bin/bash`. If it’s absent, append it:

```bash
echo '/usr/local/bash/bin/bash' | sudo tee -a /etc/shells
```

Set the current account’s login shell:

```bash
chsh -s /usr/local/bash/bin/bash
```

Log out and back in for the change to take effect. A full reboot isn’t necessary. Run `echo "$SHELL"` after logging back in to check the configured path.

![The new Bash path as the login shell](https://res.cloudinary.com/sycamore/image/upload/v1792696330/Typora/2026/05/04a9e7185976fdfa19a6a6f9dec41af1.png)
