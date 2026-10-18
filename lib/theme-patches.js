// Patch the installed theme itself; rerun after dependency installation.
const fs = require('node:fs');
const path = require('node:path');
const root = path.dirname(require.resolve('hexo-theme-shokax/package.json'));
const checkedReplace = require('./checked-replace');
const patches = [
  ['source/js/_app/components/comments.ts',
    "    el: '#comments',",
    "    el: '#comments',\n    noRss: true,"],
  // The legacy TOC plugin imports markdown-it's token class without its v14 extension.
  [path.relative(root, require.resolve('markdown-it-toc-and-anchor', {
    paths: [path.dirname(require.resolve('hexo-renderer-multi-next-markdown-it/package.json'))]
  })), 'require("markdown-it/lib/token")', 'require("markdown-it/lib/token.mjs")'],
  [path.relative(root, require.resolve('markdown-it-pangu', {
    paths: [path.dirname(require.resolve('hexo-renderer-multi-next-markdown-it/package.json'))]
  })), "require('markdown-it/lib/common/utils')", "require('markdown-it/lib/common/utils.mjs')"],
  ['source/js/_app/pjax/siteInit.ts',
    "window.addEventListener('DOMContentLoaded', siteInit, {\n  passive: true\n})",
    "if (document.readyState === 'loading') {\n  window.addEventListener('DOMContentLoaded', siteInit, { passive: true, once: true })\n} else {\n  siteInit()\n}"],
  ['source/js/_app/library/scriptPjax.ts',
    "    let script = document.createElement('script')",
    "    if ((window as any).blogLoadVendor) { (window as any).blogLoadVendor(url).then(() => { if (callback) callback() }).catch(console.error); return }\n    let script = document.createElement('script')"],
  ['layout/_mixin/widgets.pug', 'site.posts.shuffle().limit(10).toArray()', 'site.posts.shuffle().limit(5).toArray()'],
  ['source/js/_app/components/comments.ts', '    count: 10\n', '    count: 5\n'],
  ['source/js/_app/components/tcomments.ts', '    pageSize: 10\n', '    pageSize: 5\n'],
  ['source/js/_app/globals/thirdparty.ts',
    `  const days = parseInt(String(CONFIG.outime.days)) || 30 // 设置时效，默认硬编码 30 天
  // 最后一次更新时间超过 days 天（毫秒）
  if (interval > (days * 86400000)) {`,
    `  // 最后一次更新年份早于当前年份
  if (updateTime.getFullYear() < new Date(now).getFullYear()) {`],
  ['source/js/_app/globals/tools.ts',
    '    target = document.querySelector(decodeURI(anchor))',
    `    target = document.querySelector(decodeURI(anchor))
    // Category expansion and scrolling are coordinated by site-ui.js.
    if (target?.matches('.category-group')) return`],
  ['source/js/_app/pjax/refresh.ts',
    '  pageScroll(0)',
    `  // Reset beneath the loader without leaving an animation running into the new page.
  document.scrollingElement.scrollTop = 0`],
  ['source/js/_app/globals/thirdparty.ts',
    "    const template = LOCAL.template.replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated))",
    `    const [year, month, day] = times[0].dateTime.slice(0, 10).split('-')
    const publishDate = year + '年' + Number(month) + '月' + Number(day) + '日'
    const template = LOCAL.template.replace('{{publishDate}}', publishDate).replace('{{publish}}', String(publish)).replace('{{updated}}', String(updated))`],
  ['languages/zh-CN.yml',
    '这是一篇发布于 {{publish}} 天前，最后一次更新在 {{updated}} 天前的文章，',
    '这是一篇发布于 {{publishDate}}的文章，最后一次更新在 {{updated}} 天前，']
];
// Validate every file before writing, so a mismatch does not leave partial patches.
const pending = new Map();
for (const [file, before, after] of patches) {
  const filename = path.join(root, file);
  const source = pending.get(filename) ?? fs.readFileSync(filename, 'utf8');
  if (source.split(after).length - 1 === 1) continue;
  pending.set(filename, checkedReplace(source, before, after, file));
}
for (const [filename, source] of pending) fs.writeFileSync(filename, source);
