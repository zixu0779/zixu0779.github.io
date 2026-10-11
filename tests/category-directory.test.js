const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync('public/categories/index.html', 'utf8');
const directory = html.split('<div class="category-directory timeline">')[1].split('<div id="sidebar"')[0];
const links = [...directory.matchAll(/<article class="item normal"[^>]*><div class="meta"><time[^>]*>[^<]*<\/time><\/div><div class="title"><a href="([^"]+)"/g)].map(match => match[1]);
const posts = JSON.parse(fs.readFileSync('db.json', 'utf8')).models.Post;
assert.equal(new Set(links).size, posts.length, 'every article remains accessible from the category directory');
assert.deepEqual(fs.readdirSync('public/categories'), ['index.html'], 'category subpages are not generated');
for (const file of ['public/index.html', 'public/friends/index.html']) {
  assert(!/href="\/categories\/[^#"][^"]*"/.test(fs.readFileSync(file, 'utf8')), 'no links lead to removed category pages');
}
const friends = fs.readFileSync('public/friends/index.html', 'utf8');
assert.equal((friends.match(/data-avatar-fallback=/g) || []).length, 3);
assert(friends.includes('data-friend-copy="#d47e9a"'));
assert(friends.includes('如未提供颜色'));
console.log('Category coverage, directory links and friend avatar/config fields verified');
