---
legacyHtml: true
legacySymbols: 2210
title: Sentences-Desktop桌面程序开发
date: "2023-04-30T09:35:33.000Z"
updated: "2026-10-11T08:09:15.697Z"
tags:
  - Develop
  - Electron
  - Hitokoto
  - node
categories:
  - Develop
  - Electron
description: "项目地址：Sentences-Desktop 算是一个已完成的个人项目，虽然依旧不是很满意，而且我本人也没有在使用， 但效果看起来还是很不错的，使用了 Hitokoto，具体在上述链接中，有空会更新以下开发中遇到的事情。 # 项目做了什么 Sentences-Desktop 是一个放在 Windows 桌面上的句子小窗口，默认通过 Hitokoto 获取一言"
---

<p>项目地址：<a href="https://github.com/noneSycamore/Sentences-Desktop">Sentences-Desktop</a></p>
<p>算是一个已完成的个人项目，虽然依旧不是很满意，而且我本人也没有在使用，</p>
<p>但效果看起来还是很不错的，使用了 Hitokoto，具体在上述链接中，有空会更新以下开发中遇到的事情。</p>
<h1 id="项目做了什么"><a class="anchor" href="#项目做了什么">#</a> 项目做了什么</h1>
<p>Sentences-Desktop 是一个放在 Windows 桌面上的句子小窗口，默认通过 Hitokoto 获取一言。没有使用 Vue，界面就是 HTML、CSS 和 JavaScript，再用 Electron 提供桌面窗口和设置功能。</p>
<p>窗口显示标题、正文和出处，可以手动切换下一句。设置页可以调整透明度、圆角、三部分文字的大小，以及是否记录窗口位置和尺寸，还提供了托盘、开机启动和自定义接口选项。</p>
<p>下面是根据项目现存代码补充的实现记录，对应仓库的  <code>321c85a</code>  版本。这次只阅读代码，没有重新运行旧版 Windows 程序。</p>
<h1 id="窗口与界面"><a class="anchor" href="#窗口与界面">#</a> 窗口与界面</h1>
<p>代码主要分为三部分：</p>
<ul>
<li><code>main.js</code> ：创建主窗口和设置窗口，处理托盘、右键菜单及窗口操作。</li>
<li><code>src/js/index.js</code> ：请求句子、更新正文和出处，并将界面高度传回主进程。</li>
<li><code>src/js/setting.js</code> ：读取设置，处理滑动条和开关，再通过 IPC 通知主进程。</li>
</ul>
<p>主窗口使用了无边框、透明背景和隐藏任务栏入口的配置，再调用  <code>electron-addtodesktop</code>  的  <code>attach(mainWindow)</code>  将窗口附到桌面。这里不只是把网页背景设成透明，桌面窗口本身也需要对应的配置。</p>
<p>设置窗口则单独载入  <code>src/setting.html</code> 。如果它已经存在，就显示已有窗口；关闭时将引用清空，下次再创建。另外程序使用单实例锁，重复启动时会聚焦现有主窗口。</p>
<h1 id="从接口取得一句话"><a class="anchor" href="#从接口取得一句话">#</a> 从接口取得一句话</h1>
<p>获取句子的入口是  <code>fetchHitokoto()</code> 。它先读取右键菜单保存的分类选择，把启用的分类拼成  <code>c=分类</code>  的查询参数；多个分类之间用  <code>&amp;</code>  连接，没有选择时就不追加查询字符串。</p>
<p>默认地址是  <code>https://v1.hitokoto.cn/$&#123;Types&#125;</code> 。收到 JSON 后，正文取  <code>data.hitokoto</code> ，出处取  <code>data.from</code> ；如果存在  <code>data.from_who</code> ，就把作者用中心圆点接在出处后面。</p>
<p>更新文字之后，界面会发送  <code>change-H</code>  消息，把内容区域的高度加上少量边距交给主进程，再调整窗口高度。因此正文长短变化时，不需要一直保留一个固定高度的空框。</p>
<p>成功获取的正文和出处会存入  <code>LastData</code> 。下次打开时先显示上一次保存的内容，再请求新句子。如果请求失败，代码会把文字颜色改成红色，不会先清空已有句子。不过这里没有详细错误提示，也没有自动重试，反馈还是比较简单。</p>
<h1 id="设置如何保存和生效"><a class="anchor" href="#设置如何保存和生效">#</a> 设置如何保存和生效</h1>
<p>配置使用  <code>electron-store</code>  保存。主程序准备了  <code>Preferences</code>  默认值，实际设置按  <code>Appearance</code> 、 <code>Other</code> 、 <code>RightClick</code>  和  <code>LastData</code>  分组。初始化时检查字段是否存在，缺少时再从默认值补入。</p>
<p>透明度、圆角和字号的滑动条会保存数值，并发送对应的 IPC 消息。主进程处理后，通过  <code>webContents.executeJavaScript</code>  修改主窗口中对应元素的样式，不需要重新载入整个页面。字号调整还会配合高度消息，重新计算窗口需要的空间。</p>
<p>设置页启用位置和尺寸记录时，会监听窗口的  <code>resize</code> 、 <code>move</code>  事件并显示当前数值。退出前， <code>ifSaveXYWH()</code>  根据开关决定保存当前窗口位置和尺寸，或者恢复默认值，下次创建窗口时再读取。</p>
<p>这个实现很直接，但主进程里拼接界面脚本，也让界面细节和窗口管理耦合在了一起。如果继续维护，可以改成主进程发送明确的设置数据，由界面自己更新样式。</p>
<h1 id="自定义接口"><a class="anchor" href="#自定义接口">#</a> 自定义接口</h1>
<p>项目后来还加入了自定义接口功能：除了请求地址，也允许填写一段 JavaScript，告诉程序如何从返回数据中取得正文和出处。不同接口的字段结构不同，这种方式可以直接适配，不必每增加一个接口就修改程序。</p>
<p>但现有代码通过  <code>eval</code>  执行地址表达式和这段解析代码，而窗口又开启了 Node 集成。这适合当时自己折腾，却不适合作为供任意用户填写脚本的通用方案。如果重新做，我会改成受限制的字段映射，并把桌面能力收回主进程，通过明确的接口调用。</p>
<h1 id="打包与后续"><a class="anchor" href="#打包与后续">#</a> 打包与后续</h1>
<p><code>package.json</code>  使用 Electron 12 和 electron-builder，Windows 打包配置包含 x64、ia32 和 NSIS 安装程序，可以选择安装目录。虽然也写了 macOS、Linux 的打包命令，但 README 明确标注了 Windows，我没有验证其他平台，不能据此说它已经支持跨平台。</p>
<p>这个项目的主体功能已经有了，依旧算不上让我满意的日常工具。现在回看，值得保留的是桌面窗口、接口获取和设置保存这条完整流程；如果后续重做，会优先整理设置更新方式、自定义接口和进程之间的边界，而不是继续堆更多外观选项。</p>
