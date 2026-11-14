const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');

const directory = fs.mkdtempSync(path.join(process.argv[2] || os.tmpdir(), 'tag-case-test-'));
try {
  let generate, beforeDeploy;
  const hexo = {
    base_dir: directory, public_dir: path.join(directory, 'public'), env: { cmd: 'server' },
    extend: { generator: { register(name, fn) { generate = fn; } } },
    on(name, fn) { assert.equal(name, 'deployBefore'); beforeDeploy = fn; }
  };
  vm.runInNewContext(fs.readFileSync('scripts/tag-case-aliases.js', 'utf8'), {hexo, require});
  const preview = generate.call(hexo);
  const pairs = {shokaX: 'ShokaX', shellter: 'Shellter'};
  assert.equal(preview.length, 2);
  for (const [old, canonical] of Object.entries(pairs)) {
    const redirect = preview.find(page => page.path === 'tags/' + old + '/index.html');
    assert(redirect.data.includes('0;url=/tags/' + canonical + '/'));
  }

  fs.writeFileSync(path.join(directory, 'MixedCase'), '');
  const sensitive = !fs.existsSync(path.join(directory, 'mixedcase'));
  hexo.env.cmd = 'generate';
  const generated = generate.call(hexo);
  assert.equal(generated.length, sensitive ? 2 : 0);
  if (sensitive) {
    assert.throws(beforeDeploy, /ENOENT/);
    for (const entry of generated) {
      const dest = path.join(hexo.public_dir, entry.path);
      fs.mkdirSync(path.dirname(dest), {recursive: true});
      fs.writeFileSync(dest, entry.data);
    }
    for (const name of Object.values(pairs)) {
      const dest = path.join(hexo.public_dir, 'tags', name);
      fs.mkdirSync(dest, { recursive: true });
      fs.writeFileSync(path.join(dest, 'index.html'), '<a href="/en/tags/' + name + '/">English</a>');
    }
    beforeDeploy();
  } else {
    assert.throws(beforeDeploy, /case-sensitive volume/);
  }
  console.log('Tag case aliases verified on a case-' + (sensitive ? 'sensitive' : 'insensitive') + ' volume');
} finally {
  fs.rmSync(directory, {recursive: true, force: true});
}
