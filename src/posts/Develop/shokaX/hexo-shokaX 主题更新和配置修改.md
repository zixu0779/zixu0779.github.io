---
legacyHtml: true
legacySymbols: 2206
title: hexo-shokaX主题更新和配置修改
date: "2025-01-20T04:05:53.000Z"
updated: "2025-01-21T06:58:19.689Z"
tags:
  - Develop
  - Hexo
  - shokaX
  - 博客主题
categories:
  - Develop
  - shokaX
cover: >-
  https://res.cloudinary.com/sycamore/image/upload/v1682846617/Typera/2023/04/577e6e5d3f3fdf4d5af4e71de5c13847.png
description: "Shoka-X 主题做了很多更新，所以趁有空更新一下主题。 因为当初对这个主题自定义的内容不少，所以在这里记录一下主题更新的流程。毕竟最开始的时候，修改了不少这个主题的内容，还是很麻烦的。 为了以后的主题更新着想，能不修改就不修改主题的源文件。 PS：发现了插件功能 🎉，顺便把页脚的一言功能改一改，交个 issue # 安装 Shoka-X 主题的改动不少，"
---

<p>Shoka-X 主题做了很多更新，所以趁有空更新一下主题。</p>
<p>因为当初对这个主题自定义的内容不少，所以在这里记录一下主题更新的流程。毕竟最开始的时候，修改了不少这个主题的内容，还是很麻烦的。</p>
<p>为了以后的主题更新着想，能不修改就不修改主题的源文件。</p>
<blockquote>
<p>PS：发现了插件功能 🎉，顺便把页脚的一言功能改一改，交个 issue</p>
</blockquote>
<h1 id="安装-shoka-x"><a class="anchor" href="#安装-shoka-x">#</a> 安装 Shoka-X</h1>
<p>主题的改动不少，而且涉及到对主题文件的修改，因此新建一个文件夹，重新安装。</p>
<p>使用 ShokaX 即食罐头：</p>
<figure class="highlight sh"><figcaption data-lang="sh"></figcaption><table><tr><td data-num="1"></td><td><pre><span class="token function">git</span> clone https://github.com/theme-shoka-x/shokax-can <span class="token parameter variable">--depth</span><span class="token operator">=</span><span class="token number">1</span></pre></td></tr><tr><td data-num="2"></td><td><pre><span class="token builtin class-name">cd</span> shokax-can</pre></td></tr><tr><td data-num="3"></td><td><pre><span class="token function">pnpm</span> <span class="token function">install</span></pre></td></tr><tr><td data-num="4"></td><td><pre><span class="token function">pnpm</span> dlx hexo s</pre></td></tr></table></figure><p>这样就安装成功了，本地也能成功运行。</p>
<p>然后 theme 文件夹下创建主题链接：</p>
<p><code>ln -s ../node_modules/hexo-theme-shokax shokax</code></p>
<h1 id="更改主题配置"><a class="anchor" href="#更改主题配置">#</a> 更改主题配置</h1>
<blockquote>
<p>PS：音乐播放器好像可以正常运作了，不需要再修改</p>
</blockquote>
<h2 id="更改-_configyml"><a class="anchor" href="#更改-_configyml">#</a> 更改 _config.yml</h2>
<ol>
<li>Site 描述</li>
<li>URL 和 permalink</li>
<li>category_map</li>
<li>deploy 信息</li>
<li>minify 配置，需要再安装  <code>hexo-lightning-minify</code> ，<br />
Mac 环境本地运行环境时遇到报错：Error: Cannot find module '@minify-html/node-darwin-arm64'，但问题不大，我用 GitHub Action 部署博客，可以避免</li>
<li>algolia 搜索系统</li>
</ol>
<h2 id="复制-theme_configshokaxyml"><a class="anchor" href="#复制-theme_configshokaxyml">#</a> 复制 theme_config.shokax.yml</h2>
<p>源文件来自主题文件夹： <code>themes/shokax</code> ，直接将 _config.yml 复制到根目录，重命名为 theme_config.shokax.yml。</p>
<ol>
<li>更改 alternate 站点大标题</li>
<li>更改黑暗模式启动时间</li>
<li>更改 menu，增加开往的链接和图标</li>
<li>开启 waline 评论系统，加入 serverURL，添加 placeholder</li>
</ol>
<h2 id="source-文件夹迁移"><a class="anchor" href="#source-文件夹迁移">#</a> source 文件夹迁移</h2>
<p>整个 source 文件夹可以直接覆盖。</p>
<h2 id="新增-languagesyml"><a class="anchor" href="#新增-languagesyml">#</a> 新增 languages.yml</h2>
<p>注意到可以不用通过更改语言文件来修改翻译和配置，在  <code>source/_data/</code>  文件夹下新增 languages.yml 文件</p>
<p>各个语言下新增 menu 的 travellings 翻译，配置 “开往” 项目；</p>
<p>更改网站点击之后和隐藏之后的标题和相关的翻译；</p>
<h2 id="iconfont-相关"><a class="anchor" href="#iconfont-相关">#</a> Iconfont 相关</h2>
<p>我使用这个主题的时候，加入 Iconfont 项目是不现实的，因为 shoka 原项目停止更新，所以我对 shokaX 的原文件进行了一定程度的魔改。</p>
<p>但现在我看 shokaX 的项目文档时，发现了 Iconfont 项目的邀请链接，所以就不用重新修改了🎉。</p>
<p>加入项目之后，将 shoka 项目中的图标全部添加至自己的项目，然后将  <code>_config.yml</code>  中的 iconfont 设置替换为项目的在线链接中的字符串： <code>//at.alicdn.com/t/c/font_&lt;string&gt;.css</code> 。</p>
<p>往自己的项目中添加完图标后，访问在线链接  <code>http://at.alicdn.com/t/c/font_&lt;string&gt;.css</code> ，找到要添加的图标：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1737283099/Typora/2025/01/428e3f65a6f441f57d07c85941282c63.png" alt="image-20250119183816870" /></p>
<p>复制文件  <code>themes/shokax/source/css/_iconfont.styl</code> ，到  <code>source/_data</code>  文件夹下，在最后加上要添加的图标对应的代码</p>
<h2 id="预加载地址设置"><a class="anchor" href="#预加载地址设置">#</a> 预加载地址设置</h2>
<p>这对我来说是个新功能，尝试配置一下看看效果。</p>
<p>我主要使用 Cloudinary 作为图床，因此在 preConnect 设置项下增加链接：“<a href="https://res.cloudinary.com">https://res.cloudinary.com</a>”</p>
<h2 id="seo-优化"><a class="anchor" href="#seo-优化">#</a> SEO 优化</h2>
<p>之前一直没做过这件事情，趁此机会配置一下</p>
<h1 id="安装和制作插件"><a class="anchor" href="#安装和制作插件">#</a> 安装和制作插件</h1>
<p>插件有两种：js 的需要将文件夹下载下来，npm 的只需要用包管理器安装就行。</p>
<h2 id="统计网站访问量和访客量"><a class="anchor" href="#统计网站访问量和访客量">#</a> 统计网站访问量和访客量</h2>
<p>是 npm 插件：hexo-shokax-busuanzi</p>
<p>既然可以用包管理器安装，那用 pnpm add 一下就行</p>
<h2 id="插入存活时间"><a class="anchor" href="#插入存活时间">#</a> 插入存活时间</h2>
<p>是 js 插件，安装相对复杂：</p>
<ol>
<li>在 hexo 环境根目录创建  <code>scripts</code>  文件夹，把 js 文件放进去</li>
<li>把 views 文件夹放在 hexo 环境根目录下</li>
</ol>
<h2 id="制作一言页脚插件"><a class="anchor" href="#制作一言页脚插件">#</a> 制作一言页脚插件</h2>
<p>因为之前我加入的一言功能需要修改 footer.pug 源文件，既然知道了有插件这个东西，那肯定要尝试制作一下。</p>
<blockquote>
<p>PS：最终还是另做了一个整合的插件，毕竟页脚太多了看起来有点复杂。</p>
</blockquote>
