---
legacyHtml: true
legacySymbols: 774
title: 西湖论剑_YUSA的小秘密
date: "2021-11-29T15:02:55.000Z"
updated: "2025-01-21T06:58:19.685Z"
tags:
  - CTF
  - Misc
  - Python
categories:
  - CyberSecurity
  - CTF
cover: >-
  https://res.cloudinary.com/sycamore/image/upload/v1682437178/Typera/2023/04/c5a9db9e102c912faba686513f8d522c.png
description: "# Misc # YUSA 的小秘密 附件下载 题目描述：LSB，但又不是 LSB，众所周知不止 RGB... 直接用 stegsolve 打开有两个通道能直接看到 flag，可是噪点实在太多了. 联想到题目描述，开始查找资料. 可以参考 Bytectf2020 的 Misc: Hardcore Watermark 01 这道题 图片中每个像素可以通过三个通"
---

<h2 id="misc"><a class="anchor" href="#misc">#</a> Misc</h2>
<h3 id="yusa的小秘密"><a class="anchor" href="#yusa的小秘密">#</a> YUSA 的小秘密</h3>
<p><a href="https://cdn.jsdelivr.net/gh/noneSycamore/annex/yusa_small_secret.zip" title="附件下载">附件下载</a><br />
题目描述：LSB，但又不是 LSB，众所周知不止 RGB...<br />
 直接用 stegsolve 打开有两个通道能直接看到 flag，可是噪点实在太多了.<br />
 联想到题目描述，开始查找资料.<br />
 可以参考<a href="https://bytectf.feishu.cn/docs/doccnqzpGCWH1hkDf5ljGdjOJYg#qHRUCR"> Bytectf2020 的 Misc: Hardcore Watermark 01</a> 这道题</p>
<blockquote>
<p>图片中每个像素可以通过三个通道来表示，常见的是 <strong>R</strong> (red) <strong>G</strong> (green) <strong>B</strong> (blue) 模式。而本题用到的通道是 YCrCb。</p>
</blockquote>
<p>通过  <code>cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)</code>  对 img 图片数据进行色彩空间转换，<br />
然后保存图片：</p>
<figure class="highlight python"><figcaption data-lang="python"></figcaption><table><tr><td data-num="1"></td><td><pre><span class="token keyword">from</span> cv2 <span class="token keyword">import</span> cv2</pre></td></tr><tr><td data-num="2"></td><td><pre>img <span class="token operator">=</span> cv2<span class="token punctuation">.</span>imread<span class="token punctuation">(</span><span class="token string">'Yusa.png'</span><span class="token punctuation">)</span></pre></td></tr><tr><td data-num="3"></td><td><pre>cv_color <span class="token operator">=</span> cv2<span class="token punctuation">.</span>cvtColor<span class="token punctuation">(</span>img<span class="token punctuation">,</span> cv2<span class="token punctuation">.</span>COLOR_BGR2YCrCb<span class="token punctuation">)</span></pre></td></tr><tr><td data-num="4"></td><td><pre>cv2<span class="token punctuation">.</span>imwrite<span class="token punctuation">(</span><span class="token string">'img.png'</span><span class="token punctuation">,</span> cv_color<span class="token punctuation">)</span></pre></td></tr></table></figure><p>再用 stegsolve 看一下通道就可以了<br />
<img loading="lazy" src="https://res.cloudinary.com/sycamore/image/upload/v1682436506/Typera/2023/04/0c489cb73329a1ef49146321f8fde3bd.png" alt="image-20230425232822379" /></p>
