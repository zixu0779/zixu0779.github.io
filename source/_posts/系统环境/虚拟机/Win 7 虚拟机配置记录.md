---
title: Win 7 虚拟机配置记录
date: 2022-08-14 18:10:52
updated: 2025-09-14 23:06:28
tags: ["Windows", "VMware", "SSH", "共享文件夹"]
categories: [["系统环境", "虚拟机"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/63228774434ce50625d92068912c6ef0.jpg
---
Win 7 虚拟机安装、VMware Tools、共享文件夹和 SSH 配置。
<!-- more -->

因为要做 Windows 的渗透测试，我装了一台 Win 7 虚拟机。安装系统本身倒不复杂，后面装 VMware Tools、传文件、连 SSH 又折腾了一阵，就一起记下来了。

:::info
本文使用 VMware Workstation Pro 16 和 Windows 7 企业版 SP1 x64，配图中的 VMware Tools 为 11.2.6。下面保留这套实验环境的配置过程，其他版本需要核对兼容性。
:::

## 下载安装 win7 镜像

### 镜像下载（挑选)

我用的是 [MSDN](https://msdn.itellyou.cn/) 提供的镜像信息，这个站点并非微软官网。
本文选择的是 Windows 7 企业版 SP1 x64。另外，后面安装 VMware Tools 时会用到 SP1 和相关补丁。

![选择 Windows 7 企业版 SP1 x64 镜像](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/732bbc1c86ae1a240189d78f76323dde.png)

本文镜像的 ed2k 链接如下，需要使用支持该协议的下载工具：

```text
ed2k://|file|cn_windows_7_enterprise_with_sp1_x64_dvd_u_677685.iso|3265574912|E9DB2607EA3B3540F3FE2E388F8C53C4|/
```

### 安装 win7 虚拟机

1. 按 `Ctrl + N`，或选择“文件” → “新建虚拟机”。

![新建虚拟机入口](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9f57f4f5c20651c0c7345d6525ab8705.png)

2. 选择“典型”，点击下一步。

![选择典型配置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f6dc889e5b91bffc0f7c7a09001cd10a.png)

3. 选择“安装程序光盘映像文件”，找到下载好的 ISO 文件。

![选择 Windows 7 ISO 镜像](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/73142fdc9301d5fc842da5723fd1884d.png)

4. 填写简易安装信息，核对系统版本，再设置用户名和密码。后面要用这个账户连 SSH，密码记得留好。

![填写 Windows 简易安装信息](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/53ac1d29ff5046b17161e7d8c8686b21.png)

产品密钥可以先不填，出现下面的提示时点击“是”，继续安装。安装和激活是两回事，系统装好后仍需按自己的授权方式激活。

![未填写产品密钥时的安装提示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c978f6c017b98d82eef567df860c9033.png)

> 本文使用的密钥 `33PXH-7Y6KF-2VJC9-XBBR8-HVTHH` 是 Windows 7 企业版的 KMS 客户端安装密钥，并不是填入后就能独立激活的零售密钥。它需要配合有相应授权的 KMS 主机使用，说明见[微软文档](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)。
> 且此密钥的可用性并不能保证，大概率需要读者重新寻找可用密钥进行激活。

5. 填写虚拟机名称，选择保存虚拟机文件的目录。

![设置虚拟机名称和保存位置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/4bb7d478563dee6ac3eba031d54bcd80.png)

6. 设置磁盘容量。这里保留默认的 60 GB，选择拆分成多个文件。这种未预先分配全部空间的虚拟磁盘会随使用逐渐增长，不会创建时就占满 60 GB，但宿主机仍要留够后续使用的空间。

![设置虚拟磁盘容量](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/27e06d25f47f9fa092c86337b9ff76e7.png)

7. 确认配置，完成向导，等待虚拟机创建磁盘和安装 Windows。

![创建虚拟磁盘](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ba138c24863acc2f766c9dc2c97e4e7c.png)

![Windows 7 安装过程](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c67cd9c3eca856dcf7b9afffe42ce04b.png)

进入 Windows 桌面后，系统就装好了。

## 安装 VMware-Tools

先检查 VMware Tools 是否已经安装。
简易安装可能会自动处理；如果没有装好，再按下面的步骤手动安装。

### 手动安装步骤

1. 在 VMware 菜单中选择“虚拟机” → “安装 VMware Tools”，把安装光盘挂载到虚拟机里。如果没有自动弹出安装窗口，就打开“计算机”，找到标有 VMware Tools 的光驱。

![从 VMware Tools 光驱运行安装程序](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9518839fc213f5938b8332abff0dc02b.png)

2. 本文是 64 位系统，运行 `setup64.exe`。也可以在自动播放窗口里选择对应的安装程序。

![自动播放窗口中的 setup64.exe](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/5db950f7def8f35c953c8b3c4a42d881.png)

等待安装程序准备完成：

![VMware Tools 安装准备](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/797cdb56de4efbdd991810b2c51b8bc9.png)

![Windows Installer 准备安装](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/664d1586ebe92c056b2f6942ec1da5db.png)

进入安装向导后，点击下一步。

![VMware Tools 11.2.6 安装向导](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/1c360a3a308086b1e217dc746532a859.png)

3. 选择“典型安装”，继续安装。

![选择 VMware Tools 典型安装](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/cfee97b9944dbec5002894eb353bc189.png)

完成后退出向导，如果提示重启，就先重启虚拟机。

![VMware Tools 安装完成](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/fae7cf18234e155a74fa9d3acb0bcb1d.png)

### 错误处理

我在安装过程中遇到了下面两个问题，分别记一下处理方法。

#### 选项`安装 VMware-Tools` 为 灰色

安装选项是灰色的，无法点击：

![安装 VMware Tools 菜单不可用](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c4f0dc2b49eaa529a837a52443102b74.png)

这是因为我这台虚拟机还挂着简易安装使用的 ISO 软盘，移除后菜单就会恢复。以下是恢复步骤。
先关闭客户机：

![关闭 Windows 7 客户机](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/409c36c79d3f79d5fc923038d1cae855.png)

打开虚拟机设置，选中“软盘”，点击“移除”，保存设置。

![移除简易安装留下的虚拟软盘](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/97933ab1b93b6f58c9bf98de5a695e25.png)

重新启动虚拟机，就能点击“安装 VMware Tools”了。

![安装 VMware Tools 菜单恢复可用](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/27bb09d7fbc23a99fdad2bb17465de90.png)

这是本次安装过程中我遇到的情况。
如果没有软盘设备，或移除后仍是灰色，就还需要检查光驱配置和简易安装状态，不能只靠这一项判断原因。

#### Windows 无法验证此驱动程序软件的发布者

进入安装向导后，出现了驱动签名提示：

![Windows 无法验证驱动程序发布者](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/7344a093df7c3d0378f6ad0272d2da46.png)

继续安装又遇到 VMCI 驱动安装失败，最后向导提前结束。

![VMCI 驱动安装失败](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9fbc42a80baf094cf36a2a1ee0faa1a0.png)

![VMware Tools 安装提前结束](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a8266fa96d0098dd1d0ebf67c259dbc3.png)

这次的问题与系统缺少 SHA-2 签名支持更新有关。
安装相应补丁后，Windows 7 SP1 就能验证 SHA-2 签名，从而解决此问题。以下是解决的步骤。

先到微软更新目录查找 [KB4474419](https://www.catalog.update.microsoft.com/Search.aspx?q=KB4474419)，选择适用于 Windows 7、x64 的更新，不要只按列表中的位置下载。

![选择 Windows 7 x64 的 KB4474419 更新](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9d7cf0dc62e194752ce64acff268a0f4.png)

同时检查服务堆栈更新 [KB4490628](https://www.catalog.update.microsoft.com/Search.aspx?q=KB4490628)。缺少时也要补上，安装后重启。两项更新的作用和要求见[微软 SHA-2 支持说明](https://support.microsoft.com/zh-cn/servicing/os/windows/2020/09/2019-sha-2-code-signing-support-requirement-for-windows-and-wsus)。

VMware Tools 没装好时，共享文件夹还不能用。我用 **3CDaemon** 在宿主机上开了 FTP，把补丁传进虚拟机，过程另记在[《Win 7 虚拟机搭建 FTP》](/系统环境/虚拟机/Win%207%20虚拟机搭建%20FTP/)。FTP 仍然需要宿主机与虚拟机网络互通，未安装 VMware Tools 并不代表虚拟机没有网络。

补丁传入后，双击运行。下面是 KB4474419 的安装过程，先等待检查，再确认安装：

![Windows Update 检查更新包](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/3b78e80e548be7f2ffd94ad11df0b24f.png)

![确认安装 KB4474419](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/139f37b41fb83453846760f2e9d7f95f.png)

![安装 KB4474419](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/0c6bb7564a7959d634afe58301666b43.png)

![更新安装完成后重启](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/0c8795cbb61aa3496c107f37ec56c38c.png)

重启后重新运行 VMware Tools 安装程序，我这里就能正常装好了。

## 创建 win7 共享文件夹

装好 VMware Tools 后，就可以通过共享文件夹传文件了。

### VMware 虚拟机设置中添加

1. 打开虚拟机设置。

![打开虚拟机设置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/4a53a9e9813aec7a05d218b75e3e8667.png)

2. 在“选项” → “共享文件夹”中选择“总是启用”，点击“添加”。

![启用共享文件夹并添加目录](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a8613435610b1698b6f64c749d906a24.png)

3. 进入添加向导，点击下一步。

![共享文件夹添加向导](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/cf59190da10a0138614a134e7cfb9a25.png)

选择宿主机上的文件夹，再填写共享名称。这个名称会显示在虚拟机里，我这里填的是 `Win7`。

![选择主机路径和共享名称](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/63ce694dc5f2b1428595f2fc187ad1b9.png)

勾选“启用此共享”，完成添加。如果只需要让虚拟机读取文件，也可以勾选“只读”。

![启用共享并设置是否只读](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a051de4369b412a3cdfb32ef6896ab0a.png)

### Win7 虚拟机中 映射网络驱动器

我在“控制面板” → “网络和 Internet” → “网络和共享中心”中，把实验网络设成了“工作网络”。
当然这只是截图里的环境设置，VMware 共享文件夹不等同于普通的 Windows 网络共享，不必为了使用它把所有网络都改成家庭或工作网络。

![实验环境中的工作网络设置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c4aed9b3c78629168582da06c5028d62.png)

打开“计算机”，选择“映射网络驱动器”。选一个未占用的盘符，在文件夹栏填写 `\\vmware-host\Shared Folders\Win7`，也可以点“浏览”，找到 `vmware-host` 下的共享目录。最后一级名称按自己的设置填写。

![将 VMware 共享文件夹映射为网络驱动器](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/7241038b0f9c1810e40eca0d9e61063f.png)

完成后，“计算机”中就会出现对应的网络驱动器。我这里使用的是 `Z:`，打开即可访问宿主机的共享文件夹。

![映射后的 Z 盘共享目录](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/849b4af650d6a33c3e897cf93adf25b6.png)

## 安装建立 SSH 连接

### 为什么还要装 SSH

有了共享文件夹，传文件已经方便多了，但我还是更习惯用 Xshell 和 Xftp。

除了 Win 7，我还有其他虚拟机。做实验时经常要在几台之间切换，每次都切回图形界面、解锁再找终端，多少有点麻烦。
而Xshell 可以保存不同会话，切换起来方便一些。需要图形界面时再回到 VMware 就行。

### 下载 安装 配置 OpenSSH

#### 下载：

到 [Win32-OpenSSH 发布页](https://github.com/PowerShell/Win32-OpenSSH/releases) 下载编译好的安装包。下面的截图是 v8.9.1.0 发布附件，我用的是 `OpenSSH-Win64.zip`。

![Win32-OpenSSH 发布附件](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/d71056d7226535c865c84cfb32993188.png)

注意区分 Win32、Win64、Symbols 和 Source code：本文用 64 位程序包，不需要调试符号或源码包。其他版本还要查看系统兼容要求，不能只看位数就直接换成最新版。安装方式可对照[项目说明](https://github.com/PowerShell/Win32-OpenSSH/wiki/Install-Win32-OpenSSH)。

#### 安装：

通过共享文件夹把 ZIP 包传入虚拟机，解压到 `C:\Program Files\OpenSSH-Win64`。

![OpenSSH-Win64 的解压位置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/e103c81a48ea89479a4c58bdadff4e51.png)

接着，以管理员身份打开 CMD，进入安装目录，注册 sshd 服务：

```bash
cd /d "C:\Program Files\OpenSSH-Win64"
powershell.exe -ExecutionPolicy Bypass -File install-sshd.ps1
```

![运行脚本安装 sshd 服务](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/7f0e2aeede30e9e7bef278cd799999d6.png)

#### 配置：

**1. 添加环境变量**

右键“计算机” → “属性” → “高级系统设置”。

![打开计算机属性](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/96b3372363059f03c69026e1df16a6a4.png)

![进入高级系统设置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/2498a6600d64e23cb30890f4774f5ed7.png)

点击“环境变量”，在系统变量中编辑 `Path`，在原有内容末尾追加 `;C:\Program Files\OpenSSH-Win64`。前面的分号用于分隔路径，别把原有内容覆盖了。

![将 OpenSSH 目录添加到 Path](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/b42c72c3269992563814f5085e0d7c0c.png)

保存后重新打开 CMD，输入 `ssh`。出现使用说明，说明当前终端已经能找到这个命令；这一步还不能证明服务端已经启动。

![运行 ssh 检查命令是否可用](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ad67bc3965d7e26632fc679eb4b830fd.png)

**2. 配置 sshd 服务**

在管理员 CMD 中，设置 sshd 开机自启。`start=` 后面需要保留一个空格：

```bash
sc config sshd start= auto
```

![设置 sshd 服务自动启动](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a13290b8e8e00b19358fbf1a09101eb6.png)

启动服务：

```bash
net start sshd
```

![启动 sshd 服务](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/487dc56353077dac03f1a549065a0410.png)

如果 Windows 防火墙还没有放行 SSH，添加 TCP 22 端口的入站规则：

```bash
netsh advfirewall firewall add rule name=sshd dir=in action=allow protocol=TCP localport=22
```

![添加 SSH 入站防火墙规则](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/733b5d4ef353b9436e8e4fc75ccbb569.png)

#### Xshell 连接试验

1. 在虚拟机中运行 `ipconfig`，查看当前网卡的 IPv4 地址。我这里是 `192.168.158.135`，连接时换成自己的地址。

![查看虚拟机 IPv4 地址](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/8ba32cc228e050ff54b5daa5b41e357a.png)

2. 在宿主机的 Xshell 中建立新会话，协议选 SSH，填写虚拟机 IP，端口使用默认的 22。

![填写 Xshell SSH 会话信息](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/d86af85d7896e644d181c9f1373a6a16.png)

3. 首次连接会提示未知主机密钥。核对确实是自己的虚拟机后，接受并保存。

![首次连接时的 SSH 主机密钥提示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/cf3013572443782af0cc280791d0a5f8.png)

4. 输入 Win 7 的用户名和密码，就能进入命令行了。这里运行 `whoami`，可以确认当前登录的账户。

![通过 Xshell 登录 Windows 7 并查看当前账户](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/73a799a15a695318a344898afe732f73.png)
