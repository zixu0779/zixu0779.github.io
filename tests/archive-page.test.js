// Run after generating the site: node tests/archive-page.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const posts = JSON.parse(fs.readFileSync('db.json')).models.Post;
const html = fs.readFileSync('public/archives/index.html', 'utf8');
const articles = [...html.matchAll(/<article class="item normal"[\s\S]*?<\/article>/g)];
const links = articles.map(([article]) => decodeURI(article.match(/<div class="title"><a href="([^"]+)"/)[1]));
assert.deepEqual(new Set(links), new Set(posts.map(post => '/' + post.slug + '/')));
assert.equal(links.length, posts.length);
const actualCounts = {};
for (const [section] of html.matchAll(/<h3 class="item section">[\s\S]*?<\/h3>/g)) {
  const match = section.replace(/<[^>]*>/g, '').replace(/\s/g, '').match(/(\d{4})年\/(\d+)月\((\d+)\)/);
  assert.ok(match, 'Every month section includes its article count');
  actualCounts[match[1] + '-' + Number(match[2])] = Number(match[3]);
}
const expectedCounts = {};
for (const post of posts) {
  const date = new Date(post.date);
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'numeric' }).formatToParts(date);
  const key = parts.find(p => p.type === 'year').value + '-' + Number(parts.find(p => p.type === 'month').value);
  expectedCounts[key] = (expectedCounts[key] || 0) + 1;
}
assert.deepEqual(actualCounts, expectedCounts);
assert.deepEqual(fs.readdirSync('public/archives'), ['index.html']);
assert.equal(html.match(/<h2 class="item header">([\s\S]*?)<\/h2>/)[1].includes('首页'), false);
console.log('Complete archive, monthly counts and single-page routes verified');
