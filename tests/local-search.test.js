// Run with: node tests/local-search.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let generate;
vm.runInNewContext(fs.readFileSync('scripts/site-ui.js', 'utf8'), {
  require,
  hexo: {
    config: { root: '/' },
    theme: { config: { social: {} } },
    extend: {
      filter: { register() {} },
      generator: { register(name, callback) { generate = callback; } }
    }
  }
});
const posts = [
  { title: '中文搜索', path: '中文/', content: '<p>正文 &amp; 内容</p>', tags: [{ name: 'Hexo' }], categories: [{ name: 'Develop' }] },
  { title: '隐藏文章', indexing: false }
];
posts.sort = () => posts;
const output = generate({ posts });
const index = JSON.parse(output.data);
assert.equal(output.path, 'search.json');
assert.equal(index.length, 1);
assert.equal(index[0].url, '/中文/');
assert.equal(index[0].text, '正文 & 内容');
assert.equal(index[0].tags, 'Hexo');
assert.equal(index[0].categories, 'Develop');
const score = require('../source/js/search-match');
const post = { title: '主菜单背景', tags: 'CP2077', categories: 'Mod Develop', text: '正文' };
for (const query of ['cyberpunk', 'Cyberpunk-2077', 'cp 2077', '赛博朋克2077']) assert.ok(score(post, query) > 0, query);
assert.ok(score(post, 'mod_develop') > 0);
assert.ok(score(post, 'cyberpunk mod') > 0);
assert.equal(score(post, 'cyberpunk unity'), 0);
assert.equal(score(post, 'unity'), 0);
assert.ok(score({ ...post, title: 'Cyberpunk 2077' }, 'cyberpunk') > score(post, 'cyberpunk'));
console.log('Local search index checks passed');
