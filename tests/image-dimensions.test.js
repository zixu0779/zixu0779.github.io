const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const { reserveImages } = require('../scripts/image-dimensions');

(async () => {
  const html = '<p><img loading="lazy" data-src="https://example.test/a.png?a=1&amp;b=2" alt="A" /></p>' +
    '<img src="/b.webp" width="80" height="40"><img data-src="/missing.png">';
  const calls = [];
  const result = await reserveImages(html, async src => {
    calls.push(src);
    return src.startsWith('https:') ? [1600, 900] : null;
  });
  assert.ok(result.includes('width="1600" height="900"'));
  assert.ok(result.includes('loading="lazy" data-src='), 'the image remains lazy');
  assert.ok(result.includes('<img src="/b.webp" width="80" height="40">'), 'explicit author dimensions are preserved');
  assert.ok(result.includes('<img data-src="/missing.png">'), 'unavailable images are not assigned a fake size');
  assert.deepEqual(calls, ['https://example.test/a.png?a=1&b=2', '/missing.png']);
  assert.equal(await reserveImages(result, async () => null), result, 'repeated rendering does not duplicate dimensions');
  assert.equal(await reserveImages('<img src="/bad.png">', async () => [0, 90]), '<img src="/bad.png">');
  for (const [w, h, expected] of [[2560,1440,640], [2400,400,960], [1002,2813,1002*960/2813], [133,50,133]]) {
    const sized = await reserveImages('<img data-src="/screenshot.png">', async () => [w,h]);
    assert.ok(sized.includes(`--article-image-width:${expected}px`));
    assert.ok(sized.includes(`--article-image-ratio:${w}/${h}`), 'placeholder reserves the original aspect ratio');
  }
  const sample = '<img data-src="/simple.png">';
  assert.ok((await reserveImages(sample, async () => [642,360], {'/simple.png':320})).includes('--article-image-width:320px'));
  assert.ok((await reserveImages(sample, async () => [133,50], {'/simple.png':320})).includes('--article-image-width:133px'), 'overrides never upscale small images');
  assert.ok((await reserveImages(sample, async () => [642,360], {'/simple.png':-1})).includes('--article-image-width:640px'), 'invalid widths use the normal limit');
  assert.ok((await reserveImages(sample, async () => [1902,970], {'/simple.png':960})).includes('--article-image-width:960px'), 'dense captures may use a wider reviewed size');
  assert.ok((await reserveImages(sample, async () => [1002,2813], {'/simple.png':480})).includes('--article-image-width:480px'), 'reviewed tall images are not forced back into the generic height cap');
  const directory = await fs.mkdtemp(path.join(require('node:os').tmpdir(), 'hexo-image-size-'));
  try {
    await fs.writeFile(path.join(directory, 'sample.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=', 'base64'));
    const hooks = {};
    vm.runInNewContext(await fs.readFile('scripts/image-dimensions.js', 'utf8'), {
      require, module: { exports: {} }, URL, Buffer,
      hexo: { base_dir: directory, source_dir: directory, config: { url: 'https://local.test' },
        log: { warn: message => { throw new Error(message); } },
        extend: { filter: { register: (name, fn) => { hooks[name] = fn; } } } }
    });
    const article = '<article class="post block"><img loading="lazy" data-src="/sample.png"></article>';
    const reserved = await hooks['after_render:html'](article);
    assert.ok(reserved.includes('width="1" height="1"'));
    const cache = JSON.parse(await fs.readFile(path.join(directory, 'image-dimensions.json'), 'utf8'));
    assert.deepEqual(cache['/sample.png'], [1, 1], 'cache is saved during lazy route rendering, without waiting for after_generate');
    await fs.unlink(path.join(directory, 'sample.png'));
    hooks.before_generate();
    assert.equal(await hooks['after_render:html'](article), reserved, 'subsequent builds reuse cached dimensions');
    const outside = '<header><img src="/not-an-article.png"></header>';
    assert.equal(await hooks['after_render:html'](outside), outside, 'theme header images are left alone');
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
  console.log('Reserved image dimensions, lazy attributes, explicit sizes and unavailable images verified');
})().catch(error => { console.error(error); process.exitCode = 1; });
