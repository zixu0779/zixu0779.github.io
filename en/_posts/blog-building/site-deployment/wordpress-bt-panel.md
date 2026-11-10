---
title: Setting up WordPress with BT Panel
translation_id: wordpress-bt-panel
source_digest: b4f25a56da162f0e0ccba5336a2a3597cb7e77dbdbfb898e91faa7d6b1b7cb0a
tags:
  - WordPress
  - BT Panel
  - SSH
categories:
  - Blog Building
  - Site Deployment
sections: {"a-quick-aside": "哔哔~", "getting-ready": "准备工作", "remote-access-and-file-transfers": "远程连接与文件传输", "server-and-domain-name": "服务器和域名", "before-installation": "开始安装前", "adding-a-site": "添加站点", "one-click-wordpress-deployment": "一键部署-wordpress", "install-wordpress-and-create-the-database": "安装-wordpress-和数据库", "open-the-site": "访问站点"}
---

Two ways to set up a blog with BT Panel: add a site and install the software yourself, or let the panel deploy WordPress.

<!-- more -->

## A quick aside

BT Panel made this so much easier for me d(*￣▽￣)==b. It covers enough ground that I ended up using it for most file management and terminal work too. I’ve kept some screenshots so you can follow along o_o ....

## Getting ready

:::warning
These are the tools, prices and impressions from my original setup. The figures below are historical.
:::

### Remote access and file transfers

I needed a way to use the server terminal and a way to upload files. I chose **Xshell and Xftp**. Xshell remembers connection details and can open Xftp from its toolbar. I tried PuTTY too, but its interface and default settings didn’t suit me.

At the time, Xshell and Xftp had free editions for home and school use. Check the current editions and application process if you want to use them. After installing BT Panel I could also use its Terminal and Files screens, which is what I usually ended up doing.

### Server and domain name

I looked at Alibaba Cloud ECS and its Simple Application Server. The latter offered a BT Panel image and saved me some setup.

I used the new-user and student offers. I paid 100 yuan a year for three years, then spotted a 40-yuan annual offer with much the same specs. That stung… Those prices tell you what happened to me, rather than what a server costs now.

For the domain I picked a name, suffix and registration period. I was looking mainly at `.top` and `.xyz` because they were inexpensive. Checkout also involved completing the contact information template, verifying my email and going through identity verification.

I had to deal with ICP filing too. Mostly I remember the waiting and the repeated rounds of corrections. The provider’s [filing instructions](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-application-overview) describe the applicable requirements.

### Before installation

The steps below assume the panel is installed, the domain resolves to the server, and a web server, PHP and a database are ready for WordPress. My screenshots show the panel I used at the time. Menu locations may differ in another release.

Choose one of these routes:

1. To upload your own package, start with [adding a site](#adding-a-site), then install your blog software manually.
2. For WordPress, you can go straight to [one-click deployment](#one-click-wordpress-deployment). It creates the site for you, so there’s no need to register the same domain twice.

## Adding a site

Choose **Website → Add site** in the panel sidebar.

- **Domain:** Enter the domain you plan to use. The panel fills in a description and directory. Check that neither conflicts with an existing site.
- **FTP:** Create an account if you intend to transfer files that way. The panel’s file manager works without one.
- **Database:** This blog has an admin area and needs a database. Save the database name, username and password.

The panel can generate a strong password. Keep it somewhere you can retrieve it. If you later change the database password, update the application’s connection settings at the same time.

To install your blog manually, upload and extract its package in the site directory, visit the domain and complete the installer. For Typecho I’ve written up [installation and configuration separately](/en/博客搭建/建站部署/Typecho%20安装与配置/).

The next section is the alternative route for WordPress. Skip it if you’ve already created the site manually.

## One-click WordPress deployment

### Install WordPress and create the database

Open **Software Store → One-click deployment**, find WordPress and click its deployment button.

![WordPress in the one-click deployment list](https://res.cloudinary.com/sycamore/image/upload/v1792696424/Typora/2026/04/36ce50208b3996f9bd5bfd12b269f631.png)

Fill in the site details:

![WordPress deployment form](https://res.cloudinary.com/sycamore/image/upload/v1792696423/Typora/2026/04/b0b344d889e9ed50d264020b11e91652.png)

Once you enter the domain, the panel fills in the description, document root and database. Review the values and submit.

If the domain is already registered as a site in the panel, you’ll see a duplicate-site message. For a separate site, use a different subdomain and configure its DNS:

![Duplicate-site warning](https://res.cloudinary.com/sycamore/image/upload/v1792696423/Typora/2026/04/5c4d2bf7216b5cd6b0facab1e8b32042.png)

A successful deployment looks like this:

![Deployment confirmation and database details](https://res.cloudinary.com/sycamore/image/upload/v1792696424/Typora/2026/04/ebe9183361ebaa64b1883c682fcceb0a.png)

Save those details for the database connection form.

### Open the site

Click the green link at the bottom of the confirmation screen. If you’ve already closed it, just visit the domain you entered.

Give the installer a moment to open. If it stays unresponsive, check the service status and logs. You should eventually see the language selector:

![The WordPress language selector](https://res.cloudinary.com/sycamore/image/upload/v1792696427/Typora/2026/04/93fa30be4fd2c90586fd8398de98f860.png)

Choose your language. Chinese was at the bottom of the list. Next, enter the database name, username and password from the deployment screen in their corresponding fields.

If WordPress and the database share a server, `localhost` usually works for the database host. For a remote database, use its actual address. The default table prefix is generally fine; give each installation a distinct prefix if several share a database.

![WordPress database connection settings](https://res.cloudinary.com/sycamore/image/upload/v1792696427/Typora/2026/04/8d800153bd7c05d5b2e4de02c56a62b3.png)

If you didn’t save the settings earlier, you can look them up in BT Panel:

![Where to find the database details in the panel](https://res.cloudinary.com/sycamore/image/upload/v1792696428/Typora/2026/04/16521e8e61d7c81778006964901e788e.png)

Submit the form, then click **Run the installation**.

![Proceeding to the WordPress installer](https://res.cloudinary.com/sycamore/image/upload/v1792696428/Typora/2026/04/b0dfd354358bcc12ad69813bef2d5a6a.png)

Enter the site title, administrator username, password and email. This is the WordPress administrator account, separate from the database account. You can later change the site title, password and email in the dashboard. The username can’t be changed directly in the profile screen, so give it some thought now.

If the site isn’t ready for search engines, you can select **Discourage search engines from indexing this site** and clear it later. This asks crawlers not to index it. People who know the address can still visit. See the [WordPress Reading settings documentation](https://wordpress.org/documentation/article/settings-reading-screen/).

Click **Install WordPress** and sign in to the dashboard once installation finishes. From here you can explore on your own. I’d start by finding a theme you like.
