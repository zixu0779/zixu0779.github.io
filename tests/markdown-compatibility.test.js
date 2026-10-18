const assert = require('node:assert/strict');
require('../lib/theme-patches');
const render = require('hexo-renderer-multi-next-markdown-it/lib/renderer');
const html = render.call({ config: {} }, { text: '# 中文标题\n\n中文English测试。\n\n`flag{under_score~value}`\n\n$x^2$' });
assert.match(html, /<h1\b/);
assert.match(html, /中文 English 测试/);
assert.match(html, /<code>flag\{under_score~value\}<\/code>/);
assert.match(html, /class="katex"/);
console.log('Fresh Markdown renderer loads legacy plugins, headings, spacing, literal code and math');
