const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { join } = require('node:path');
const pug = createRequire(require.resolve('hexo-renderer-pug'))('pug');
const baseline = require('./footer-baseline.json');
let registerFooter, injected;
const vm = require('node:vm');
const fs = require('node:fs');
vm.runInNewContext(fs.readFileSync(join(__dirname, '../scripts/footer.js'), 'utf8'), { require, hexo: { source_dir: join(__dirname, '../source'), extend: { filter: { register: (_, fn) => { registerFooter = fn; } } } } });
registerFooter({ footer: { raw: (_, template) => { injected = template; } } });
for (const { theme } of baseline) {
  const html = pug.renderFile(join(__dirname, '../source/_layouts/footer/index.pug'), { theme }).replace(/\n+<\/script>/g, '</script>');
  assert(!html.includes('span[title=\"站点阅读时长\"]'), 'statistics do not depend on translated tooltip text');
  const injectedHtml = pug.render(injected, { theme }).replace(/\n+<\/script>/g, '</script>');
  assert.equal(injectedHtml, html);
}
const home = fs.readFileSync('public/index.html', 'utf8');
assert.equal((home.match(/id="busuanzi_value_site_pv"/g) || []).length, 1);
assert(home.includes('本站累计访问次数（PV）'));
const { wordCount, codeLines } = require('../scripts/code-lines');
const posts = JSON.parse(fs.readFileSync('db.json', 'utf8')).models.Post;
const words = posts.reduce((total, post) => total + wordCount(post), 0);
const lines = posts.reduce((total, post) => total + codeLines(post), 0);
const display = words >= 1000 ? Math.round(words / 100) / 10 + 'k' : words;
assert(home.includes(display + ' 字'), 'first-build footer includes all rendered articles');
assert(home.includes(lines.toLocaleString('en-US') + ' 行'));
assert(!home.includes('字/词'));
console.log('Footer rendering and server-rendered PV container verified');
