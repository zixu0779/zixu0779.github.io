import fs from "node:fs";
import { createRequire } from "node:module";
const root = "/Users/sycamore/Workplace/Hexo/zixu0779.github.io";
const require = createRequire(root + "/node_modules/hexo-renderer-stylus/package.json");
const stylus = require(root + "/node_modules/.pnpm/stylus@0.62.0/node_modules/stylus");
let s = fs.readFileSync(root + "/source/_data/custom.styl", "utf8");
fs.writeFileSync(
  "src/styles/migration.css",
  stylus.render(s.slice(0, s.indexOf("#main {")) + s.slice(s.indexOf(".friend-application {"))),
);
const db = JSON.parse(fs.readFileSync(root + "/db.json")).models;
fs.writeFileSync(
  "src/migration/articles.json",
  JSON.stringify(Object.fromEntries(db.Post.map((p) => [p.slug, p.content]))),
);
function edit(p, f) {
  fs.writeFileSync(p, f(fs.readFileSync(p, "utf8")));
}
edit("astro.config.mjs", (s) =>
  s
    .replace('import Font from "vite-plugin-font";', "")
    .replace(/      Font.vite\(\{[\s\S]*?      \}\),\n/, ""),
);
edit("src/layouts/Layout.astro", (s) =>
  s
    .replace(/    <script>[\s\S]*?import \{ css \} from "@\/assets\/fonts\/[\s\S]*?<\/script>/, "")
    .replace(
      'import "@/styles/palette.css";',
      'import "@/styles/palette.css";\nimport "@/styles/migration.css";',
    )
    .replace("</body>", '<script src="/migration-ui.js" is:inline></script>\n</body>'),
);
edit("src/theme.config.ts", (s) =>
  s.replace(
    "/migration-cover.jpg",
    "https://res.cloudinary.com/sycamore/image/upload/v1737191177/Gallery/174019_1968064341_ug06ys.jpg",
  ),
);
edit("src/pages/[...slug].astro", (s) =>
  s
    .replace(
      "import Layout from",
      'import articles from "@/migration/articles.json";\nimport Layout from',
    )
    .replace(
      "renderedContentHtml = renderedHtml;",
      "renderedContentHtml = articles[post.id as keyof typeof articles] || renderedHtml;",
    )
    .replace("const toc: TocItem[] = isEncrypted", "const toc: TocItem[] = isEncrypted")
    .replace(
      ": headings.map((h) => ({",
      ': Array.from((renderedContentHtml || "").matchAll(/<h([1-6]) id="([^"]+)"[^>]*>([\\s\\S]*?)<\\/h[1-6]>/g)).map((m) => ({ depth: Number(m[1]), slug: m[2], text: m[3].replace(/<a[^>]*>[\\s\\S]*?<\\/a>/g, "").replace(/<[^>]*>/g, "").trim() })).map((h) => ({',
    )
    .replace(
      "showReward={false}",
      'showReward={true}\n          rewardConfig={{enable:true,accounts:{wechatpay:"/wechatpay.png",alipay:"/alipay.png"}}}',
    ),
);
edit("src/components/sidebar/Sidebar.tsx", (s) =>
  s.replace(
    "window.scrollY > affixThreshold",
    '(document.querySelector("main")?.getBoundingClientRect().top ?? 1) <= 0',
  ),
);
edit("src/components/sidebar/SidebarSocial.tsx", (s) =>
  s
    .replace("href={link.url}", "href={link.url || undefined}")
    .replace("class={`item ${name}`}", 'class={`item ${name} ${!link.url ? "unlinked" : ""}`}')
    .replace("title={link.url}", 'title={link.url || "B站：暂时还没有哦"}')
    .replace('target="_blank"', 'target={link.url ? "_blank" : undefined}')
    .replace(
      'rel="noopener noreferrer"',
      'rel="noopener noreferrer"\n                  role={!link.url ? "button" : undefined}\n                  tabindex={!link.url ? 0 : undefined}',
    ),
);
edit("src/toolkit/ui/theme.ts", (s) =>
  s.replace(
    'return win.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";',
    'const hour = new Date().getHours();\n  return hour >= 18 || hour < 7 ? "dark" : "light";',
  ),
);
edit("src/components/post/PostFooter.astro", (s) =>
  s
    .replace("i-ri-heart-pulse-line", "i-ri-cup-line")
    .replace('{t("post.rewardDescription")}', "请我喝咖啡~(￣▽￣)~*")
    .replace("{author}@{siteName}", '<a href="/about/">{author}</a>'),
);
// 原有 Waline 参数由本地组件完整接管，评论数据库保持不变。
const waline = JSON.parse(fs.readFileSync("src/migration/waline.json"));
delete waline.enable;
fs.writeFileSync(
  "src/components/MigrationComments.astro",
  `<div class="migration-waline" aria-label="评论区"></div>\n<script>\nimport {init} from '@waline/client';\nimport '@waline/client/style';\nconst el=document.querySelector<HTMLElement>('.migration-waline');\nif(el) init({el,...${JSON.stringify(waline)},dark:':root[data-theme="dark"]',path:decodeURI(location.pathname)});\n</script>\n`,
);
for (const p of [
  "src/pages/[...slug].astro",
  "src/pages/about/index.astro",
  "src/pages/friends/index.astro",
])
  edit(p, (s) =>
    s
      .replace(
        "import HyacineOutlet from",
        'import MigrationComments from "@/components/MigrationComments.astro";\nimport HyacineOutlet from',
      )
      .replace('<HyacineOutlet name="comment" />', "<MigrationComments />")
      .replace('<HyacineOutlet name="comment"/>', "<MigrationComments />"),
  );
console.log("Adapted existing theme components");
