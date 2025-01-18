---
title: archive 内容解析
date: 2024-11-05 22:56:23
tags: [Develop,Mod,CP2077,game archive]
categories: 
 - [Mod Develop, Cyberpunk 2077]
cover: 
---

本文内容会有些许凌乱，因为是 Mod 开发过程中，我对 archive 的一些文件代表的内容的想法。

而且本人没有接触过 3D 动画、游戏制作这方面的内容，描述会存在很多不专业的地方。

---

# 文件类型和作用

## xbm

这是一种图片类型的文件，对应游戏中出现的一些贴图的资源。

通过 WolvenKit 可以查看图片的内容，比如 expansion_logo.xbm，如下所示：

![image-20241105231302174](https://res.cloudinary.com/sycamore/image/upload/v1730808788/Typera/2024/11/2c0934a8e3cdb50eaedad5bc5a2c17f0.png)

## inkatlas

这是某种代表了对 xbm 图片进行具体 ”分割“ 利用的文件。

比如 expansion_logo.xbm 对应的 expansion_logo.inkatlas，内容如下：

![image-20241105231444965](https://res.cloudinary.com/sycamore/image/upload/v1730808890/Typera/2024/11/90a3c1b209806070d39ecdf04f3cd021.png)

再次展开这个 3：logo，并和 4：logo_EN 的数据进行对比，如下：

![image-20241105231603201](https://res.cloudinary.com/sycamore/image/upload/v1730808968/Typera/2024/11/4c4d7b17e1126d72bd67023217ae420f.png)

可以看到，其中包括的 Bottom、Left、Right、Top，对应的应该是 xbm 图片中 ”被分割“ 出来的具体图片的位置数据，这些数据被框定在 0~1 中。

以下是我根据这些数据判断他们所对应图片的思路：

3：logo 的 Bottom 和 4：logo_EN 的 Top 数值接近，几乎可以认为其就是上下相邻的两个图形。
他们的 Bottom 和 Top 数值接近于 1，因此应当位于 xbm 图片的下侧。
他们的 Left 数值相等且接近于 0，因此应当位于 xbm 图片的最左侧。

所以，3：logo 和 4：logo_EN 应当分别对应 xbm 图片左下方的两个英文 logo: PHANTOM LIBERTY

## inkwidget

这个文件应该是说明了，组成某些动画需要用到的资源。

以 loading_screen_5_after_q101.inkwidget 为例，该文件应该对应某个从主菜单载入游戏时的小剧场，该小剧场通常由三个动画组成。

如下图所示，externalDependenciesForInternalItems 下存放的就是要用到的内部资源。libraryItems 下的就是组成动画的一些信息，ls_01，ls_02，ls_03 对应三个加载动画。

![image-20241108132929030](https://res.cloudinary.com/sycamore/image/upload/v1731032972/Typera/2024/11/ed815477f0502d01327d6c8fd694ca6a.png)

展开 ls_01，以此为例说明这个 node 中的信息。

关键内容在 如下图所示的 children 中，可以看到一共有 7 项，从其名称中应该可以发现一些端倪。

![image-20241108133234564](https://res.cloudinary.com/sycamore/image/upload/v1731033157/Typera/2024/11/fb1bf0564b6749bc6c8d22e2dcad17f2.png)

比如 shot_01_bg 对应这段动画的背景，antena_light_1 对应一个闪烁的信号灯。它们具体代表的资源，可以进一步展开这些项目获得。

以 ls_02 中的 BINK_RTW 为例，展开后可以看到对应的 videoResouce 文件。

![image-20241108134111623](https://res.cloudinary.com/sycamore/image/upload/v1731033675/Typera/2024/11/9357c4afea9961b5a46f861d1ddf4906.png)

如果想知道它对应什么，就将这个 videoResource Add to Project，然后用 rad video 播放，其内容为：

![image-20241108134412959](https://res.cloudinary.com/sycamore/image/upload/v1731033856/Typera/2024/11/7ecc5753dbb2a7e5f44a2e08d451b207.png)

相信你还记得那个 齐格 · Q 和 NCPD 发言人。



---

# 目录对应的功能

## `base\gameplay\gui\world\loading_screens\`

根据游戏主线进度不同，赛博朋克的主菜单背景会更换图片；加载存档时，会出现多张图片轮换播放。

比如图片：loading_screen_5_after_q101\loading_screen_5_shot_01.xbm

![image-20241105232833312](https://res.cloudinary.com/sycamore/image/upload/v1730809719/Typera/2024/11/ffbe63923183b7d8602c1046d1bc2b84.png)

可以在主菜单看到同样的图片：

![image-20241105233029146](https://res.cloudinary.com/sycamore/image/upload/v1730809840/Typera/2024/11/a4e7e61df94dc872b29a72dd4b9fe6ba.png)

因此，如果我要更换这个主菜单的背景图片，需要更改对应的 inkwidget 中的内容。

（后续分析：[希里的 CP2077 主菜单背景](https://sycamore.top/Mod Develop/Cyberpunk 2077/Ciri Main Menu Background/)）
