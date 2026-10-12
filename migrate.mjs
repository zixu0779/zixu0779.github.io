import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const root = "/Users/sycamore/Workplace/Hexo/zixu0779.github.io";
const require = createRequire(root + "/package.json");
const yaml = require("js-yaml");
const db = JSON.parse(fs.readFileSync(root + "/db.json", "utf8")).models;
const sourceConfig = yaml.load(fs.readFileSync(root + "/_config.shokaX.yml", "utf8"));
const manifest = [];
fs.rmSync("src/posts", { recursive: true });
fs.mkdirSync("src/posts", { recursive: true });
fs.mkdirSync("migration/original-posts", { recursive: true });
fs.mkdirSync("src/migration", { recursive: true });
for (const post of db.Post) {
  const fm = yaml.load(post.raw.match(/^---\n([\s\S]*?)\n---/)[1]);
  const slug = post.slug;
  const url = "/" + slug + "/";
  if (!fs.existsSync(root + "/public/" + slug + "/index.html"))
    throw Error("Missing current route " + url);
  const meta = {
    title: post.title,
    date: post.date,
    updated: post.updated,
    tags: fm.tags || [],
    categories: (fm.categories || []).flat(),
    ...(typeof post.cover === "string" ? { cover: post.cover } : {}),
    description: post.excerpt.replace(/<[^>]*>/g, "").slice(0, 180),
  };
  const filename = "src/posts/" + slug + ".md";
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, "---\n" + yaml.dump(meta) + "---\n\n" + post.content);
  const original = "migration/original-posts/" + post.source.replace("_posts/", "");
  fs.mkdirSync(path.dirname(original), { recursive: true });
  fs.copyFileSync(root + "/source/" + post.source, original);
  manifest.push({ id: slug, title: post.title, url, source: post.source });
}
fs.writeFileSync("migration/routes.json", JSON.stringify(manifest, null, 2));
for (const name of ["about", "friends"]) {
  const page = db.Page.find((p) => p.path === name + "/index.html");
  if (!page) throw Error(name);
  fs.writeFileSync("src/migration/" + name + ".html", page.content);
}
// 保留所有公开静态资源，避免文章中的历史相对链接丢失。
for (const entry of fs.readdirSync(root + "/public", { withFileTypes: true })) {
  if (
    ["_astro", "page", "archives", "categories", "tags", "about", "friends"].includes(entry.name) ||
    entry.name.endsWith(".html")
  )
    continue;
  const src = root + "/public/" + entry.name;
  if (entry.isDirectory() && manifest.some((p) => p.id.startsWith(entry.name + "/"))) continue;
  fs.cpSync(src, "public/" + entry.name, { recursive: true });
}
const conf = {
  siteName: "Z1gg7x's Blog",
  locale: "zh-CN",
  brand: { title: "Z1gg7x's Blog", logo: "", subtitle: "Following ideas, leaving traces." },
  nav: [
    { href: "/", text: "首页", icon: "i-ri-home-4-fill" },
    {
      href: "/",
      text: "文章",
      icon: "i-ri-quill-pen-fill",
      dropbox: {
        enable: true,
        items: [
          { href: "/archives/", text: "归档", icon: "i-ri-archive-line" },
          { href: "/categories/", text: "分类", icon: "i-ri-book-shelf-fill" },
          { href: "/tags/", text: "标签", icon: "i-ri-price-tag-3-fill" },
        ],
      },
    },
    { href: "/friends/", text: "友链", icon: "i-ri-heart-fill" },
    { href: "/about/", text: "关于", icon: "i-ri-cup-line" },
    { href: "https://www.travellings.cn/go.html", text: "开往", icon: "i-ri-subway-fill" },
  ],
  sidebar: {
    author: "Z1gg7x",
    description: "",
    social: {
      github: "https://github.com/zixu0779",
      email: "mailto:zixu0779@gmail.com",
      bilibili: "",
    },
  },
  footer: { since: 2021, powered: false, icp: { enable: false } },
  widgets: {
    randomPosts: true,
    recentComments: true,
    recentCommentsLimit: 5,
    recentCommentsServerURL: sourceConfig.waline.serverURL,
  },
  layout: { mode: "two-column" },
  home: {
    pageSize: 10,
    selectedCategories: [
      { name: "Diary" },
      { name: "Graduation" },
      { name: "Develop" },
      { name: "CyberSecurity" },
      { name: "Mod Develop" },
    ],
  },
  cover: {
    enable: true,
    preload: true,
    fixedCover: { enable: true, url: "/assets/images/cover1.jpg" },
  },
  friends: { title: "友情链接", comments: true, links: [] },
};
fs.writeFileSync(
  "src/theme.config.ts",
  `import {defineConfig} from './toolkit/themeConfig';\nexport default defineConfig(${JSON.stringify(conf, null, 2)});\n`,
);
fs.writeFileSync("src/migration/waline.json", JSON.stringify(sourceConfig.waline, null, 2));
console.log("Migrated", manifest.length, "original article routes");
