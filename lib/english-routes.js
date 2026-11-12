const fs = require('node:fs');
const path = require('node:path');
const files = new Map();
const routes = new Map();
const originals = new Map();
function pair(zh, en) {
  if (originals.has(en) && originals.get(en) !== zh) throw new Error('Duplicate English route: ' + en);
  routes.set(zh, en);
  originals.set(en, zh);
}
function prepare(site, labels) {
  files.clear();
  routes.clear();
  originals.clear();
  const dir = path.join(site.base_dir, 'en/_posts');
  const paths = new Map();
  for (const file of fs.readdirSync(dir, { recursive: true }).filter(f => f.endsWith('.md'))) {
    const id = path.basename(file, '.md');
    if (paths.has(id)) throw new Error('Duplicate English article ID: ' + id);
    paths.set(id, file);
  }
  for (const post of site.locals.get('posts').toArray()) {
    const file = paths.get(post.translation_id);
    if (!file) throw new Error('Missing English article: ' + post.source);
    files.set(post.source, path.join(dir, file));
    pair(post.path, 'en/' + file.slice(0, -3) + '/');
  }
  for (const tag of site.locals.get('tags').toArray()) {
    if (/[^\x00-\x7f]/.test(tag.name)) pair(tag.path, 'en/tags/' + labels[tag.name].toLowerCase().replace(/\s+/g, '-') + '/');
  }
}
function lookup(key, pairs, fallback) {
  if (pairs.has(key)) return pairs.get(key);
  const page = /^(.*\/)(page\/\d+\/)$/.exec(key);
  return page && pairs.has(page[1]) ? pairs.get(page[1]) + page[2] : fallback;
}
const english = key => lookup(key, routes, 'en/' + key);
const chinese = key => lookup(key, originals, key.slice(3));
module.exports = { prepare, files, english, chinese };
