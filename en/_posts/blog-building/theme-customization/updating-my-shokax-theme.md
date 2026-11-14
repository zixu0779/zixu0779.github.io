---
title: Updating My ShokaX Theme
translation_id: shokax-upgrade
source_digest: 117f381293a3b2eb97c6df2924376f7a60914e062487c71151e5ea067a285373
tags:
  - Hexo
  - ShokaX
  - ShokaX Plugins
categories:
  - Blog Building
  - Theme Customization
sections: {"installing-shoka-x": "安装-shoka-x", "updating-the-configuration": "更改主题配置", "site-configuration": "更改-_configyml", "copying-the-theme-configuration": "复制-theme_configshokaxyml", "moving-the-source-directory": "source-文件夹迁移", "adding-languagesyml": "新增-languagesyml", "iconfont": "iconfont-相关", "preconnecting-to-the-image-host": "预加载地址设置", "seo": "seo-优化", "installing-and-writing-plugins": "安装和制作插件", "counting-visits-and-visitors": "统计网站访问量和访客量", "showing-the-sites-age": "插入存活时间", "making-a-hitokoto-footer-plugin": "制作一言页脚插件"}
---

Shoka-X had changed quite a bit, so I used some spare time to update my theme. I’d customised a fair number of its files the first time around. Getting those changes back was enough work that I wanted to write down the process.

For the sake of the next upgrade, I’m trying to leave the theme’s source files alone wherever I can.

> PS: I found the plugin system 🎉. While I’m here, I might as well redo the Hitokoto footer and open an issue.

# Installing Shoka-X

With so many changes, including edits to the theme itself, I started in a fresh directory. I used the ShokaX starter:

```sh
git clone https://github.com/theme-shoka-x/shokax-can --depth=1
cd shokax-can
pnpm install
pnpm dlx hexo s
```

The fresh install ran locally. From the themes directory I then created a symlink to the installed theme:

`ln -s ../node_modules/hexo-theme-shokax shokax`

# Updating the configuration

> PS: The music player seems to work this time without my old changes.

## Site configuration

In `_config.yml` I carried over:

1. The site description.
2. The URL and permalink settings.
3. `category_map`.
4. Deployment settings.
5. Minification settings, including the additional `hexo-lightning-minify` package. On my Mac the local run reported `Error: Cannot find module '@minify-html/node-darwin-arm64'`. My deployment ran in GitHub Actions, so that local issue didn’t block it.
6. The Algolia search configuration I used at the time.

## Copying the theme configuration

I copied `_config.yml` from `themes/shokax` to the project root and named the copy `theme_config.shokax.yml`. The changes I made were:

1. Set `alternate`, the large site title.
2. Adjust the time dark mode starts.
3. Add the Travellings link and icon to the menu.
4. Enable Waline comments, set the server URL and add placeholder text.

## Moving the source directory

I copied the contents of my existing `source` directory over the starter’s.

## Adding languages.yml

I realised I could override translations without editing the theme’s language files. I added `languages.yml` in `source/_data/`. For each language, I added the `travellings` entry under `menu` for 开往. I also changed the browser tab titles shown when the page becomes active or hidden.

## Iconfont

When I first used the theme, the original Shoka project had stopped updating and joining its Iconfont project wasn’t practical. I ended up modifying the ShokaX source quite a bit.

This time I found an invitation link in the ShokaX documentation. No need to do all that again 🎉.

After joining, I added the Shoka icons to my own Iconfont project. In `_config.yml` I set `iconfont` to the identifier from the project’s hosted stylesheet, which has the form `//at.alicdn.com/t/c/font_<string>.css`.

I opened `http://at.alicdn.com/t/c/font_<string>.css` to find the new icon:

![Finding an icon in the hosted Iconfont stylesheet](https://res.cloudinary.com/sycamore/image/upload/v1737283099/Typora/2025/01/428e3f65a6f441f57d07c85941282c63.png)

Then I copied `themes/shokax/source/css/_iconfont.styl` into `source/_data` and appended the code for the icon.

## Preconnecting to the image host

This setting was new to me, so I tried it out. Most of my images are on Cloudinary, so I added `https://res.cloudinary.com` under `preConnect`.

## SEO

I hadn’t configured this before and took the opportunity to set it up.

# Installing and writing plugins

The plugins I tried came in two forms. JavaScript plugins came as folders to download; npm plugins installed through the package manager.

## Counting visits and visitors

`hexo-shokax-busuanzi` is an npm plugin, so I installed it with `pnpm add`.

## Showing the site’s age

This JavaScript plugin took two manual steps:

1. Create a `scripts` directory in the Hexo project root and place the JavaScript file inside it.
2. Put the `views` directory at the project root as well.

## Making a Hitokoto footer plugin

My old quote feature required editing `footer.pug`. Once I knew the theme supported plugins, I wanted to try implementing it that way instead.

> PS: I ended up making a combined plugin. Too many separate bits in the footer looked cluttered.
