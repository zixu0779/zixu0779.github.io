---
title: 希里的 CP2077 主菜单背景
date: 2024-11-05 22:56:23
tags: [Develop,Mod,CP2077,game archive]
categories: 
 - [Mod Develop, Cyberpunk 2077]
cover: https://res.cloudinary.com/sycamore/image/upload/v1730822508/Typera/2024/11/3d3d0f08411e144047e5d8272d659746.png
---

我试图在 2.0+ 版本中修复 mod: [Ciri in Night City - Main Menu Background Replacer](https://www.nexusmods.com/cyberpunk2077/mods/2541)，添加对往日之影 Logo 的支持。

Update 1.1.0：v1.0.0 中，载入游戏时的动画消失了，我将其修复，但最后一个动画也会变成被更改的主菜单背景

>   **写在前面**：加载动画丢失的问题，归根到底是因为这个原 Mod 对背景的修改手段太粗暴了，而往日之影 Logo 缺失，则是因为这个 Mod 过期了。
>
>   如果想修复丢失的加载动画，直接跳到 “找回丢失的加载动画” 阅读就行。
>   这一节将从头开始构建这个 Mod。

---

原 Mod 启动效果图，可以看到没有往日之影的 logo：

![image-20241106010540801](https://res.cloudinary.com/sycamore/image/upload/v1730815548/Typera/2024/11/c42fe5caab097e56ca6115aa25028bde.png)

---

# Logo 的修改方法

**修改工具**：WolvenKit

## 往日之影 Logo 补充

打开 Mod Browser，找到安装好的原 Mod

![image-20241108034829519](https://res.cloudinary.com/sycamore/image/upload/v1730998112/Typera/2024/11/5d8a49a1184590d333259cd53e8847dd.png)

选择 base 文件夹，然后鼠标右键 Add selected items to project

左侧 Project Explorer 中找到 menu_background.xbm 和  menu_background_1080p.xbm，这是出问题的文件，直接删掉就行，如下：

![image-20241108034923672](https://res.cloudinary.com/sycamore/image/upload/v1730998166/Typera/2024/11/f508d2dcb910791026ac4f0cf9bfa3e5.png)

## 最后的工作：打包

Buid -> Pack Project，会在项目文件夹下打包为 zip 压缩包，这就是修复好的 Mod，安装到 CP2077，并卸载掉原 Mod。

效果如下，成功补上往日之影的 Logo：

![image-20241106030106133](https://res.cloudinary.com/sycamore/image/upload/v1730822474/Typera/2024/11/fbc6ffdfb07adb1f77abc0edd380520e.png)

# 分析原 Mod

最好先阅读：[archive 内容解析](https://sycamore.top/Mod-Develop/Cyberpunk-2077/archive%E5%86%85%E5%AE%B9%E8%A7%A3%E6%9E%90)

我的分析过程其实绕了很大的弯子，有兴趣可以看一下。

## 定位背景图片的位置

原 Mod 修改的文件还是有很多的，为了找到正确的思路，我选择先定位被修改的背景图片。

---

根据游戏主线进度不同，赛博朋克的主菜单背景会更换图片。

寻找后，我发现对应的目录：`base\gameplay\gui\world\loading_screens\`

该目录下所谓 loading_screen_5_after_q101、loading_screen_10_after_q112，应该对应了主线中某些事件的发生，比如图片 loading_screen_10_after_q112\loading_screen_10_shot_01.xbm：

![image-20241106002108908](https://res.cloudinary.com/sycamore/image/upload/v1730812872/Typera/2024/11/3609b16ee976bb030b37db1649a51d31.png)

这显然是在潜入山车安装病毒之后会出现的那个背景图。

再比如图片 loading_screen_5_after_q101\loading_screen_5_shot_01.xbm：

![image-20241105232833312](https://res.cloudinary.com/sycamore/image/upload/v1730809719/Typera/2024/11/ffbe63923183b7d8602c1046d1bc2b84.png)

这对应目前我的主菜单图片：

![image-20241105233029146](https://res.cloudinary.com/sycamore/image/upload/v1730809840/Typera/2024/11/a4e7e61df94dc872b29a72dd4b9fe6ba.png)

## 进一步分析 inkwidget

如果我要更换这个主菜单的背景图片，应该需要更改对应的 inkwidget 中的内容。

原 mod 虽然不能显示往日之影的 logo，但是背景替换功能还是正常的，因此可以做一定的参考。

着重分析：loading_screen_5_after_q101.inkwidget，因为这对应目前我主菜单的背景图片，方便我进行分析。这里面应该包括构成当前主菜单界面的资源。

左：原文件；右：原 Mod 中修改后的文件

![image-20241106002427225](https://res.cloudinary.com/sycamore/image/upload/v1730813070/Typera/2024/11/a23b9f1dc9b8ff26b6639b55bb702376.png)

先看右侧的原 Mod 文件，主要是文件 cp_bq_alphafaded.bk2，这就是被替换的希里背景动画。

然后看左侧的游戏原文件，因为目前我的主菜单背景是 short01 的图片，所以不看 short02、short03 的内容：

**smoke_loop.bk2**：一个冒烟的动画视频

**shot_01_assets.inkatlas**：对文件 short_01_assets.xbm 进行了分割，提取出图片后面的三个光柱（ad）以及闪烁的灯光（antenna_lights）

![image-20241106004409120](https://res.cloudinary.com/sycamore/image/upload/v1730814251/Typera/2024/11/28b987b84f447477c8c464cf7621f2cc.png)

short_01_assets.xbm 如下，应该能理解我的意思：

![image-20241106004850267](https://res.cloudinary.com/sycamore/image/upload/v1730814533/Typera/2024/11/01b0e79632d94fc3339833106b191ccf.png)

**loading_screen_5_shot_01.inkatlas**：对应为主体背景，因为分割的那 4 个参数 Bottom、Left...，分别设置为了 0 和 1，也就是顶格分割，取了图片整体。

如下是对主页面要素的标注，①对应 smoke_loop.bk2，②对应shot_01_assets.inkatlas：

![image-20241106005529451](https://res.cloudinary.com/sycamore/image/upload/v1730814934/Typera/2024/11/48590ddd97bd03ba9d708ed367fa1ef8.png)

因此，如果只是要更换当前的背景图片，把 loading_screen_5_shot_01.xbm 换掉就行。

## 原 Mod 思路分析

上一节说换 loading_screen_5_shot_01.xbm，其实是不够的。

先说第一个原因：背景图片是会跟着主线剧情切换的。

仔细对比可以发现，Mod 中更改的 loading_screen_5_after_q101.inkwidget，其内容和游戏原文件： base\gameplay\gui\world\loading_screens\initial_loading_screen\initial_loading_screen.inkwidget 完全一致。

左：Mod 中的文件；右：initial_loading_screen.inkwidget

![image-20241106022045941](https://res.cloudinary.com/sycamore/image/upload/v1730820048/Typera/2024/11/99b267900fa56628ce107626801cda75.png)

而我们知道，initial_loading_screen.inkwidget 中的 cp_bq_alphafaded.bk2，已经被替换为希里的背景动画了。

因此 loading_screen_5_after_q101 对应的背景就会被替换为希里。

再看原 Mod，每一个对应文件夹下的 inkwidget，其内容都被改成了 initial_loading_screen.inkwidget

所以说原 Mod 的思路很绝：既然背景图片会换，那就把它们都改了！

## 往日之影 Logo 修复点分析

上面分析了这么多其实对修复往日之影的 Logo 完全没用，因为在游戏原文件 loading_screen_5_after_q101.inkwidget 中，我并没有找到 Logo 的部分，上述内容都是原 Mod 更改背景图片的思路。

但是把已经分析出作用的文件去掉，原 Mod 的结构就简单多了。

---

我马上就发现了：base\gameplay\gui\fullscreen\main_menu\menu_background.xbm，以及 menu_background_1080p.xbm

左：原 Mod 中的 menu_background.xbm；右：游戏原目录中的 menu_background.xbm

![image-20241106024128469](https://res.cloudinary.com/sycamore/image/upload/v1730821292/Typera/2024/11/e99ca6d089324954b2dfb1f94b502241.png)

少了什么一目了然，就是往日之影的 Logo。

正确的文件游戏里已经有了，现在加载不出来是因为原 Mod 中的文件覆盖了游戏的默认文件。

因此如果要修复这个 Logo，只要把 Mod 里这两张图片删了就行。

# Update：修复丢失的加载动画

先说说修复完 Logo 之后我发现的这个新问题：

从主菜单载入游戏存档时，一般会播放一个小剧场，和主菜单背景一样，会跟随剧情变化而变化。而问题就是，这个小剧场没了，加载过程全黑。

这个小剧场其实由三段动画构成。先看看这三段动画的例子：

动画一：

![PixPin_2024-11-08_12-59-19](https://res.cloudinary.com/sycamore/image/upload/v1731031192/Typera/2024/11/d2aaf1434e40937c6fd9f92d2131d7fc.png)

动画二：

![PixPin_2024-11-08_14-18-10](https://res.cloudinary.com/sycamore/image/upload/v1731035938/Typera/2024/11/fe3589af6f3db84af35d50c00c442090.png)

动画三：

![PixPin_2024-11-08_14-18-28](https://res.cloudinary.com/sycamore/image/upload/v1731035935/Typera/2024/11/96c0c166085ec678bf9a94549e0ab157.png)

## 加载动画丢失原因分析

之所以加载动画会丢失，究其原因是原 Mod 直接将每一个对应文件夹（loading_screen_5_after_q101）下的 inkwidget，都替换成了 initial_loading_screen.inkwidget。

这显然会导致很多问题，loading_screen_5_after_q101.inkwidget 是和加载动画相关的关键文件（具体参考 [archive 内容解析 #inkwidget](https://sycamore.top/Mod-Develop/Cyberpunk-2077/archive%E5%86%85%E5%AE%B9%E8%A7%A3%E6%9E%90/#inkwidget)）。

从下面那张对比图可以看出，loading_screen_5_after_q101.inkwidget 下对应的三个加载动画资源，ls_01，ls_02，ls_03 在 initial_loading_screen.inkwidget 中都没有了，只剩下 main_menu 和 loading_screen。

![image-20241108132025115](https://res.cloudinary.com/sycamore/image/upload/v1731032428/Typera/2024/11/dfc871c9dcc12b9cadeb7ca35624c9e3.png)

而 main_menu 对应 cp_bq_alphafaded.bk2 资源，也就是替换的希里的背景，loading_screen 则是对应另一个进入主菜单时的动画资源。

因此，游戏找不到 ls_01，ls_02，ls_03，也就丢失了加载动画

## 加载动画修复方法

因为上述原因，只能从头构建这个 Mod。

首先创建一个新项目，和修复 Logo 时差不多，在 Asset Browser 中找到原 Mod 的 cp_bg_alpha_faded.bk2，也就是希里背景，加入到项目中。

然后找到游戏中的 loading_screen_5_after_q101.inkwidget 和 initial_loading_screen.inkwidget，将前者加入项目，并打开编辑，后者选择 Open without adding to project 即可。

复制 initial_loading_screen.inkwidget 中的 cp_bq_alphafaded.bk2 资源，然后加入 loading_screen_5_after_q101.inkwidget 的 externalDependenciesForInternalItems 中：

![image-20241108135807669](https://res.cloudinary.com/sycamore/image/upload/v1731034691/Typera/2024/11/a07fb28527c04bf0d6a1fac487d0e1ea.png)

然后进入 ls_01 的 children，删除里面的 1-6 项，这些都是组成原主菜单背景的资源。至于第 0 项 fade_to_black，应该是衔接动画，不能删除，否则会导致主菜单背景动画播放卡顿。

![image-20241108140203924](https://res.cloudinary.com/sycamore/image/upload/v1731034927/Typera/2024/11/f443d45ef51c334045498bbea418f1d1.png)

然后复制 initial_loading_screen.inkwidget 中 main_menu -> children 中的 cp_bg_alpha，这对应希里的背景动画资源，因为对应文件已经做出替换。

![image-20241108140408349](https://res.cloudinary.com/sycamore/image/upload/v1731035051/Typera/2024/11/bc72ba01656cc7c37368d1101c3c08b9.png)

粘贴到 loading_screen_5_after_q101.inkwidget 之前删除其他资源的位置即可：

![image-20241108141218516](https://res.cloudinary.com/sycamore/image/upload/v1731035542/Typera/2024/11/6da47409fffe611ec5d5bc039388b64a.png)

同样的操作，对 loading_screens 中 其他文件夹下的 .inkwidget 都做一遍，就全都能替换掉了。

---

**唯一的问题**：

ls_01 对应主菜单背景动画和加载动画三，ls_02 对应加载动画一，ls_03 对应加载动画二。

因此我为了替换主菜单背景动画，修改了 ls_01，加载动画三不可避免的也会变成希里的背景。暂时没有找到解决方法。
