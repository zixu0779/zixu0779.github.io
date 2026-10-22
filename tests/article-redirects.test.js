const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let routes;
vm.runInNewContext(fs.readFileSync('scripts/article-redirects.js', 'utf8'), {
  hexo: { extend: { generator: { register: (_, generate) => { routes = generate(); } } } }
});
assert.equal(routes.length, 2);
for (const route of routes) {
  const target = decodeURI(route.data.match(/href="([^"]+)"/)[1]);
  const [path, anchor] = target.split('#');
  const html = fs.readFileSync('public' + path + 'index.html', 'utf8');
  assert(html.includes(`id="${anchor}"`), `Missing merged section: ${target}`);
  assert(fs.readFileSync('public/' + route.path, 'utf8').includes('http-equiv="refresh"'));
  assert(!fs.existsSync('source/_posts/' + route.path.replace(/\/index.html$/, '.md')));
}
console.log('Both merged article addresses redirect to existing sections');
