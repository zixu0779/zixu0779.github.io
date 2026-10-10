const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
let options;
let payload;
const source = fs.readFileSync('source/_player/site-player.js', 'utf8').replace(/^import .*;$/gm, '');
vm.runInNewContext(source, {
  createMetingProvider: value => { options = value; },
  fetch: async () => new Response(JSON.stringify(payload)), Response,
  document: { getElementById: () => null, body: {} },
  MutationObserver: class { observe() {} }
});
(async () => {
  payload = [{ title: 'Halo', author: 'Beyoncé', url: 'https://example.com/song.mp3' }];
  const result = await (await options.fetchImpl('https://example.com')).json();
  assert.equal(result[0].name, 'Halo');
  assert.equal(result[0].artist, 'Beyoncé');
  payload = { error: 'unavailable' };
  await assert.rejects(options.fetchImpl('https://example.com'), /Invalid playlist/);
  payload = [{ url: 'javascript:invalid' }];
  await assert.rejects(options.fetchImpl('https://example.com'), /Invalid song/);
  console.log('Legacy playlist compatibility and invalid response handling verified');
})().catch(error => { console.error(error); process.exitCode = 1; });
