const assert = require('node:assert/strict');
let render;
global.hexo = { extend: { filter: { register(name, callback) {
  assert.equal(name, 'after_post_render');
  render = callback;
} } } };
require('../scripts/prompt-glyph');
delete global.hexo;
assert.equal(render({ content: '<code></code>' }).content, '<code></code>');
const post = render({ content: '<code></code>', excerpt: 'Summary', prompt_glyph: true });
assert(post.content.startsWith('<code></code>'));
assert(post.content.includes('unicode-range: U+E23A'));
assert.equal(post.excerpt, 'Summary');
console.log('Prompt glyph: opt-in only, text and excerpt preserved.');
