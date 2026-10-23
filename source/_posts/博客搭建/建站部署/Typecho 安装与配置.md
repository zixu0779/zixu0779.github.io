---
title: Typecho 安装与配置
date: 2022-11-13 22:38:44
updated: 2026-04-19 14:40:02
tags: ["Typecho", "宝塔", "云服务器"]
categories: [["博客搭建", "建站部署"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9130289fab8c8fd13edb68a0aee26b93.png
---
闲暇之余，我在一个子域名下安装了 Typecho，顺便记录一下安装过程，以及主题、插件的安装方式。

<!-- more -->

:::info
本文的安装过程和截图来自 2022 年使用的 Typecho 1.1。现在安装请从官网下载正式版，并确认服务器环境符合该版本的要求；安装包结构和后台界面可能与下文不同。
:::

## Typecho安装

### 准备

这里继续使用宝塔面板，需要提前准备好：

1. 一个已经解析到服务器的域名或子域名。
2. 一个支持 PHP 的站点，以及对应的网站根目录，比如 `/www/wwwroot/你的域名`。
3. 一个用于本站的 MySQL 数据库，记下数据库名、用户名和密码。

在宝塔面板中添加站点时，可以一并创建目录和数据库。具体操作见[《用宝塔搭建 WordPress》](/%E5%8D%9A%E5%AE%A2%E6%90%AD%E5%BB%BA/%E5%BB%BA%E7%AB%99%E9%83%A8%E7%BD%B2/%E7%94%A8%E5%AE%9D%E5%A1%94%E6%90%AD%E5%BB%BA%20WordPress/)，完成添加站点的部分即可，不需要安装 WordPress。

安装包可以通过宝塔的文件管理上传，也可以按自己的传输文件的方式来。

### 下载安装包

打开 [Typecho 官网下载页](https://typecho.org/download)，下载正式版安装包。

本文在刚发布时使用的是 [Typecho 1.1](https://github.com/typecho/typecho/releases/tag/v1.1-17.10.30-release)。这个链接留作版本对照，新建站点直接使用官网下载页提供的正式版即可。

### 上传、解压

在宝塔面板的文件管理中，进入**网站根目录**，点击“上传”，选择下载好的压缩包，再点击“开始上传”。

![在宝塔文件管理中上传 Typecho 安装包](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/b9b89bd1217d73b778ed9998579495a1.png)

上传完毕后解压，会解压出一个 `build` 文件夹：

![旧版安装包解压后的 build 文件夹](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/4df9b42ebee9eaabbcb36648bf74c92f.png)

进入 `build` 文件夹，全选里面的文件和目录，点击“剪切”，再回到网站根目录粘贴。

![将 build 内的程序文件移到网站根目录](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/85e02df271638fd1989e8a7752781b12.png)

这里要确认的是，`index.php` 和 `admin`、`usr` 等目录直接放在网站根目录下。

如果访问域名时仍然出现宝塔的默认欢迎页，检查站点是否优先打开了默认的 `index.html`。确认它只是新建站点的占位页后，再移走该文件，避免它挡住 Typecho 的入口。

### 信息填写

访问之前填过的域名地址，正常情况下会进入安装引导页面：

![Typecho 安装引导页面](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/ffc77fe74d47807af977dda33fb112cc.png)

如果页面提示服务器环境不符合要求，先按提示处理。没有问题后，点击“我准备好了，开始下一步”。

![填写数据库信息和管理员账号](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a7b3b4540b951dd6e24aa42d637bcb38.jpg)

下一步，填写数据库信息。这里使用 MySQL，数据库适配器也要选择对应的类型。

- **数据库用户名、密码、数据库名**：填写此前在宝塔中创建数据库时记录的信息，不要照抄截图里的 `root` 和 `typecho`。
- **数据库地址**：数据库和网站在同一台服务器上时，一般使用 `localhost`；但如果使用远程数据库，就要填写实际地址。
- **数据库前缀**：通常可以保留 `typecho_`。如果同一个数据库中已经有另一套 Typecho，前缀需要区分开，避免使用同一组数据表。

下面是管理员账号和网站信息，这里的用户名、密码是登录 Typecho 后台用的，别和数据库账号填混了。

- **网站地址**：核对程序自动填写的地址是否正确，包括域名、协议和安装目录。已经配置好 HTTPS 的站点，应使用实际可访问的 HTTPS 地址。
- **用户名、登录密码**：设置自己的管理员账号和强密码，并保存好。截图中的旧版允许密码留空，由系统随机生成，但要记下安装成功页面给出的密码。
- **邮件地址**：填写自己的常用邮箱，替换掉示例地址。

填写好了之后，点击“确认，开始安装”。看到下面的页面，就说明安装成功了。

![Typecho 安装成功页面](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/fdb159438670ee67f8f60c7986e260c9.png)

## Typecho基本配置

点击安装成功页面中的“访问您的控制面板”，进入后台。

“撰写”中可以新建文章和页面，正文可以使用 Markdown 编辑；“管理”中可以管理文章、页面、评论和分类。个人资料可以按自己的需要修改，这里主要说一下插件和主题的安装。

先从插件或主题作者提供的地址下载安装包，并确认它支持自己使用的 Typecho 版本。上传、解压的位置分别是：

- 插件：`usr/plugins/`
- 主题：`usr/themes/`

>这两个路径都从 **Typecho 的安装目录**算起。比如 Typecho 安装在 `/www/wwwroot/你的域名`，插件目录就是 `/www/wwwroot/你的域名/usr/plugins/`，不要放到服务器根目录下的 `/usr` 中。

解压后，每个插件或主题应有自己的文件夹，注意不要多套一层压缩包目录。插件如果要求特定的文件夹名称，也要按作者的说明修改。

回到控制面板，在“控制台 → 插件”中找到刚上传的插件并启用；主题则在“控制台 → 外观”中选择并启用。如果列表中没有出现，先检查解压位置和文件夹结构。

后面的设置因插件、主题而异，按各自的说明继续配置即可。
