const latest = category => Math.max(0, ...category.posts.toArray().map(post => Number(post.updated || post.date)));

module.exports = (a, b) => latest(b) - latest(a) || a.name.localeCompare(b.name, 'zh-CN');
