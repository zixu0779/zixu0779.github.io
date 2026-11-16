const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const readPage = url => readFileSync(join('public', decodeURI(url), 'index.html'), 'utf8');
const posts = [...readPage('/en/archives/').matchAll(/<article class="item normal">[\s\S]*?<a href="([^"]+)"/g)].map(match => match[1]);
assert(posts.length > 2, 'English archive must include middle posts and both endpoints');

for (const [i, url] of posts.entries()) {
  const html = readPage(url);
  const quick = html.match(/<ul id="quick">([\s\S]*?)<\/ul>/)[1];
  for (const [direction, expected] of [['prev', posts[i - 1]], ['next', posts[i + 1]]]) {
    const item = quick.match(new RegExp(`<li class="${direction} pjax">(.*?)</li>`))[1];
    assert.equal(item.match(/href="([^"]+)"/)?.[1], expected, url + ' ' + direction);
    if (expected) assert(expected.startsWith('/en/'));
  }
}
console.log('Verified same-language sidebar neighbors and both endpoints for ' + posts.length + ' English posts');
