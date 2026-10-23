---
title: EasyBe 主题修改记录
date: 2023-01-15 00:08:40
updated: 2026-08-16 18:32:20
tags: ["Typecho", "EasyBe", "主题定制"]
categories: [["博客搭建", "主题修改"]]
cover: https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/a766ea43fafdaf2231d9b0686c1a16a6.png
---
安装了 Typecho 之后，我尝试了 EasyBe 主题，又改了些配置。

<!-- more -->

:::info
本文记录的是 2022 年使用 EasyBe 的过程，配置以文中引用的当时仓库的[历史提交版本](https://github.com/wangyang0210/EasyBe/tree/80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd)为准。该仓库现在已经更新换代，配置结构和第三方服务可能已经变化，不要将下面的代码直接套到新版主题中。
:::


## EasyBe主题安装

Typecho 的安装过程见[《Typecho 安装与配置》](/博客搭建/建站部署/Typecho%20安装与配置/)。

从 [EasyBe 仓库](https://github.com/wangyang0210/EasyBe)下载对应版本的主题压缩包，用宝塔上传到 Typecho 安装目录下的 `usr/themes/`，再解压。确认主题文件放在同一个文件夹中，没有多套一层目录，然后在“控制台 → 外观”中启用主题。
## EasyBe主题配置

### 吐点槽

我直接启用主题后，打开首页竟然是空白的。（估计是当时该主题还处于早期开发阶段，还不够完善）

之前尝试的几个 Typecho 主题，启用后都有一个基础的页面，所以这次直接给我看懵了。后来才想到，可能还要在“设置外观”里补上配置 (￣_￣|||)

参考当时作者在仓库里的说明并补全配置后，页面终于正常显示了。虽然开头折腾了一下，效果还是挺满意的。
![如图是侧边栏展开的首页封面图](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/785874ea60c0b6e6be9cdde24faa5826.jpg "如图是菜单栏展开的首页封面图")
![如图是页脚的画面，挺精美的](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/7cfa5360d7b0fbbd1484efcf487e7624.jpg "如图是页脚的画面，挺精美的")

### 具体配置
#### 头像、昵称、职业与居住地

在“设置外观”中填写自己的信息，保存后会显示在侧边栏顶部。
#### **CNZZ统计**
CNZZ 用来统计站点访问情况，不需要统计的话可以留空。主题提供了统计代码输入框，原来的显示位置在页脚友情链接下方。

这项服务后来有过调整。根据[友盟官方公告](https://info.umeng.com/detail?cateId=1&id=562)，U-Web 已于 2022 年 5 月 10 日停止提供免费的网站统计服务。这里保留主题配置项的说明，不需要统计可以直接跳过；仍要使用的话，先确认当前服务是否适合自己，再从后台获取代码。
#### **备案信息**

这里填写的是已经取得的备案信息。ICP 备案和公安联网备案不是同一项，备案号和查询链接要分别对应。

ICP 备案号可以链接到[工信部备案管理系统](https://beian.miit.gov.cn/)，示例如下，记得替换成自己的完整备案号：

```html
<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">你的 ICP 备案号</a>
```

公安联网备案则使用[全国互联网安全管理服务平台](https://beian.mps.gov.cn/)提供的备案展示代码，填入自己的备案号和查询链接。公安备案链接不能拿来填写 ICP 备案号，单纯添加这段展示代码也不等于完成了备案。

#### **全局配置**
我这次首页空白的问题，是补全这里的配置后解决的。头像、封面、动效等设置都集中在全局配置中，可以改的地方很多，挺不错的。

> 原配置中的一组图片链接已经失效。下面改用此历史版本自带的背景图和头像进行展示；实际使用时换成自己的图片。

下面是以主题原配置为基础整理的完整示例，其中 Loading 仍使用默认的三角形动画；我修改后的六边形配置放在后面的 Loading 小节。填入“设置外观”的全局配置输入框后保存。昵称、建站日期、头像和友链要换成自己的信息。

```html
<!-- global var -->
<script type="text/javascript">

    //博客全局配置
    window.cnblogsConfig = {

        // ---- GitHub文件源配置 ----
        GhUserName: 'wangyang0210', 
        GhRepositories: 'EasyBe', 
        GhVersions : '80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd', 

        // ---- 基础信息配置 ----custom
        blogUser      : "。思索",
        blogAvatar    : 
        "https://cdn.jsdelivr.net/gh/wangyang0210/EasyBe@80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd/static/imgs/home_top_bg.jpg",
        blogStartDate : "2019-8-1", 
      
        // ---- 菜单配置 ----
        menuCustomList: { 
            
        },
        

       // ---- 网站配置 ----
        webpageTitleOnblur        : "(◍´꒳`◍) Hi, MyFriend", 
        webpageTitleOnblurTimeOut : 500, 
        webpageTitleFocus         : "(*´∇｀*) 欢迎回来！", 
        webpageTitleFocusTimeOut  : 1000, 
        webpageIcon : "https://files.cnblogs.com/files/wangyang0210/blog_logo.gif", 

        // ---- 进度条配置 ----
        progressBar: {
            id      : 'top-progress-bar',
            color   : '#77b6ff',
            height  : '2px',
            duration: 0.2
        },

        // ---- Loading配置 ----
        loading: {
            rebound: {
                tension: 16,
                friction: 5
            },
            spinner: {
                id: 'spinner',
                radius: 90,
                sides: 3,
                depth: 4,
                colors: {
                    background: '#f0f0f0',
                    stroke: '#272633',
                    base: null,
                    child: '#272633'
                },
                alwaysForward: true, // When false the spring will reverse normally.
                restAt: 0.5,         // A number from 0.1 to 0.9 || null for full rotation
                renderBase: false
            }
        },

        // ---- 页面动效配置 ----
        homeTopAnimationRendered: true, // true || false ,是否渲染主页头图动效
        homeTopAnimation: { // 主页头图动效设置
            radius: 15,
            density: 0.2,
            color: 'rgba(255,255,255, .2)', // 颜色设置，“random” 为随机颜色
            clearOffset: 0.3
        },

        essayTopAnimationRendered: true, // true || false ,是否渲染随笔页头图动效
        essayTopAnimation: { // 随笔页头图动效设置
            triW : 14,
            triH : 20,
            neighbours : ["side", "top", "bottom"],
            speedTrailAppear : .1,
            speedTrailDisappear : .1,
            speedTriOpen : 1,
            trailMaxLength : 30,
            trailIntervalCreation : 100,
            delayBeforeDisappear : 2,
            colors: [
                '#96EDA6', '#5BC6A9',
                '#38668C', '#374D84',
                '#BED5CB', '#62ADC6',
                '#8EE5DE', '#304E7B'
            ]
        },

        bgAnimationRendered: true, // true || false ,是否渲染背景动效
        backgroundAnimation : { // 背景动效设置
            colorSaturation: "60%",
            colorBrightness: "50%",
            colorAlpha: 0.5,
            colorCycleSpeed: 5,
            verticalPosition: "random",
            horizontalSpeed: 200,
            ribbonCount: 3,
            strokeSize: 0,
            parallaxAmount: -0.2,
            animateSections: true
        },

        // ---- 主页配置 ----
        homeTopImg    : [
            "https://cdn.jsdelivr.net/gh/wangyang0210/EasyBe@80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd/static/imgs/home_top_bg.jpg"
        ],
        homeBannerText: "", 

        // ---- 随笔页配置 ----
        essayTopImg: [
            "https://cdn.jsdelivr.net/gh/wangyang0210/EasyBe@80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd/static/imgs/home_top_bg.jpg"
        ],
        essayCodeHighlightingType: 'highlightjs', // 代码主题插件类型：cnblogs || highlightjs || prettify
        essayCodeHighlighting: 'monokai-sublime', // 代码高亮主题，具体主题参考文档
        essaySuffix:{ // 随笔后缀处配置
            aboutHtml    : '', // 关于博主，不配置使用默认
            copyrightHtml: '', // 版权声明，不配置使用默认
        },

        // ---- 页脚配置 ----
        bottomBlogroll: [ // 友情链接，[[链接名,链接]....]
            ["EasyBe 项目", 'https://github.com/wangyang0210/EasyBe'],
        ],
        bottomText: {  // 页脚标语
            icon: "❤️",
            left: "学无止境",
            right: "谦卑而行"
        },

        // ---- 控制台输出 ----
        consoleList: [
        ['wangyang0210 CNBlogs', 'https://www.cnblogs.com/wangyang0210'],
        ['wangyang0210 GitHub', 'https://github.com/wangyang0210'],
        ['wangyang0210 Email', '2752154874@qq.com']
        ],
    };

    // start cache
    $.ajaxSetup({cache: true});

    // load loadingJs
    $.getScript(getJsDelivrUrl('loading.js'), function () {

        // Loading start
        pageLoading.initRebound();
        pageLoading.initSpinner();
        pageLoading.spinner.init(pageLoading.spring, true);
        $.getScript(getJsDelivrUrl('jquery.mCustomScrollbar.min.js'), function () {
            $.getScript(getJsDelivrUrl('require.min.js'), function () {
                $.getScript(getJsDelivrUrl('config.js'), function () {
                    var staticResource = [
                        'optiscroll', 'ToProgress', 'rotate',
                        'snapSvg', 'classie', 'main4', 'tools'];
                    require(staticResource, function() {
                        require(['base'], function() {
                            (new Base).init();
                        });
                    });
                });
            });
        });
    });

    // get file url
    function getJsDelivrUrl(file, directory) {
        file = setFileNameMin(file, directory);
        return 'https://cdn.jsdelivr.net/gh/'+(window.cnblogsConfig.GhUserName)+'/'+(window.cnblogsConfig.GhRepositories)+'@'+(window.cnblogsConfig.GhVersions)+'/static/' + (file ? file : '');
    }

    // optimization file name
    function setFileNameMin(file, directory) {
        if (typeof file == 'undefined') return '';
        var suffix  = null,fileArr = file.split('.');
        if (fileArr.length > 0 && $.inArray(fileArr[(fileArr.length -1)], ['js', 'css']) != -1)
            {suffix    = fileArr.pop(); directory = suffix;}
        file.search('.min') == -1 && fileArr.push('min');
        suffix != null && fileArr.push(suffix);
        return (typeof directory !== 'undefined' ? (directory + '/' + fileArr.join('.')) : (fileArr.join('.')));
    }
</script>
```

下面是这张背景图在首页封面区域的效果。

![示例背景图在 EasyBe 首页封面区域的复现效果](https://res.cloudinary.com/sycamore/image/upload/v1792409007/Typora/2026/10/19/easybe-example-header.png)

## 如何简单地修改
下面先解释全局配置里的内容，再看需要修改主题文件的地方。
### 全局配置部分
下面按配置项分别说明，Loading 小节还放了我修改后的版本。修改时找到完整配置中的对应位置替换，不需要再粘贴一套。
#### GitHub文件源配置
这三项决定 jsDelivr 从哪个仓库读取静态资源。如果准备自己修改主题的脚本和样式，可以先 fork 仓库，再填写自己的信息。

- **GhUserName**：仓库所属的 GitHub 用户名。
- **GhRepositories**：仓库名。
- **GhVersions**：该仓库中实际存在的标签、分支或提交哈希。示例固定到一个提交，不能随意填一个不存在的版本号。
```html
        // ---- GitHub文件源配置 ----
        GhUserName: 'wangyang0210', 
        GhRepositories: 'EasyBe', 
        GhVersions : '80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd', 
```
#### 基础信息配置
- **blogUser**：显示在首页封面中央的名字。
- **blogAvatar**：头像图片地址。
- **blogStartDate**：博客建立的日期，用于计算页脚的运行时间。
```html
        // ---- 基础信息配置 ----custom
        blogUser      : "。思索",
        blogAvatar    : 
        "https://cdn.jsdelivr.net/gh/wangyang0210/EasyBe@80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd/static/imgs/home_top_bg.jpg",
        blogStartDate : "2019-8-1", 
```
#### 网站标签栏配置
- **webpageTitleOnblur**：切换到其他标签页后显示的标题文字。
- **webpageTitleOnblurTimeOut**：离开页面后，延迟多久替换标题，单位是毫秒。
- **webpageTitleFocus**：切回博客时立即显示的标题文字。
- **webpageTitleFocusTimeOut**：切回后，多久恢复原来的标题，单位也是毫秒。
- **webpageIcon**：浏览器标签栏中的网站图标。

```html
       // ---- 网站配置 ----
        webpageTitleOnblur        : "(◍´꒳`◍) Hi, MyFriend", 
        webpageTitleOnblurTimeOut : 500, 
        webpageTitleFocus         : "(*´∇｀*) 欢迎回来！", 
        webpageTitleFocusTimeOut  : 1000, 
        webpageIcon : "https://files.cnblogs.com/files/wangyang0210/blog_logo.gif", 
```
![左侧即网站图标](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/255076c34fe294441cc723a9c262a40a.jpg "左侧的是网站图标")

#### 进度条
这部分我保留了主题默认配置。主题把页面滚动百分比传给进度条，**duration** 控制进度条宽度变化的过渡时间，单位是秒。示例中的 `0.2` 表示每次更新宽度时，用 0.2 秒完成过渡。
```html
        // ---- 进度条配置 ----
        progressBar: {
            id      : 'top-progress-bar',
            color   : '#77b6ff',
            height  : '2px',
            duration: 0.2
        },
```
#### Loading 动画配置
这部分很有意思。主题默认的是多层三角形加载动画，改几个参数就能换成另一种效果。

- **rebound**：弹簧动画参数。`tension` 是张力，`friction` 是摩擦，二者共同影响运动和回弹效果。
- **radius**：基础多边形的半径，影响图案大小。
- **sides**：多边形的边数，三角形就是 `3`。
- **depth**：内嵌多边形的层数。
- **background**：加载画面的背景色。
- **stroke**：多边形轮廓线的颜色。
- **base**：基础多边形的填充色。
- **child**：内嵌多边形的填充色。
- **alwaysForward**：`true` 时持续向前运动，`false` 时保留来回运动的效果。
- **restAt**：控制动画进度使用的区间阈值，原注释给出的范围是 `0.1` 到 `0.9`，也可以填 `null` 使用完整区间。它不是直接填写旋转角度的地方。
- **renderBase**：是否绘制基础多边形。需要显示它时设为 `true`，并配合 `base` 设置填充色。

主题默认的 Loading 配置：
```html
        // ---- Loading配置 ----
        loading: {
            rebound: {
                tension: 16,
                friction: 5
            },
            spinner: {
                id: 'spinner',
                radius: 90,
                sides: 3,
                depth: 4,
                colors: {
                    background: '#f0f0f0',
                    stroke: '#272633',
                    base: null,
                    child: '#272633'
                },
                alwaysForward: true, // When false the spring will reverse normally.
                restAt: 0.5,         // A number from 0.1 to 0.9 || null for full rotation
                renderBase: false
            }
        },
```
我修改后的 Loading 配置：黑色背景、六边形，填充色也设为黑色，这样看起来就只剩黄色边框了。

```html
        loading: {
            rebound: {
                tension: 46,
                friction: 3
            },
            spinner: {
                id: 'spinner',
                radius: 120,
                sides: 6,
                depth: 6,
                colors: {
                    background: '#181818',
                    stroke: '#F4CA0C',
                    base: '#181818',
                    child: '#181818'
                },
                alwaysForward: false, // When false the spring will reverse normally.
                restAt: 0.2,         // A number from 0.1 to 0.9 || null for full rotation
                renderBase: true
            }
        },
```

下面是按我修改后的配置复现的效果。截图是动画中的一帧，实际运行时会来回运动。

![自定义六边形 Loading 动画的复现截图](https://res.cloudinary.com/sycamore/image/upload/v1792409011/Typora/2026/10/19/easybe-custom-loading.png)

#### 主页封图
页面动效我没有改，原来的效果已经很好看了。

**homeTopImg** 用来设置首页封面，填入多张图片地址后会随机选取。

我之前尝试用 `homeBannerTextType` 设置一言，没有成功。核对这个版本后，实际读取的是 **homeBannerText**，可以用它填写固定标语。

```html
        // ---- 主页配置 ----
        homeTopImg    : [
            "your_image_url"
        ],
        homeBannerText: "", 
```
#### 随笔页&页脚
- **essayTopImg**：文章页封面，填写多张图片地址后会随机选取。
- **essayCodeHighlightingType**、**essayCodeHighlighting**：代码高亮方式和配色。我保留了原配置；如果要改，需要确认主题已经加载对应的高亮组件和样式。
- **aboutHtml**、**copyrightHtml**：文章末尾的作者介绍和版权说明，位置在评论区上方。

```html
        // ---- 随笔页配置 ----
        essayTopImg: [
            "https://cdn.jsdelivr.net/gh/wangyang0210/EasyBe@80e8d7f9b7acb7ab1318ac39cbfad7b0ed908edd/static/imgs/home_top_bg.jpg"
        ],
        essayCodeHighlightingType: 'highlightjs', // 代码主题插件类型：cnblogs || highlightjs || prettify
        essayCodeHighlighting: 'monokai-sublime', // 代码高亮主题，具体主题参考文档
        essaySuffix:{ // 随笔后缀处配置
            aboutHtml    : '', // 关于博主，不配置使用默认
            copyrightHtml: '', // 版权声明，不配置使用默认
        },
```
![评论上方](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/8a4f73d87359bda7f9e20dde80425052.jpg "评论上方")

页脚的 **bottomBlogroll** 是友情链接，每一项按“显示名称、链接地址”的顺序填写；**bottomText** 是页脚标语。
```html
        // ---- 页脚配置 ----
        bottomBlogroll: [ // 友情链接，[[链接名,链接]....]
            ["EasyBe 项目", 'https://github.com/wangyang0210/EasyBe'],
        ],
        bottomText: {  // 页脚标语
            icon: "❤️",
            left: "学无止境",
            right: "谦卑而行"
        },
```
后面的 **consoleList** 是浏览器控制台输出的文字，可以换成自己的信息。再往后是加载脚本和初始化主题的代码，只改外观配置时不需要动这一段。
### 源文件更改
下面的修改在“外观 → 编辑当前外观”中进行。动手前先备份对应文件，避免改错后页面打不开。
#### 左下角歌单修改
左下角的播放器使用网易云音乐歌单。如果想换成自己的歌单，打开 **footer.php**，找到播放器这一行，把 `data-id` 改成目标歌单的 ID。这里的 `data-server="netease"` 和 `data-type="playlist"` 分别指定了平台和歌单类型。
![歌单id修改](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/df332927842a389d463ca0e299138c61.jpg "歌单id修改")
打开目标歌单的网页，地址中 `id=` 后面的数字就是歌单 ID，图中已经画了红线。
![找歌单id](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/aecfba482a467d67e2d2004619c9a70b.jpg "找歌单id")

#### 脑壳疼
文章末尾有“脑壳疼”“脑仁疼”“脑瓜疼”三个链接，点击只会提示“开发中”(/▽＼)

它们写在 **post.php** 中。如果想换成自己的链接，需要修改显示文字和 `href`，并移除原来的 `onclick` 提示，否则点击时仍会弹出“开发中”。
![脑壳疼修改](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/9e4497561eff3b65ad747bb8c116c72b.jpg "脑壳疼修改")
我只是找到了这几处位置，没有想好放什么，所以还没有实际改过这部分。
#### 侧边栏链接修改
侧边栏的样式我挺喜欢。如果想改下面这些链接，需要打开 **sidebar.php**。
![侧边栏链接展示](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/25f52eb6201ae5c4cc420f4fa7a003c7.jpg "侧边栏链接展示")

“首页”、“管理”、“添加随笔”已经分别指向对应页面，没有特别需要可以保留。其他链接修改 `href` 中的地址和标签里的显示文字即可。

“联系”使用的是 QQ 会话链接，截图中 `uin=` 后的数字是 QQ 号。这套操作来自旧版 QQ 推广页面，下面两张图保留作记录：
（目前没有重新验证客户端能否拉起会话，不能保证按此步骤设置后仍然有效）

![侧边栏链接修改位置](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/f1b914c920047bb0a7bd957461f031e1.jpg "侧边栏链接修改位置")

进入 [QQ 推广页面](https://shang.qq.com/v3/index.html)，选择“推广工具 → 设置”。
![QQ会话服务开启](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/dd27498eb41b9bfa860692909a9f12c7.jpg "QQ会话服务开启")

页面中的“会话能力”设置如下，修改后点击“保存”。
![QQ会话服务开启](https://res.cloudinary.com/sycamore/image/upload/Typora/2023/12/d6ee6b510dc9b40534bd09b4b59d69e1.jpg "QQ会话服务开启")

测试时不要用自己的账号与自己发起会话。能否打开会话，还要看当前 QQ 客户端和浏览器的行为，不能把当时手机端的测试方式当作唯一支持的方式。
## 总结

本文主要改了配置和几处链接，最满意的还是自己调的 Loading 动画 (oﾟvﾟ)ノ。
