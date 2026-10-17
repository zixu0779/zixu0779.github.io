const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const categoryOrder = require('../lib/category-order');
const category = (name, dates) => ({ name, posts: { toArray: () => dates.map(date => ({ date: new Date(date) })) } });
const categories = [category('旧', ['2021-01-01']), category('含新文章', ['2020-01-01', '2025-01-01']), category('中间', ['2023-01-01'])];
assert.deepEqual(categories.sort(categoryOrder).map(c => c.name), ['含新文章', '中间', '旧']);
assert.equal(categoryOrder(category('空', []), category('空', [])), 0);

const code = fs.readFileSync('source/js/site-ui.js', 'utf8');
const handlers = {}, clicks = [];
let opens = 0;
let details = { dataset: { ready: 'true' }, dispatchEvent: event => { assert.equal(event.type, 'category:open'); opens++; } };
const group = { matches: selector => selector === '.category-group', querySelector: () => details };
const location = { origin: 'http://localhost:4001', pathname: '/categories/', hash: '#category-Develop-%E5%8D%9A%E5%AE%A2%E6%90%AD%E5%BB%BA' };
const context = { Event, URL, location, history: { pushState: (_, __, hash) => { location.hash = hash; } },
  document: { getElementById: id => id === 'category-Develop-博客搭建' ? group : null, addEventListener: (_, handler) => clicks.push(handler) },
  window: { addEventListener: (name, handler) => { handlers[name] = handler; } } };
vm.runInNewContext(code.slice(code.indexOf('  let categoryAnchor;'), code.indexOf("  document.addEventListener('click', event => {\n    const link = event.target.closest('#new-comment a');")) + '\nlocateCategory();', context);
assert.equal(opens, 1, 'direct encoded hash opens the target');
handlers.hashchange(); assert.equal(opens, 1, 'refresh does not reopen a manually closed target');
details = { ...details }; handlers.hashchange(); assert.equal(opens, 2, 'PJAX replacement is opened');
let prevented = false;
clicks[0]({ target: { closest: () => ({ hasAttribute: () => false, href: location.origin + location.pathname + location.hash }) }, button: 0,
  preventDefault() { prevented = true; }, stopImmediatePropagation() {} });
assert(prevented); assert.equal(opens, 3, 'clicking the same hash can reopen the target');
clicks[0]({ target: { closest: () => ({ hasAttribute: name => name === 'data-category-page', href: location.origin + location.pathname + location.hash }) }, button: 0,
  preventDefault() { assert.fail('category navigation must not consume pagination clicks'); },
  stopImmediatePropagation() { assert.fail('pagination handler must receive the click'); } });
assert.equal(opens, 3, 'pagination does not reopen the category or reset its page');
location.hash = '#category-Develop-parent'; handlers.hashchange(); assert.equal(opens, 3, 'parent links do not open unrelated groups');
location.hash = '#category-%'; handlers.hashchange(); assert.equal(opens, 3, 'malformed hashes are ignored');
console.log('Latest-post category ordering and direct/PJAX/same-hash category navigation verified');
