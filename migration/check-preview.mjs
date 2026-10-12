import fs from 'node:fs';
import assert from 'node:assert/strict';
const routes=JSON.parse(fs.readFileSync('migration/routes.json'));
assert.equal(routes.length,38);
for(const post of routes){
 const html=fs.readFileSync(`dist${post.url}index.html`,'utf8');
 assert.ok(html.includes(post.title),post.url);
 assert.ok(html.includes('migration-waline'),`评论缺失: ${post.url}`);
 assert.ok(!html.includes('href="/posts/'),`错误文章链接: ${post.url}`);
 const original=JSON.parse(fs.readFileSync('src/migration/articles.json'))[post.id];
 for(const match of original.matchAll(/<h[1-6] id="([^"]+)"/g))assert.ok(html.includes(`id="${match[1]}"`),`锚点缺失: ${post.url}#${match[1]}`);
}
for(const page of ['about','friends'])assert.ok(fs.readFileSync(`dist/${page}/index.html`,'utf8').includes('migration-waline'));
assert.ok(!fs.readFileSync('dist/index.html','utf8').includes('href="/posts/'));
console.log('38 篇旧地址、正文标题、目录锚点、评论容器及站内文章链接检查通过。');
