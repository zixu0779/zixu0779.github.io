const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const helpers = {};
vm.runInNewContext(fs.readFileSync('scripts/category-directory.js', 'utf8'), {
  require: require('node:module').createRequire(require('node:path').resolve('scripts/category-directory.js')), hexo: { extend: { helper: { register: (name, fn) => helpers[name] = fn }, filter: { register() {} } } }
});
const paginator = require('hexo/dist/plugins/helper/paginator').default || require('hexo/dist/plugins/helper/paginator');
const context = { page: {}, config: { url: 'http://localhost:4001', root: '/', pagination_dir: 'page' }, __: key => key };
context.paginator = options => paginator.call(context, options);
for (const total of [1, 2, 3, 4, 10, 30]) {
  for (let current = 1; current <= total; current++) {
    context.page = { current, total };
    const actual = helpers.site_pagination.call(context);
    assert.equal(actual, total === 1 ? '' : context.paginator({
      prev_text: '<i class="ic i-angle-left" aria-label="accessibility.prev_page"></i>',
      next_text: '<i class="ic i-angle-right" aria-label="accessibility.next_page"></i>',
      mid_size: 1, escape: false
    }));
  }
}
const html = fs.readFileSync('public/categories/index.html', 'utf8');
for (const group of html.split('<section class="category-group"').slice(1)) {
  const count = Number(group.match(/<small>(\d+) 篇/)[1]);
  const navs = [...group.split('</details>')[0].matchAll(/data-pagination-page=/g)].length;
  assert.equal(navs, count <= 5 ? 0 : Math.ceil(count / 5));
}
assert(!html.includes('data-category-page="0"'));
console.log('Shared homepage pagination matches at every page; single-page categories emit no navigation');
