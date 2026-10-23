---
title: 重新编译 Bash：网络重定向
date: 2025-04-20 13:09:20
tags: ["Bash", "Linux", "源码编译", "网络重定向"]
categories: [["系统环境", "Linux"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/3ea0ff03af3b42b348eeb0416d6a28d1.jpg
updated: 2026-05-23 18:47:26
---

我尝试从源码重新编译 Bash，下面记录了下载、编译和切换 Shell 的过程。
<!-- more -->

:::info
本文使用 Bash 5.1.16，截图来自 Kali 虚拟机。该版本较旧，如需在其他环境中执行，请按实际需求选择版本。
:::

## 查看 Bash Shell 版本

先查看当前账号配置的登录 Shell：

```bash
echo "$SHELL"
```
![账号配置的登录 Shell 为 zsh](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a6dc5cf7a829a5a6097d237405661fca.png)

`$SHELL` 通常保存登录 Shell 的路径，图中可以看到本环境默认使用 zsh，但通常来说，系统也会默认安装 Bash。

查看已经安装的 Bash 版本：

```bash
bash --version
```

这里使用的是 Bash 5.1.16：

![预装的 Bash 版本为 5.1.16](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/72468c0ebb118510e769b5b84090330a.png)

## 下载安装 Bash

这次需要指定编译选项，所以选择从源码安装。编译前需要准备好 C 编译器和 make；Kali 中可以通过 `sudo apt install build-essential` 安装。

### 下载

在 [GNU 下载目录](https://ftp.gnu.org/gnu/bash/)中找到 [Bash 5.1.16 源码包](https://ftp.gnu.org/gnu/bash/bash-5.1.16.tar.gz)，使用 wget 下载：

```bash
wget https://ftp.gnu.org/gnu/bash/bash-5.1.16.tar.gz
```

![下载 Bash 5.1.16 源码包](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/34cc060cd5b5566b1e3199248a5d1b9d.png)

### 解压

解压源码包：

```bash
tar -zxvf bash-5.1.16.tar.gz
```

解压后，当前目录中会生成 `bash-5.1.16` 文件夹：

![解压后的源码目录](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f735c3f744f1c15416e9ed316c072c5e.png)

进入这个目录：

```bash
cd bash-5.1.16
```

### 配置编译选项

配置安装目录，并显式启用网络重定向：

```bash
./configure --prefix=/usr/local/bash --enable-net-redirections
```

`--prefix` 指定安装目录。这里将 Bash 安装到 `/usr/local/bash`，不会直接替换系统原有的 Bash。

![指定安装目录和网络重定向编译选项](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/56ff26d1b92b96426325dc707626d147.png)

### 编译与安装

配置完成后，执行 make 编译：

```bash
make
```

![编译 Bash 源码](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/06946af30cebfad1df042a0913409994.png)

编译通过后，再安装到前面指定的目录：

```bash
sudo make install
```

截图中使用的是 root 账号，所以直接执行了 `make install`。

![将编译结果安装到指定目录](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/071576989e4ab50a87b4319ab34c6adc.png)

## 更换使用

安装完成后，可以直接运行新 Bash，无需先修改默认 Shell：

```bash
/usr/local/bash/bin/bash
```

如果希望登录后默认使用它，先确认 `/etc/shells` 中是否已有 `/usr/local/bash/bin/bash`。没有的话，添加这一行：

```bash
echo '/usr/local/bash/bin/bash' | sudo tee -a /etc/shells
```

然后修改当前账号的登录 Shell：

```bash
chsh -s /usr/local/bash/bin/bash
```

退出账号并重新登录后生效，不必为此重启整台机器。重新登录后，执行 `echo "$SHELL"` 查看配置的路径：

![登录 Shell 已改为新安装的 Bash](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/04a9e7185976fdfa19a6a6f9dec41af1.png)
