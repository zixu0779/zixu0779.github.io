import { defineConfig } from "./toolkit/themeConfig";
export default defineConfig({
  siteName: "Z1gg7x's Blog",
  locale: "zh-CN",
  brand: {
    title: "Z1gg7x's Blog",
    logo: "",
    subtitle: "Following ideas, leaving traces.",
  },
  nav: [
    {
      href: "/",
      text: "首页",
      icon: "ic i-home",
    },
    {
      href: "/",
      text: "文章",
      icon: "ic i-feather",
      dropbox: {
        enable: true,
        items: [
          {
            href: "/archives/",
            text: "归档",
            icon: "ic i-list-alt",
          },
          {
            href: "/categories/",
            text: "分类",
            icon: "ic i-th",
          },
          {
            href: "/tags/",
            text: "标签",
            icon: "ic i-tags",
          },
        ],
      },
    },
    {
      href: "/friends/",
      text: "友链",
      icon: "ic i-heart",
    },
    {
      href: "/about/",
      text: "关于",
      icon: "ic i-coffee",
    },
    {
      href: "https://www.travellings.cn/go.html",
      text: "开往",
      icon: "ic i-subway",
    },
  ],
  sidebar: {
    author: "Z1gg7x",
    description: "",
    social: {
      github: { url: "https://github.com/zixu0779", icon: "ic i-github" },
      email: { url: "mailto:zixu0779@gmail.com", icon: "ic i-envelope" },
      bilibili: { url: "", icon: "ic i-bilibili" },
    },
  },
  footer: {
    since: 2021,
    powered: false,
    icp: {
      enable: false,
    },
  },
  widgets: {
    randomPosts: true,
    recentComments: true,
    recentCommentsLimit: 5,
    recentCommentsServerURL: "https://waline.sycamore.top",
  },
  layout: {
    mode: "two-column",
  },
  home: {
    pageSize: 10,
    selectedCategories: [
      {
        name: "Diary",
        cover: "/Diary/cover.jpg",
      },
      {
        name: "Develop",
        cover: "/Develop/cover.jpg",
      },
      {
        name: "CyberSecurity",
        cover: "/CyberSecurity/cover.jpg",
      },
      {
        name: "Cyberpunk 2077",
        cover: "/Mod-Develop/Cyberpunk-2077/cover.jpg",
      },
    ],
  },
  cover: {
    enable: true,
    preload: true,
    fixedCover: {
      enable: true,
      url: "https://res.cloudinary.com/sycamore/image/upload/v1737191177/Gallery/174019_1968064341_ug06ys.jpg",
    },
  },
  friends: {
    title: "友情链接",
    comments: true,
    links: [],
  },
});
