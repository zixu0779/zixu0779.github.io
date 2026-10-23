---
title: Win 11 虚拟机安装记录
date: 2025-02-16 18:35:51
updated: 2025-11-09 16:24:53
tags: ["Windows", "VMware", "虚拟机"]
categories: [["系统环境", "虚拟机"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/25793f68127f486bbbaa7d5bb6499ce4.jpg
---
误删了电脑里所有的虚拟机，还没有备份。本文记录一下重新安装 Win 11 的过程。
<!-- more -->

:::info
本文使用 VMware Workstation 16.x 和 2022 年 3 月更新的 Win 11 镜像，安装的是专业版。截图中的界面与新版软件可能不同，本文按这套环境记录安装和配置步骤。
:::

## Win 11 镜像下载

镜像是在 [NEXT, ITELLYOU](https://next.itellyou.cn/) 找的。它和 [MSDN](https://msdn.itellyou.cn/) 是同一站点团队提供的服务。

进入网站后，点击顶部导航栏的“原版软件”：

![NEXT, ITELLYOU 的原版软件入口](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/791dff305a14ba82d730664438c3b2eb.png)

在操作系统列表中选择 Windows 11：

![选择 Windows 11 镜像分类](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/2d57c74687e7f7757dedc6cfedff53cc.png)

我下载的是 `business editions` 镜像，安装时再选择专业版。

![Win 11 business editions 和 consumer editions 镜像列表](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ff2d6147b7583139faac82d6b193eeec.png)

如图所示的两类都是包含多个版本的安装镜像，并非“企业版”和“家庭版”两个单独的系统。
两者都包含专业版；business editions 包含企业版，consumer editions 包含家庭版，具体版本以所下载镜像的安装列表为准。

本文使用的镜像文件名和 ED2K 链接如下。这是旧版镜像的记录，新装系统也可以从[微软下载页面](https://www.microsoft.com/zh-cn/software-download/windows11)获取当前版本。

```text
ed2k://|file|zh-cn_windows_11_business_editions_updated_march_2022_x64_dvd_7df6eae1.iso|5582235648|B7C9D076AE16A10C9D2610207577F28D|/
```

## 安装 Win 11 虚拟机

### 新建虚拟机

镜像下载好后，先创建虚拟机并分配硬件资源。Win 11 对内存、磁盘和 TPM 等都有要求，需要一起检查，不能只选好镜像就直接安装。

1. 点击“文件 → 新建虚拟机”，进入向导。在安装来源中选择下载好的 ISO 文件。

![在新建虚拟机向导中选择 Win 11 ISO 镜像](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/d3a8942d2ad0b317c0cc62648ee8bf92.png)

2. 选择客户机操作系统。截图中的 VMware 没有 Win 11 选项，所以我选了“Microsoft Windows → Windows 10 x64”。如果使用的版本已经提供“Windows 11 x64”，直接选它即可。

![旧版 VMware 中选择 Windows 10 x64](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/338edd4301cc6cad326035c9a4221cc5.png)

3. 设置虚拟磁盘容量。我分配了 100 GB，留出系统和后续软件的空间。Win 11 的最低存储要求是 64 GB。截图中是针对 Win 10 给出的 60 GB 建议值，对Win 11 并不合适。

![为虚拟机分配 100 GB 磁盘空间](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/2982c11f8bc33629ed97c7027051ecaa.png)

4. 在完成向导前，点击“自定义硬件”调整内存和处理器。本文分配的是 4 GB 内存、4 个 CPU 内核和 100 GB 磁盘。

![创建前确认虚拟机的内存、处理器和磁盘配置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f5cdc00ac398b079aef715e9cef1d33d.png)

[微软列出的最低要求](https://www.microsoft.com/zh-cn/windows/windows-11-specifications) 包括兼容的 64 位双核处理器、4 GB 内存、64 GB 存储空间，以及支持安全启动的 UEFI 和 TPM 2.0。

> 确认配置后，**先不要启动，下面还要添加 TPM。**

### 添加 TPM

仅分配好内存和磁盘还不够。如果没有配置 TPM，安装时可能会出现“这台电脑无法运行 Windows 11”的提示：

![安装程序提示这台电脑无法运行 Windows 11](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/41f08312d8479a1167c27196098b1ca3.png)

我使用的 Workstation 需要先加密虚拟机，才能添加可信平台模块。保持虚拟机关机，打开设置，按下面的步骤操作。

1. 进入“选项 → 访问控制”，点击“加密”，设置并保存密码。

![在访问控制中加密虚拟机](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/863b1258fb1e625aad5724a82baee5c5.png)

这个密码用于解锁虚拟机，需要妥善保存。打开虚拟机时是否再次要求输入，还取决于是否保存了密码。

2. 进入“硬件 → 添加”，选择“可信平台模块”，点击“完成”。

![为虚拟机添加可信平台模块](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/896f6935d4351cef18cdd1d971bd7487.png)

另外，检查“选项 → 高级”中的固件设置，使用 UEFI 并启用安全启动。保存后再启动安装；如果仍提示不满足要求，就继续核对前面的处理器、内存等配置。相关配置可以对照 [VMware 的 Win 11 安装说明](https://knowledge.broadcom.com/external/article/315650/installing-windows-11-as-a-guest-os-on-v.html)。

### 启动并安装系统

虚拟机准备好后，就可以从镜像启动了。这里主要记录容易错过的启动提示，以及版本和磁盘的选择。

1. 启动后，点击虚拟机窗口，让键盘输入进入虚拟机。看到 `Press any key to boot from CD or DVD...` 时及时按任意键。

![从安装光盘启动时的按键提示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ffcf4d54df07765c493a15ef76f6b25b.png)

如果错过这个提示，虚拟机会继续尝试其他启动设备。下图是转到 EFI 网络启动后超时的画面，并不是安装程序卡住了。重启虚拟机，再按提示从光盘启动即可。

![错过光盘启动后出现 EFI 网络启动超时](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/e0b203eb588dda997504fb10073d24db.png)

2. 按安装向导选择语言等选项，进入系统版本列表。我选择的是“Windows 11 专业版”。

![选择安装 Windows 11 专业版](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/0e49cc6f9b7014e5ed99939012d6ccf9.png)

3. 安装类型选择“自定义：仅安装 Windows（高级）”。这是一个新建的空白虚拟机，需要全新安装。

![选择自定义安装](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c63c3401280590e3a29245e4d714e38a.png)

4. 选择虚拟磁盘上的未分配空间，点击“新建”，按需要设置系统分区大小，再点击“应用”。下图把整块 100 GB 虚拟磁盘分给了系统，没有另外划分 D 盘；安装程序还会自动创建所需的系统分区。

![在未分配空间中创建安装分区](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/b8e71588df1d8b52f1a3daf9d281e353.png)

选中用于安装 Windows 的主分区，继续下一步，等待文件复制和系统重启。

![安装后重启并准备系统](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/7b98b25772ebdc03a9bedc22257cb105.png)

5. 按提示完成地区、键盘和账户等初始设置。

![设置 Windows 的国家或地区](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/3db95d71ff0acde6daa635e63380e18b.png)

设置完成后，等待系统准备好桌面即可。

![初始设置完成后等待进入桌面](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/faa285dbc5a0c474b52248c6449a25e3.png)

## 安装 VMware Tools

系统已经装好了，不过后面还要在宿主机和虚拟机之间复制命令、共享文件。为了方便这些操作，先安装 VMware Tools。

1. 在 VMware 菜单中选择“虚拟机 → 安装 VMware Tools”，将安装光盘挂载到虚拟机。

![从 VMware 菜单挂载 Tools 安装光盘](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f656802af2a999811f4fe02887b4a46d.png)

2. 如果安装向导没有自动打开，就进入文件资源管理器，打开 VMware Tools 光盘，运行 `setup64`。图中的光驱盘符是 D，实际以自己虚拟机里显示的盘符为准。

![在虚拟光驱中运行 setup64](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/b3954036aa9224ddccd91c871f7f8893.png)

3. 打开安装向导，按提示继续，在安装类型中选择“典型”。

![VMware Tools 安装向导](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9ae5db46573b558302c65d16791c0254.png)

安装完成后，点击“完成”，按提示重启虚拟机。

![VMware Tools 安装完成](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/2d1c0f84cbcffce42beae398d2f623e9.png)

## Win 11 专业版激活

安装完成后，可以在“设置 → 系统 → 激活”查看状态。我的虚拟机这里显示“未激活”：

![设置中显示 Windows 11 专业版未激活](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/b46ec91f451c4de9a831ed9b69d5cc9a.png)

未激活不等于系统会在某个固定期限后无法启动。因此这里只是为了去掉这个烦人的警告。
激活需要与所装版本匹配的许可证；如个人使用可以在这个页面输入产品密钥，或使用已有的数字许可证。

下面是使用 KMS 命令的操作记录。这种方式用于有相应批量授权和 KMS 服务的环境。具体使用的密钥不保证仍然有效。
具体条件见[微软的 KMS 客户端密钥说明](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)。

1. 搜索 CMD，以管理员身份打开命令提示符。

![以管理员身份打开 CMD](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/e3b151d1971b81e2e763891ea9ecefb4.png)

2. 安装 Win 11 专业版的 KMS 客户端密钥：

```bash
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
```

![安装专业版 KMS 客户端密钥后的提示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ced00a4b004c06e9f2356edb2e01e04c.png)

3. 如果需要手动指定 KMS 服务器，使用 `slmgr /skms <服务器地址>`，将占位内容换成所在组织提供的地址。截图保留了原操作中的地址，不作为现在可用的服务器推荐。

![设置 KMS 服务器地址后的提示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9358882fffe07ef3c3e3db876afad89e.png)

设置成功只说明地址已写入，并不代表服务器可以连接，也不代表已经激活。

4. 输入 `slmgr /ato`，请求激活。

![执行激活命令后的提示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/36bc8abb1ec174ec21129bf9f854bd61.png)

最后回到设置页面确认状态。下面是原操作完成后的截图：

![设置中显示已激活](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/c27217ec83ab6a9f50cd4ca7f0d53139.png)

## 添加共享文件夹

VMware Tools 安装好后，就可以配置共享文件夹，直接访问宿主机中的文件。这和[《Win 7 虚拟机配置记录》](/系统环境/虚拟机/Win%207%20虚拟机配置记录/)中的操作类似。

1. 打开虚拟机设置，进入“选项 → 共享文件夹”，选择“总是启用”，再添加需要共享的宿主机目录。

2. 回到 Win 11，在文件资源管理器地址栏输入 `\\vmware-host\Shared Folders`，检查能否看到添加的目录。

如果想通过“网络”里的浏览列表查找，可以通过网络环境设置网络发现。下面是我使用的设置截图，但它不是直接访问 VMware 共享路径的必要条件，如果没有此需求则不需要照着在公用网络中开启网络发现。

![通过浏览列表查找时使用的网络发现设置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a92c22729e15e0585a84fcc1e112af53.png)

3. 为了以后打开方便，可以把共享目录映射成一个盘符。在“此电脑”的菜单中选择“映射网络驱动器”。

![从此电脑打开映射网络驱动器](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/e265ff58617284810bf17a32bce6bbd7.png)

4. 选择盘符，在“文件夹”中填写共享路径，也可以点击“浏览”选择。

![指定需要映射的共享文件夹](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/49ad0d1c6d3225352afa5ffe27df5cb8.png)

依次展开 `vmware-host → Shared Folders → VMware共享`，这里的“VMware共享”是我设置的共享名称。

![在 vmware-host 下选择共享目录](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/79379495f2c29c73d95616821a42be72.png)

确认并完成后，“此电脑”的网络位置中就会出现对应的驱动器，以后从这里访问共享文件即可。

![共享目录映射后的网络驱动器](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ef8ab28424e1d5ed8eeea5da6f67beb4.png)
