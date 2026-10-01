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
  const injectedHtml = pug.render(injected, { theme }).replace(/\n+<\/script>/g, '</script>');
  assert.equal(injectedHtml, html);
}
console.log('Footer injection compatibility checks passed');
