---
title: hexo-shokaX主题更新和配置修改
date: 2025-01-20 12:05:53
tags: [Develop,Hexo,shokaX,博客主题]
categories: 
 - [Develop, shokaX]
cover: https://res.cloudinary.com/sycamore/image/upload/v1682846617/Typera/2023/04/577e6e5d3f3fdf4d5af4e71de5c13847.png
---

Shoka-X 主题做了很多更新，所以趁有空更新一下主题。

因为当初对这个主题自定义的内容不少，所以在这里记录一下主题更新的流程。毕竟最开始的时候，修改了不少这个主题的内容，还是很麻烦的。

为了以后的主题更新着想，能不修改就不修改主题的源文件。

> PS：发现了插件功能 🎉，顺便把页脚的一言功能改一改，交个 issue

# 安装 Shoka-X

主题的改动不少，而且涉及到对主题文件的修改，因此新建一个文件夹，重新安装。

使用 ShokaX 即食罐头：

```sh
git clone https://github.com/theme-shoka-x/shokax-can --depth=1
cd shokax-can
pnpm install
pnpm dlx hexo s
```

这样就安装成功了，本地也能成功运行。

然后 theme 文件夹下创建主题链接：

`ln -s ../node_modules/hexo-theme-shokax shokax`

# 更改主题配置

> PS：音乐播放器好像可以正常运作了，不需要再修改

## 更改 _config.yml

1. Site 描述
2. URL 和 permalink
3. category_map
4. deploy 信息
5. minify 配置，需要再安装 `hexo-lightning-minify`，
   Mac 环境本地运行环境时遇到报错：Error: Cannot find module '@minify-html/node-darwin-arm64'，但问题不大，我用 GitHub Action 部署博客，可以避免
6. algolia 搜索系统

## 复制 theme_config.shokax.yml

源文件来自主题文件夹：`themes/shokax`，直接将 _config.yml 复制到根目录，重命名为 theme_config.shokax.yml。

1. 更改 alternate 站点大标题
2. 更改黑暗模式启动时间
3. 更改 menu，增加开往的链接和图标
4. 开启 waline 评论系统，加入 serverURL，添加 placeholder

## source 文件夹迁移

整个 source 文件夹可以直接覆盖。

## 新增 languages.yml

注意到可以不用通过更改语言文件来修改翻译和配置，在 `source/_data/` 文件夹下新增 languages.yml 文件

各个语言下新增 menu 的 travellings 翻译，配置“开往”项目；

更改网站点击之后和隐藏之后的标题和相关的翻译；

## Iconfont 相关

我使用这个主题的时候，加入 Iconfont 项目是不现实的，因为 shoka 原项目停止更新，所以我对 shokaX 的原文件进行了一定程度的魔改。

但现在我看 shokaX 的项目文档时，发现了Iconfont 项目的邀请链接，所以就不用重新修改了🎉。

加入项目之后，将 shoka 项目中的图标全部添加至自己的项目，然后将 `_config.yml` 中的 iconfont 设置替换为项目的在线链接中的字符串：`//at.alicdn.com/t/c/font_<string>.css`。

往自己的项目中添加完图标后，访问在线链接 `http://at.alicdn.com/t/c/font_<string>.css`，找到要添加的图标：
![image-20250119183816870](https://res.cloudinary.com/sycamore/image/upload/v1737283099/Typora/2025/01/428e3f65a6f441f57d07c85941282c63.png)

复制文件 `themes/shokax/source/css/_iconfont.styl`，到 `source/_data` 文件夹下，在最后加上要添加的图标对应的代码



## 预加载地址设置

这对我来说是个新功能，尝试配置一下看看效果。

我主要使用 Cloudinary 作为图床，因此在 preConnect设置项下增加链接：“https://res.cloudinary.com”

## SEO 优化

之前一直没做过这件事情，趁此机会配置一下

# 安装和制作插件

插件有两种：js 的需要将文件夹下载下来，npm 的只需要用包管理器安装就行。

## 统计网站访问量和访客量

是 npm 插件：hexo-shokax-busuanzi

既然可以用包管理器安装，那用 pnpm add 一下就行

## 插入存活时间

是 js 插件，安装相对复杂：

1. 在 hexo 环境根目录创建 `scripts` 文件夹，把js文件放进去
2. 把 views 文件夹放在 hexo 环境根目录下

## 制作一言页脚插件

因为之前我加入的一言功能需要修改 footer.pug 源文件，既然知道了有插件这个东西，那肯定要尝试制作一下。



> PS：最终还是另做了一个整合的插件，毕竟页脚太多了看起来有点复杂。

