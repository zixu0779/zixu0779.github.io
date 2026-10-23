---
title: "ShokaX 主题修改记录"
date: 2023-04-30 14:05:53
tags: ["Hexo", "ShokaX", "主题定制"]
categories: [["博客搭建", "主题修改"]]
cover: https://res.cloudinary.com/sycamore/image/upload/v1792216269/Covers/577e6e5d3f3fdf4d5af4e71de5c13847.png
updated: 2023-04-30 14:05:53
---

[shokaX]{.label}主题基于[shoka]{.label}主题进行二次开发，据说是因为原主题停止更新...

因为各种原因吧，若按照`shokaX`作者写的文档更改配置的话，还需要一定程度上参考一下`shoka`主题的配置文档，

所以，我决定记录一下这次博客迁移中对`shokaX`主题进行的更改。

# 主题安装

`shokaX`主题配置文档中，使用主题作者自己搭的工具`SXC`进行安装，

:::info
注意：因为自定义内容较多，所以选择从`github`安装。
:::

```shell
# hexo init
npm install shokax-cli --location=global
# cd your_blog
SXC install -r=github shokaX
```

# 主题修改

## 值得一说的基础配置

### 顶栏

如果想和`shoka`主题站点的顶栏配置一样的，可以参考我的配置：

!!shokaX配置文档中说得也够详细了，但某些话读起来总有点谜语人的感觉，比如超链接的部分，文档的说法实在是令人迷惑...!!

```yaml
menu:
  home: / || home
  about:
    default: /about/ || user
    aboutsite: /about/ || cloud
  posts:
    default: / || feather
    archives: /archives/ || list-alt
    categories: /categories/ || th
    tags: /tags/ || tags
  friends: /friends/ || heart
  travellings: https://www.travellings.cn/go.html  || subway
```

:::default
关于自定义icon的添加，`shoka`的配置文档中有提供一种解决方法，但建议参考我后面的解决方案 [[这里]](#iconfont图标库添加)
:::

### 评论系统

因为`minivaline`停止维护且`valine`评论系统存在严重的安全问题，`shokaX`推荐使用`valine`系其他评论系统代替。

这里提供我的`waline`的配置方案（只放了与`shokaX`配置文档中不一样的部分）：

```yaml
waline:
  enable: true
  serverURL: "https://vercel.sycamore.top"
  locale: {
      placeholder: "1. 提问前请先仔细阅读本文档⚡\n2. 页面显示问题💥，请提供控制台截图📸或者您的测试网址\n3. 其他任何报错💣，请提供详细描述和截图📸，祝食用愉快💪"
  }
```

:::default
其中，`serverURL`按照`waline`官方文档绑定了域名，`local.placeholder`为评论框中默认显示的文字
:::

placeholder与valine系统配置不同，我是在waline官方文档 [从 Valine 迁移](https://waline.js.org/migration/valine.html) 中找到的

### 搜索系统

`algolia`必须参考官方文档进行配置，需要**注意**的是：

1.   `algolia`的配置应该是在`_config.yml`文件中的，我也不知道为啥要在`config`里：
     ![image-20230430151055652](https://res.cloudinary.com/sycamore/image/upload/v1792085079/Typora/2023/04/c825437e5c42bd869ff137173c375d20.png)
     也许是一定得这样？
2.   记得要运行`hexo algolia`将数据更新到index中

### 默认图片更改

博客根目录下创建`source/_data/assets`文件夹，要改哪张图，直接将你的图片名称更改为对应的即可。原图片在主题目录的`source/assets`文件夹下。

比如你要替换`favicon.ico`文件（站点图标），就把你的图标文件重命名为`favicon.ico`，然后放到`source/_data/assets`文件夹下。

------

:::info
基础的部分不再赘述，配置可参考[shokaX](https://docs.kaitaku.xyz/)和[shoka](https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/)主题的配置文档。
:::

## 主题文件的修改和配置

### 音乐播放器

配置格式参考`shoka`的配置文档，记得改的链接必须是有效的、公开的歌单，

有效指的是：歌单中至少有一首歌不是VIP专享、能播放。否则会加载默认歌单。

此外，如果你的播放器根本加载不出来，请检查主题目录下的`source/js/_app/player.js`和`player.ts`，

全局搜索`meting`应该就能看到（因为是基于 [meting-api](https://github.com/injahow/meting-api) 这个项目的）

![image-20230430160205536](https://res.cloudinary.com/sycamore/image/upload/v1792085079/Typora/2023/04/f4f07901036b72746edf40bb804de698.png)

上图中的代码是经过更改的，原来有问题的地方是在：`/meting/api?server=`，把`api`删掉就行了

### TAB标签favicon内容修改

shoka主题下，离开和进入博客页面时，浏览器TAB标签的内容会做出更改，

修改这些内容的方式是更改主题目录的`language`文件夹下的文件，以`en.yml`为例：

![image-20230430162513720](https://res.cloudinary.com/sycamore/image/upload/v1792085077/Typora/2023/04/d75d58621c39e3eec92653408e01f7fa.png)

修改这两行文字就行。

### 底部foot内容删改

不是有意要删掉`shokaX`的链接，页脚再加上一行实在是有点丑陋，看在我写了这篇文章的份上就放过我吧 `<(＿　＿)>`

更改位置在主题目录下，`layout/_partials/footer.pug`文件中

`pug`文件还是简单易懂的，主要还是说一下增加的[一言]{.label .success}功能：

（API链接来自 [hitokoto]{.label .primary}）

主要代码如下：

```pug
    if theme.footer.sentences
        div(class="sentences-content" id="sentences-content")
            = '一言...'
        div(class="sentences-from" id="sentences-from")
            = '來源...'
        script(type="text/javascript").
            fetch(`https://v1.hitokoto.cn/`)
            .then(response => response.json())
            .then(data => {
                var content = document.getElementById('sentences-content');
                content.innerText = data.hitokoto
                var from = document.getElementById('sentences-from');
                from.innerText = data.from + (data.from_who ? ' · ' + data.from_who : '')
            })
            .catch(console.error)
```

简单来说就是加了两个`div`，一个是一眼主体，一个是来源，分别给上 `id`

然后添加一个`script`，脚本中`fetch` `hitokoto`的API地址，然后根据`id`找到对应的块，并使用`innerText`覆盖内容。

### iconfont图标库添加

`shoka`原作者给的方法是评论留言，等他看到之后，把你的用户加到他的项目里。

因为是只读权限，所以你可以任意复制项目里的`icon`，再添加到你自己的项目中使用，最后再把配置文件中的`iconfont`一项改为自己项目的就行。

但是这要建立在作者看到你的评论留言的基础上，鉴于他现在已经停止更新了...

所以建议按照我的方法直接改改主题文件更合适一点，而且我的方法也简单粗暴。

1.   首先，先配好`iconfont`的项目设置：`FontClass/Symbol 前缀`改为`i-`，`Font Family`改为`ic`，
     记得重新生成一下在线链接。
2.   然后回到hexo中，配置文件中的`iconfont`下面加一个`iconfont_plus`的配置，名字随意，看着改就行
3.   然后找到主题目录下的`source/css/`文件夹，创建一个叫做`_iconfont_plus.styl`的文件，文件的内容就是你的`iconfont`项目在线链接的最后部分：
     ![image-20230430165324891](https://res.cloudinary.com/sycamore/image/upload/v1792085076/Typora/2023/04/8cc09958217b38bce3b8f9affe55f60e.png)
4.   找到主题目录下的`scripts/generaters/config.js`文件，如下位置添加一个`'iconfont_plus'`：
     ![image-20230430165616689](https://res.cloudinary.com/sycamore/image/upload/v1792085076/Typora/2023/04/338e079adcf6f44d6edfc2c6ae9b54d4.png)
     （加了这个之后，就可以在主题目录之外修改了，根目录下增加文件`source/_data/iconfont_plus.styl`，但**也可以不加**)
5.   找到主题目录下的`source/css/_variables.styl`文件，增加：
     ![image-20230430170136594](https://res.cloudinary.com/sycamore/image/upload/v1792085074/Typora/2023/04/0c5218d4823d0c93f8b4d04589599140.png)
6.   接下来修改同文件夹下的`app.styl`文件，这一步将`iconfont`项目的`css`文件`import`进了主文件
     添加代码：

     ```css
     if $_iconfont_plus = hexo-config('style.iconfont_plus')
       @import $_iconfont_plus;
     else
       @import "_iconfont_plus";
     ```
7. 最后修改`source/css/_common/scaffolding/base.styl`文件中，

	添加代码：

   ```css
    @font-face {
      font-family: 'ic';
      src: url('//at.alicdn.com/t/c/font_' + $iconfont_plus + '.eot');
      src: url('//at.alicdn.com/t/c/font_' + $iconfont_plus + '.eot?#iefix') format('embedded-opentype'),
      url('//at.alicdn.com/t/c/font_' + $iconfont_plus + '.woff2') format('woff2'),
      url('//at.alicdn.com/t/c/font_' + $iconfont_plus + '.woff') format('woff'),
      url('//at.alicdn.com/t/c/font_' + $iconfont_plus + '.ttf') format('truetype'),
      url('//at.alicdn.com/t/c/font_' + $iconfont_plus + '.svg#ic') format('svg');
    }
   ```
	注意，这一步中要检查你的`iconfont`项目在线链接是否和此处的匹配，若不匹配需要修改。

现在可以自由添加icon了，格式为：`<i class="ic i-subway"> </i>`。

我们只需要将新增的icon添加到自己的项目，然后更新一下在线链接，最后修改一下配置文件中`iconfont_plus`的内容。

:::success
祝：食用愉快
:::