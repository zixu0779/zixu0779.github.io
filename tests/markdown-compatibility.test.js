const assert = require('node:assert/strict');
require('../lib/theme-patches');
const render = require('hexo-renderer-multi-next-markdown-it/lib/renderer');
const html = render.call({ config: {} }, { text: '# 中文标题\n\n中文English测试。\n\n`flag{under_score~value}`\n\n$x^2$' });
assert.match(html, /<h1\b/);
assert.match(html, /中文 English 测试/);
assert.match(html, /<code>flag\{under_score~value\}<\/code>/);
assert.match(html, /class="katex"/);
// Exercise the actual article corpus: attributes must not swallow literal flags.
const fs = require('node:fs');
const path = require('node:path');
const config = require('js-yaml').load(fs.readFileSync(path.join(__dirname, '../_config.yml'), 'utf8'));
const decode = text => require('hexo-util').unescapeHTML(text)
  .replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)));
let checked = 0;
function checkArticles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { checkArticles(file); continue; }
    if (!file.endsWith('.md')) continue;
    const source = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?\n---/, '');
    const flags = [...source.matchAll(/\b[A-Za-z0-9_]*(?:flag|ctf)[A-Za-z0-9_]*\{[^{}\r\n]*\}/gi)];
    if (!flags.length) continue;
    const visible = decode(render.call({ config }, { text: source }).replace(/<[^>]*>/g, ''));
    for (const [flag] of flags) { assert.ok(visible.includes(flag), `${file}: missing ${flag}`); checked++; }
  }
}
checkArticles(path.join(__dirname, '../source/_posts'));
assert.ok(checked > 0);
const literals = render.call({ config }, { text: '观察 `{}` 和 `_`，前缀 `flag{`。\n\n[nvm]{.label .success}' });
assert.match(literals, /<code>\{\}<\/code>/);
assert.match(literals, /<code>flag\{<\/code>/);
assert.match(literals, /class="label success"/);
console.log(`${checked} article flag literals preserved, including braces and theme labels`);
console.log('Fresh Markdown renderer loads legacy plugins, headings, spacing, literal code and math');
