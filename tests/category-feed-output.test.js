// Run after `hexo generate`: verify the generated directory and every home-feed page.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const posts = walk('source/_posts').filter(p => p.endsWith('.md')).map(file => ({ file, ...yaml.load(fs.readFileSync(file, 'utf8').split('---')[1]) }));
const directory = fs.readFileSync('public/categories/index.html', 'utf8');
assert.deepEqual([...directory.matchAll(/<h2 class="category-parent[^>]*>(.*?) <small>/g)].map(m => m[1]), ['软件开发', '游戏工坊', '博客搭建', '网络安全', '系统环境', '人工智能', '生活记录']);
for (const group of directory.matchAll(/<section class="category-group"[^>]*>(.*?)<\/section>/g)) {
  const dates = [...group[1].matchAll(/<time itemprop="dateModified" datetime="([^"]+)">更新于 /g)].map(m => Date.parse(m[1]));
  assert(dates.length > 0);
  assert(dates.every((date, i) => !i || dates[i - 1] >= date), 'category articles follow update order');
}
const pages = ['public/index.html', ...walk('public/page').filter(p => p.endsWith('/index.html')).sort((a, b) => Number(a.split('/')[2]) - Number(b.split('/')[2]))];
const titles = pages.flatMap(p => [...fs.readFileSync(p, 'utf8').matchAll(/<article class="item"><div class="cover"><a [^>]*title="([^"]+)"/g)].map(m => m[1]));
const featured = post => post.categories.some(category => ['软件开发', '游戏工坊', '博客搭建'].includes(Array.isArray(category) ? category[0] : category));
const expected = posts.filter(p => !p.categories.flat().includes('日常琐记')).sort((a, b) => Number(featured(b)) - Number(featured(a)) || new Date(b.date) - new Date(a.date)).map(p => p.title);
assert.deepEqual(titles, expected, 'all homepage pages exclude diary posts, prioritize featured categories and sort each group by publication');
for (const post of posts.filter(p => p.categories.flat().includes('日常琐记'))) {
  assert(directory.includes(post.title), 'diary remains in category directory');
  assert(fs.existsSync(post.file.replace('source/_posts/', 'public/').replace(/\.md$/, '/index.html')));
}
console.log(`Verified category priorities, update labels/order and ${titles.length} home-feed posts across ${pages.length} pages`);
