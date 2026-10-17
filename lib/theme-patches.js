// Patch the installed theme itself; rerun after dependency installation.
const fs = require('node:fs');
const path = require('node:path');
const root = path.dirname(require.resolve('hexo-theme-shokax/package.json'));
const patches = [
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
for (const [file, before, after] of patches) {
  const filename = path.join(root, file);
  const source = fs.readFileSync(filename, 'utf8');
  if (source.includes(after)) continue;
  if (!source.includes(before)) throw new Error(`Theme patch no longer matches: ${file}`);
  fs.writeFileSync(filename, source.replace(before, after));
}
