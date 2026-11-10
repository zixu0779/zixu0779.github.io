---
title: Customising my ShokaX theme
translation_id: customising-shokax
source_digest: 2c1de358fde1a5fd02b8894dc51d674e935cfffd20b8296d5cbd983e33c7e5b1
tags:
  - Hexo
  - ShokaX
  - Theme Customization
categories:
  - Blog Building
  - Theme Customization
sections: {"installing-the-theme": "主题安装", "customising-the-theme": "主题修改", "basic-settings-worth-mentioning": "值得一说的基础配置", "top-navigation": "顶栏", "comments": "评论系统", "search": "搜索系统", "replacing-the-default-images": "默认图片更改", "changes-to-theme-files": "主题文件的修改和配置", "music-player": "音乐播放器", "browser-tab-title-and-favicon-text": "tab标签favicon内容修改", "editing-the-footer": "底部foot内容删改", "adding-an-iconfont-library": "iconfont图标库添加"}
---

[ShokaX]{.label} grew out of [Shoka]{.label}, apparently after the original theme stopped receiving updates. During my blog migration I found myself going back and forth between the two sets of documentation. Here’s what I changed in my installation.

# Installing the theme

The ShokaX guide used the author’s `SXC` installation tool.

:::info
I chose the GitHub installation because I wanted to customise quite a few things.
:::

```shell
# hexo init
npm install shokax-cli --location=global
# cd your_blog
SXC install -r=github shokaX
```

# Customising the theme

## Basic settings worth mentioning

### Top navigation

This is the menu configuration I used to get a top bar like the one on the Shoka theme site:

!!The ShokaX docs do go into detail, but parts of the hyperlink explanation had me feeling like I was solving a riddle...!!

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
The Shoka docs suggest one way to add custom icons. I used the approach in [the Iconfont section below](#adding-an-iconfont-library).
:::

### Comments

MiniValine was no longer maintained, and there were serious security concerns with Valine. The ShokaX guide recommended another member of the Valine family. I went with Waline. These are the settings where my setup differed from the theme guide:

```yaml
waline:
  enable: true
  serverURL: "https://vercel.sycamore.top"
  locale: {
      placeholder: "1. 提问前请先仔细阅读本文档⚡\n2. 页面显示问题💥，请提供控制台截图📸或者您的测试网址\n3. 其他任何报错💣，请提供详细描述和截图📸，祝食用愉快💪"
  }
```

:::default
I connected my domain following Waline’s instructions and used it as `serverURL`. The placeholder in `locale` supplies the text shown in the empty comment box.
:::

The placeholder is configured differently from Valine’s. I found the setting in Waline’s [migration guide](https://waline.js.org/migration/valine.html).

### Search

For the Algolia integration I followed the official instructions. Two things to look out for:

1. My Algolia settings were in `_config.yml`. The configuration nesting surprised me; here’s how mine looked:

![The Algolia settings in the site configuration](https://res.cloudinary.com/sycamore/image/upload/v1792085079/Typora/2023/04/c825437e5c42bd869ff137173c375d20.png)

   I wasn’t sure whether it had to be nested under `config` that way.

2. In that setup, `hexo algolia` updated the search index.

### Replacing the default images

Create `source/_data/assets` under the blog root. Give each replacement image the same filename as its counterpart in the theme’s `source/assets`. For example, put your site icon in `source/_data/assets/favicon.ico`.

---

:::info
The [ShokaX](https://docs.kaitaku.xyz/) and [Shoka](https://shoka.lostyu.me/computer-science/note/theme-shoka-doc/) guides cover the rest of the basic configuration.
:::

## Changes to theme files

### Music player

I followed Shoka’s configuration format and selected a public playlist with at least one playable track that didn’t require VIP access. Otherwise the player loaded the default playlist.

If the player didn’t load at all, I checked `source/js/_app/player.js` and `player.ts` in the theme. Searching for `meting` located the relevant code; the player was based on [meting-api](https://github.com/injahow/meting-api).

![The modified player request URL](https://res.cloudinary.com/sycamore/image/upload/v1792085079/Typora/2023/04/f4f07901036b72746edf40bb804de698.png)

The screenshot shows my edited version. In the original URL, `/meting/api?server=` had an extra `api`; removing it fixed my setup.

### Browser tab title and favicon text

Shoka changes the browser tab text when you leave the page and when you return. At the time I changed the two corresponding strings in the theme’s language files. Here they are in `en.yml`:

![The two browser tab messages](https://res.cloudinary.com/sycamore/image/upload/v1792085077/Typora/2023/04/d75d58621c39e3eec92653408e01f7fa.png)

### Editing the footer

I didn’t set out to remove the ShokaX link; another full line just looked awkward in the footer. Please let me off on the strength of this write-up `<(＿　＿)>`.

I edited `layout/_partials/footer.pug`. The Pug template was fairly easy to follow. The part I added was the [quote]{.label .success} from [Hitokoto]{.label .primary}:

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

I gave the quote and its attribution separate divs and IDs. A script fetches the API response, looks up each element by ID and replaces its `innerText`.

### Adding an Iconfont library

Shoka’s original instructions were to leave the author a comment and wait for an invitation to the Iconfont project. Read-only access would let you copy the icons into your own project and point the `iconfont` setting at it. Of course, that depended on the author seeing the comment, and updates had stopped…

I took a more direct route in my copy of the theme:

1. In the Iconfont project settings, set **FontClass/Symbol prefix** to `i-` and **Font Family** to `ic`. Regenerate the hosted link.
2. In the Hexo configuration, add an `iconfont_plus` entry below `iconfont`. The name is up to you; keep it consistent in the following steps.
3. Under the theme’s `source/css/`, create `_iconfont_plus.styl` using the icon definitions from the end of your project’s hosted stylesheet:

![Icon definitions from the hosted stylesheet](https://res.cloudinary.com/sycamore/image/upload/v1792085076/Typora/2023/04/8cc09958217b38bce3b8f9affe55f60e.png)

4. Add `'iconfont_plus'` to `scripts/generaters/config.js` in the theme directory at the location shown. This optional change let me edit the overrides outside the theme in `source/_data/iconfont_plus.styl`.

![Registering the optional override with the configuration generator](https://res.cloudinary.com/sycamore/image/upload/v1792085076/Typora/2023/04/338e079adcf6f44d6edfc2c6ae9b54d4.png)

5. Add the corresponding variable to `source/css/_variables.styl`:

![The icon font variable in the theme stylesheet](https://res.cloudinary.com/sycamore/image/upload/v1792085074/Typora/2023/04/0c5218d4823d0c93f8b4d04589599140.png)

6. Import the Iconfont stylesheet in `app.styl` in the same directory:

```css
     if $_iconfont_plus = hexo-config('style.iconfont_plus')
       @import $_iconfont_plus;
     else
       @import "_iconfont_plus";
```

7. Add the font definition to `source/css/_common/scaffolding/base.styl`:

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

Check that the URLs match the hosted links for your own Iconfont project.

I could then use an icon with markup such as `<i class="ic i-subway"> </i>`. To add more icons, I added them to my project, regenerated the hosted link and updated `iconfont_plus`.

:::success
Enjoy!
:::
