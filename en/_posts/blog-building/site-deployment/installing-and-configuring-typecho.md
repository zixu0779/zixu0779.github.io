---
title: Installing and Configuring Typecho
translation_id: install-typecho
source_digest: 5e8a2efb2036638d5a60a0e0eb0e3c7eeae0aa02905fbc5d82967e0410cf643f
tags:
  - Typecho
  - BT Panel
categories:
  - Blog Building
  - Site Deployment
sections: {"installing-typecho": "typecho安装", "before-you-start": "准备", "download-the-package": "下载安装包", "upload-and-extract": "上传-解压", "complete-the-installer": "信息填写", "basic-configuration": "typecho基本配置"}
---

I installed Typecho on a subdomain in my spare time. These notes cover the installation, then how to add themes and plugins.

<!-- more -->

:::info
The screenshots and steps come from my 2022 installation of Typecho 1.1. For a new site, download the stable release from the official website and check its server requirements. The archive layout and admin screens may differ from the ones below.
:::

## Installing Typecho

### Before you start

I used the BT Panel again. Have these ready:

1. A domain or subdomain that resolves to the server.
2. A PHP-enabled site and its document root, for example `/www/wwwroot/your-domain`.
3. A MySQL database for the site. Keep the database name, username and password handy.

BT Panel can create the directory and database when you add the site. The relevant steps are in [Setting up WordPress with BT Panel](/en/blog-building/site-deployment/setting-up-wordpress-with-bt-panel/). Stop once you’ve added the site; you don’t need to install WordPress.

You can upload the package through the panel’s file manager or use your usual file transfer method.

### Download the package

Get the stable release from the [Typecho download page](https://typecho.org/download). I originally used [Typecho 1.1](https://github.com/typecho/typecho/releases/tag/v1.1-17.10.30-release); that link identifies the version in the screenshots.

### Upload and extract

Open the site’s **document root** in the file manager. Choose **Upload**, select the archive and start the upload.

![Uploading the installation archive](https://res.cloudinary.com/sycamore/image/upload/v1792696432/Typora/2026/04/b9b89bd1217d73b778ed9998579495a1.png)

Extract the archive. The release I used produced a folder named `build`:

![The extracted build directory](https://res.cloudinary.com/sycamore/image/upload/v1792696432/Typora/2026/04/4df9b42ebee9eaabbcb36648bf74c92f.png)

Open `build`, select its files and directories, cut them and paste them into the document root.

![Moving the extracted files to the document root](https://res.cloudinary.com/sycamore/image/upload/v1792696432/Typora/2026/04/85e02df271638fd1989e8a7752781b12.png)

Check that `index.php`, `admin` and `usr` now sit directly under the site root.

If visiting the domain still brings up the panel’s welcome page, check whether your server gives the default `index.html` precedence. Once you’ve confirmed it’s just the placeholder created with the site, move it aside so the server can reach Typecho’s entry point.

### Complete the installer

Visit the domain you configured. You should see Typecho’s installation wizard:

![The Typecho installation wizard](https://res.cloudinary.com/sycamore/image/upload/v1792696436/Typora/2026/04/ffc77fe74d47807af977dda33fb112cc.png)

Resolve any server requirement warnings it reports. When the checks pass, click “我准备好了，开始下一步” (“I’m ready, go to the next step”).

![Database settings and administrator account fields](https://res.cloudinary.com/sycamore/image/upload/v1792696436/Typora/2026/04/a7b3b4540b951dd6e24aa42d637bcb38.jpg)

Enter the database settings and choose a MySQL adapter for a MySQL database.

- **Username, password and database name.** Use the values from the database you created in BT Panel. The screenshot’s `root` and `typecho` are examples.
- **Database host.** This is usually `localhost` if the site and database share a server. For a remote database, use its actual address.
- **Table prefix.** The default `typecho_` usually works. If another Typecho installation shares the database, use a different prefix so they don’t write to the same tables.

The next section is for the site and its administrator. Those credentials are for the Typecho dashboard and are separate from the database login.

- **Site URL.** Check the detected domain, scheme and installation directory. For a site already configured for HTTPS, use its working HTTPS address.
- **Username and password.** Choose an administrator username and a strong password and save them. The old version in the screenshot could generate a random password if you left the field blank; in that case you had to record the one shown after installation.
- **Email.** Replace the example address with one you use.

Click “确认，开始安装” (“Confirm and start installation”). This is the success screen:

![Typecho reporting a successful installation](https://res.cloudinary.com/sycamore/image/upload/v1792696436/Typora/2026/04/fdb159438670ee67f8f60c7986e260c9.png)

## Basic configuration

On the success page, click “访问您的控制面板” (“Visit your control panel”) to open the dashboard.

Under **Write**, you can create posts and pages using Markdown. **Manage** lets you manage posts, pages, comments and categories. Adjust your profile as you like. Here I’ll focus on adding plugins and themes.

Download the package from the plugin or theme author and check it supports your Typecho release. Upload and extract it in the appropriate directory:

- Plugins: `usr/plugins/`
- Themes: `usr/themes/`

> Both are relative to the **Typecho installation**. If your site lives at `/www/wwwroot/your-domain`, the plugin directory is `/www/wwwroot/your-domain/usr/plugins/`. The server’s top-level `/usr` is a different directory.

Each plugin or theme should have a directory of its own, without an extra wrapper directory from the archive. If a plugin requires a particular directory name, follow its author’s instructions.

In the dashboard, find the uploaded plugin under **Control Panel → Plugins** and enable it. For a theme, use **Control Panel → Appearance**. If it’s missing from the list, check the extraction path and directory nesting first.

From there, follow the individual plugin or theme’s configuration instructions.
