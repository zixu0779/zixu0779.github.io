const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function checkRedirect(previous, target) {
  const redirect = fs.readFileSync(path.join('public', previous, 'index.html'), 'utf8');
  const fallback = redirect.match(/<a href="([^"]+)"/)?.[1];
  const refresh = redirect.match(/<meta http-equiv="refresh" content="0;url=([^"]+)"/)?.[1];
  assert.equal(decodeURI(fallback), '/' + target, previous);
  assert.equal(refresh, fallback, previous);
  const [pathname, anchor] = target.split('#');
  const hash = '#678fa86d6e25c660f9426655';
  let destination;
  require('node:vm').runInNewContext(redirect.match(/<script>([^<]+)<\/script>/)[1], {
    location: {hash, replace: value => { destination = value; }}
  });
  assert.equal(decodeURI(destination), '/' + pathname + hash);
  const html = fs.readFileSync(path.join('public', pathname, 'index.html'), 'utf8');
  assert(!html.includes('http-equiv="refresh"'), 'Redirect chain: ' + target);
  if (anchor) assert(html.includes(`id="${anchor}"`), 'Missing merged section: ' + target);
}

const { readMarkdown } = require('../lib/translation-source');
const posts = fs.readdirSync('en/_posts', { recursive: true }).filter(file => file.endsWith('.md'));
const byId = new Map(posts.map(file => [
  readMarkdown(fs.readFileSync(path.join('en/_posts', file), 'utf8')).meta.translation_id, 'en/' + file.slice(0, -3) + '/'
]));
assert.equal(byId.size, posts.length);
const aliases = [
  ['网络安全/安全实验/反弹 Shell/', '网络安全/安全实验/反弹 Shell：连接原理与实现方式/', 'reverse-shells'],
  ['博客建设/建站部署/云服务器建站准备/', '博客搭建/建站部署/用宝塔搭建 WordPress/#准备工作', 'wordpress-bt-panel'],
  ['人工智能/机器学习/机器学习模型的优化/', '人工智能/机器学习/机器学习杂记/#模型优化检查', 'machine-learning-notes']
];
for (const [previous, chinese, id] of aliases) {
  checkRedirect(previous, chinese);
  checkRedirect('en/' + previous, byId.get(id) + (chinese.match(/#.+$/)?.[0] || ''));
  assert(!fs.existsSync('source/_posts/' + previous.slice(0, -1) + '.md'));
}

let renamed = 0;
for (const [id, target] of byId) {
  const previous = path.posix.join(path.posix.dirname(target), id) + '/';
  if (previous !== target) {
    checkRedirect(previous, target);
    renamed++;
  }
}
assert(posts.length > 0);
for (const file of posts) {
  const target = 'en/' + file.slice(0, -3) + '/';
  const html = fs.readFileSync(path.join('public', target, 'index.html'), 'utf8');
  const chinese = html.match(/<a\b[^>]*\bhref="([^"]+)"[^>]*\bhreflang="zh-CN"/)?.[1];
  assert(chinese?.startsWith('/'), 'Missing link to Chinese article: ' + target);
  checkRedirect('en' + decodeURI(chinese), target);
}
console.log(`Verified 6 historical aliases and ${posts.length + renamed} former English article addresses`);
