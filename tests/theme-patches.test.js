const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { transformSync } = require('esbuild');
require('../lib/theme-patches');
const read = name => fs.readFileSync(`node_modules/hexo-theme-shokax/source/js/_app/globals/${name}.ts`, 'utf8');
const compile = code => transformSync(code.replace(/^export /gm, ''), { loader: 'ts' }).code;
const outime = compile(read('thirdparty').split('export const isOutime')[1].replace(/^/, 'const isOutime'));
let now = new Date('2026-01-01T12:00:00');
function notice(updated, published = '2020-01-01T12:00:00') {
  let html;
  const times = [published, updated].filter(Boolean).map(dateTime => ({ dateTime }));
  vm.runInNewContext(outime + '\nisOutime();', {
    Date: class extends Date { static now() { return +now; } },
    document: { getElementsByTagName: () => times, getElementsByClassName: () => [{ insertAdjacentHTML(position, value) { assert.equal(position, 'afterbegin'); html = value; } }] },
    LOCAL: { template: '{{publishDate}}/{{updated}}' }
  });
  return html;
}
assert.equal(notice('2025-12-31T12:00:00'), '2020年1月1日/1', 'previous calendar year shows even after only one day');
assert.equal(notice('2026-01-01T00:00:00'), '2020年1月1日/0', 'current-year updates do not hide old publications');
assert.equal(notice('2026-01-01T00:00:00', '2026-01-01T00:00:00'), undefined, 'current-year publications stay hidden');
assert.equal(notice(undefined, '2027-01-01T00:00:00'), undefined, 'future publications stay hidden');
assert.equal(notice(undefined), '2020年1月1日/2192', 'no update time retains publication fallback');
assert.equal(notice('2025-12-31T12:00:00', '2020-01-02T00:30:00+08:00'), '2020年1月2日/1', 'publication date retains the article timezone');
now = new Date('2026-10-17T12:00:00');
assert.equal(notice('2026-01-01T12:00:00', '2026-01-01T12:00:00'), undefined, 'same-year publications stay hidden even after 90 days');
assert.equal(notice('2026-10-17T12:00:00'), '2020年1月1日/0', 'an update today retains the publication-based notice');
const position = compile('const positionInit' + read('tools').split('export const positionInit')[1].split('/*')[0]);
for (const category of [true, false]) {
  let scrolls = 0;
  vm.runInNewContext(position + '\npositionInit();', {
    window: { location: { hash: '#target' } }, LOCAL_HASH: 0,
    document: { querySelector: () => ({ matches: () => category }) },
    pageScroll: () => scrolls++, setLocalHash() {}
  });
  assert.equal(scrolls, category ? 0 : 1, 'theme leaves category scrolling to site-ui');
}
const initSource = fs.readFileSync('node_modules/hexo-theme-shokax/source/js/_app/pjax/siteInit.ts', 'utf8');
const readyInit = initSource.slice(initSource.indexOf("if (document.readyState === 'loading')"), initSource.indexOf("console.log('%c Theme"));
for (const readyState of ['loading', 'interactive', 'complete']) {
  let calls = 0;
  let listener;
  vm.runInNewContext(readyInit, {
    document: { readyState }, siteInit: () => calls++,
    window: { addEventListener(event, callback, options) {
      assert.equal(event, 'DOMContentLoaded'); assert.equal(options.once, true); listener = callback;
    } }
  });
  assert.equal(calls, readyState === 'loading' ? 0 : 1);
  if (listener) { listener(); assert.equal(calls, 1); }
}
console.log('Theme notices, category scroll ownership and delayed initialization verified');
