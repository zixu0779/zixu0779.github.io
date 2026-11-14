const fs = require('node:fs');
const path = require('node:path');

// The old Chinese URLs differ from the current tag names only in case.
const aliases = { shokaX: 'ShokaX', shellter: 'Shellter' };

function caseSensitive(directory) {
  fs.mkdirSync(directory, { recursive: true });
  const probe = fs.mkdtempSync(path.join(directory, '.tag-case-a-'));
  try {
    return !fs.existsSync(path.join(directory, path.basename(probe).toUpperCase()));
  } finally {
    fs.rmdirSync(probe);
  }
}

hexo.extend.generator.register('tag-case-aliases', function () {
  // Hexo server serves its in-memory routes, so no files collide in preview.
  if (!['s', 'server'].includes(this.env.cmd) && !caseSensitive(this.public_dir)) return [];
  return Object.entries(aliases).map(([old, canonical]) => {
    const target = '/tags/' + canonical + '/';
    return {
      path: 'tags/' + old + '/index.html',
      data: '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="robots" content="noindex">' +
        '<link rel="canonical" href="' + target + '"><meta http-equiv="refresh" content="0;url=' + target + '">' +
        '<title>标签地址已更新</title><a href="' + target + '">查看标签</a></html>'
    };
  });
});

// The Git deployer copies public/ into .deploy_git before staging it. Both volumes
// must preserve case and the generated aliases must already be present.
hexo.on('deployBefore', () => {
  const staging = path.join(hexo.base_dir, '.deploy_git');
  const stagingVolume = fs.existsSync(staging) ? staging : hexo.base_dir;
  if (!caseSensitive(hexo.public_dir) || !caseSensitive(stagingVolume)) {
    throw new Error('Publish from a case-sensitive volume containing public/ and the Git deployment checkout. See docs/maintenance.md.');
  }
  for (const [old, canonical] of Object.entries(aliases)) {
    const page = name => fs.readFileSync(path.join(hexo.public_dir, 'tags', name, 'index.html'), 'utf8');
    if (!page(old).includes('0;url=/tags/' + canonical + '/') || !page(canonical).includes('/en/tags/' + canonical + '/')) {
      throw new Error('Build the current tag pages before deploying: ' + canonical);
    }
  }
});
