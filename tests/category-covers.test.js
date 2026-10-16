const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const pug = require('node:module').createRequire(require.resolve('hexo-renderer-pug'))('pug');
let template;
let generator;
vm.runInNewContext(fs.readFileSync('scripts/category-covers.js', 'utf8'), {
  require,
  hexo: {
    extend: { filter: { register: (_, callback) => callback() }, generator: { get: () => async () => [{ data: { catlist: [] } }], register: (_, fn) => { generator = fn; } } },
    theme: { config: { category_covers: { Diary: 'https://example.com/diary.jpg' } }, setView: (_, value) => { template = value; } }
  }
});
const mixin = template.slice(template.indexOf('mixin CardRender'), template.indexOf('include _mixin/postmeta.pug'));
const render = pug.compile(mixin + '\n+CardRender(item)');
const locals = {
  item: { slug: 'Diary', name: 'Diary', subs: [], length: 0, path: '/categories/Diary/' },
  url_for: value => value, _url: () => '', _p: () => '', theme: { statics: '/' }
};
assert.match(render(locals), /data-background-image="\/Diary\/cover.jpg"/);
locals.theme.category_covers = { Diary: 'https://example.com/Covers/diary.jpg' };
assert.match(render(locals), /data-background-image="https:\/\/example.com\/Covers\/diary.jpg"/);
console.log('Category cover URL override and local fallback verified');

const collection = { length: 0, sort() { return this; }, limit() { return this; }, toArray() { return []; } };
const cat = { _id: 'diary', slug: 'Diary', posts: collection };
generator({ categories: { forEach: fn => fn(cat), find: () => collection } }).then(routes => {
  assert.equal(routes[0].data.catlist[0], cat);
  console.log('Configured category remains visible without a local cover');
}).catch(error => { console.error(error); process.exitCode = 1; });
