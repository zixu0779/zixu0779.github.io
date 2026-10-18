const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const checkedReplace = require('../lib/checked-replace');
const { validateCommentPatches } = require('../scripts/comment-anchors');
assert.equal(checkedReplace('count: 10; timeout: 1000', 'count: 10', 'count: 5', 'count'), 'count: 5; timeout: 1000');
assert.throws(() => checkedReplace('changed', 'count: 10', '', 'count'), /found 0/);
assert.throws(() => checkedReplace('x x', /x/g, '', 'count'), /found 2/);
const sources = fs.readdirSync('public/js').filter(name => /^(?:siteInit\.js|(?:chunk|comments|tcomments)-[\w-]+\.js)$/.test(name)).map(name => fs.readFileSync('public/js/' + name, 'utf8'));
validateCommentPatches(sources, true);
assert.throws(() => validateCommentPatches(sources.map(source => source.replace('window.shokaXLoadComments=', 'window.changed=')), true), /shokaXLoadComments/);
assert.throws(() => validateCommentPatches([...sources, 'window.shokaXPageScroll='], true), /shokaXPageScroll/);
validateCommentPatches(sources.filter(source => !source.includes('sanitizeWalineHTML(')).map(source => source.replace('window.shokaXLoadComments=', 'window.changed=')), false);
// Simulate a later upstream mismatch: earlier staged replacements must not reach disk.
let writes = 0;
const patchCode = fs.readFileSync('lib/theme-patches.js', 'utf8');
const fakeRequire = name => name === 'node:fs' ? {
  readFileSync(file) { return file.endsWith('widgets.pug') ? 'site.posts.shuffle().limit(10).toArray()' : 'upstream changed'; },
  writeFileSync() { writes++; }
} : name === './checked-replace' ? checkedReplace : require(name);
fakeRequire.resolve = require.resolve;
assert.throws(() => vm.runInNewContext(patchCode, { require: fakeRequire }), /expected 1 match/);
assert.equal(writes, 0, 'a later mismatch must not partially patch earlier files');
console.log('Precise replacement, missing/duplicate output detection and validation-before-write verified');
