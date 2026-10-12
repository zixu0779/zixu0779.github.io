---
legacyHtml: true
legacySymbols: 1159
title: Google-Translate-Desktop
date: "2023-05-02T06:46:42.000Z"
updated: "2025-01-21T06:58:19.688Z"
tags:
  - Develop
  - Electron
  - Google Translate
  - node
categories:
  - Develop
  - Electron
description: "项目地址：Google-Translate-Desktop (private repo) 腰斩了，因为我发现已经有很好用的了，推荐：[Pot](Pot | 跨平台划词翻译和 OCR) 因此以下内容仅作一个 idea 记录。 # 准备工作 # 选择环境 node v16.20.0 / electron v20.3.12 # 基本方案 利用 npm 插件: go"
---

<p>项目地址：<a href="https://github.com/noneSycamore/Google-Translate-Desktop">Google-Translate-Desktop</a> (private repo)</p>
<p>腰斩了，因为我发现已经有很好用的了，推荐：[Pot](<a href="https://pot-app.com/">Pot | 跨平台划词翻译和 OCR</a>)</p>
<p>因此以下内容仅作一个 idea 记录。</p>
<hr />
<h1 id="准备工作"><a class="anchor" href="#准备工作">#</a> 准备工作</h1>
<h2 id="选择环境"><a class="anchor" href="#选择环境">#</a> 选择环境</h2>
<p><span class="label info">node v16.20.0</span> / <span class="label info">electron v20.3.12</span></p>
<h2 id="基本方案"><a class="anchor" href="#基本方案">#</a> 基本方案</h2>
<p>利用  <code>npm</code>  插件: <a href="https://www.npmjs.com/package/google-translate-api">google-translate-api</a></p>
<p>该插件提供了一个 API 接口：translate (text, options)，能实现谷歌翻译的基本功能</p>
<p>用 electron 搭建程序的主要页面，用该插件实现简单的翻译</p>
<h2 id="具体功能"><a class="anchor" href="#具体功能">#</a> 具体功能</h2>
<ul class="task-list">
<li class="task-list-item"><input type="checkbox" id="cbx_0" disabled="true" /><label for="cbx_0">  自动检测语言并能选择翻译的目标语言</label></li>
<li class="task-list-item"><input type="checkbox" id="cbx_1" disabled="true" /><label for="cbx_1">  详细释义？</label></li>
<li class="task-list-item"><input type="checkbox" id="cbx_2" disabled="true" /><label for="cbx_2">  划词翻译</label>
<ul class="task-list">
<li class="task-list-item"><input type="checkbox" id="cbx_3" disabled="true" /><label for="cbx_3">  替换、复制翻译结果</label></li>
<li class="task-list-item"><input type="checkbox" id="cbx_4" disabled="true" /><label for="cbx_4">  快捷键呼出</label></li>
</ul>
</li>
</ul>
<h1 id="开发实现"><a class="anchor" href="#开发实现">#</a> 开发实现</h1>
<h2 id="搭建环境"><a class="anchor" href="#搭建环境">#</a> 搭建环境</h2>
<figure class="highlight shell"><figcaption data-lang="Bash"></figcaption><table><tr><td data-num="1"></td><td><pre>nvm <span class="token function">install</span> <span class="token number">16</span> lts  <span class="token comment"># 安装 v15 的新环境</span></pre></td></tr><tr><td data-num="2"></td><td><pre>nvm use <span class="token number">16.20</span>.0</pre></td></tr><tr><td data-num="3"></td><td><pre></pre></td></tr><tr><td data-num="4"></td><td><pre><span class="token function">npm</span> init  <span class="token comment"># 初始化 npm 库</span></pre></td></tr><tr><td data-num="5"></td><td><pre><span class="token function">npm</span> <span class="token function">install</span> electron@20.3.12 --save-dev  <span class="token comment"># 安装 electron</span></pre></td></tr><tr><td data-num="6"></td><td><pre><span class="token function">npm</span> <span class="token function">install</span> electron-builder  <span class="token comment"># 打包插件</span></pre></td></tr><tr><td data-num="7"></td><td><pre><span class="token function">npm</span> <span class="token function">install</span> electron-store  <span class="token comment"># 数据存储插件</span></pre></td></tr></table></figure><h2 id="基本页面"><a class="anchor" href="#基本页面">#</a> 基本页面</h2>
<p>通过 <span class="label info">electron</span> 实现。</p>
<p>细化主页面构成：</p>
<ul class="task-list">
<li class="task-list-item">
<p><input type="checkbox" id="cbx_5" checked="true" disabled="true" /><label for="cbx_5">   +++<strong> 顶部标题栏</strong><br />
传统地去掉难看的原配 Windows 标题栏</label></p>
<ul>
<li>图标</li>
<li>软件名称</li>
<li>最小化 / 最大化 / 关闭<br />
 +++</li>
</ul>
</li>
<li class="task-list-item">
<p><input type="checkbox" id="cbx_6" checked="true" disabled="true" /><label for="cbx_6">  +++ <strong>菜单栏</strong><br />
功能切换</label></p>
<ul>
<li>翻译文本</li>
<li>翻译文件？</li>
<li>翻译网页？</li>
</ul>
<p>设置</p>
<ul>
<li>快捷键<br />
 +++</li>
</ul>
</li>
<li class="task-list-item">
<p><input type="checkbox" id="cbx_7" disabled="true" /><label for="cbx_7">  +++<strong> 具体功能实现页面</strong><br />
翻译功能栏</label></p>
<ul>
<li>选择源语言 / 目标语言</li>
<li>左右切换</li>
</ul>
<p>翻译内容 / 翻译结果<br />
 +++</p>
</li>
</ul>
<h2 id="翻译功能"><a class="anchor" href="#翻译功能">#</a> 翻译功能</h2>
<p>调用 Google 的 API...</p>
