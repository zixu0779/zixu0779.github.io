const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync('source/js/site-ui.js', 'utf8');

let now = 0, sequence = 0, loaded = false, commentTop = 3300, sectionTop = 3000, reduced = false;
const frames = new Map(), events = new Map();
const root = { scrollTop: 0, scrollHeight: 6000, clientHeight: 800, style: {} };
const target = { comment: true, isConnected: true, contains: () => false, getBoundingClientRect: () => ({ top: commentTop - root.scrollTop }) };
const section = { id: 'comments', isConnected: true, contains: node => node?.comment,
  getBoundingClientRect: () => ({ top: sectionTop - root.scrollTop }),
  querySelector: selector => selector === '.wl-cards' && loaded ? {} : null };
const location = { pathname: '/about/', hash: '#69943657b70cb32a7e901789' };
let loads = 0, preparations = 0;
const context = { console, location, section, reducedMotion: () => reduced,
  performance: { now: () => now }, Node: { DOCUMENT_POSITION_FOLLOWING: 4 },
  requestAnimationFrame: fn => { frames.set(++sequence, fn); return sequence; },
  cancelAnimationFrame: id => frames.delete(id),
  document: { scrollingElement: root, querySelectorAll: () => [],
    getElementById: id => id === 'comments' ? section : id === 'nav' ? { getBoundingClientRect: () => ({ height: 50 }) } : loaded ? target : null },
  window: { shokaXCommentSection: section, shokaXLoadComments: () => { loads++; return Promise.resolve(); },
    shokaXPrepareCommentAnchor: () => { preparations++; return Promise.resolve(); },
    addEventListener: (name, fn) => { if (!events.has(name)) events.set(name, new Set()); events.get(name).add(fn); },
    removeEventListener: (name, fn) => events.get(name)?.delete(fn) }
};
vm.createContext(context);
vm.runInContext(code.slice(code.indexOf('  const commentTarget'), code.indexOf('  const updateAvatar')), context);
vm.runInContext(code.slice(code.indexOf('  let commentAnchor;'), code.indexOf("  window.addEventListener('hashchange'")), context);
const advance = ms => { now += ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); };
const dispatch = (name, key) => [...events.get(name) || []].forEach(fn => fn({ type: name, key }));

vm.runInContext('locateComment()', context);
advance(100);
assert.ok(root.scrollTop > 0 && !loaded, 'scroll starts before comments or images finish loading');
assert.equal(loads, 1);
vm.runInContext('locateComment()', context);
assert.equal(loads, 1, 'DOM updates share the existing request and scroll');
loaded = true;
advance(400);
assert.ok(Math.abs(root.scrollTop - (commentTop - 50)) < 25, 'the destination follows a comment that appears during the first scroll');
assert.equal(preparations, 2, 'images are prepared for the section, then for the actual comment');
commentTop += 600;
advance(16);
assert.ok(root.scrollTop > 3250 && root.scrollTop < 3850, 'late layout movement is corrected smoothly, not snapped');
for (let i = 0; i < 30; i++) advance(32);
assert.ok(Math.abs(root.scrollTop - (commentTop - 50)) < 1);
assert.equal(frames.size, 0, 'tracking stops once content and position settle');

vm.runInContext('scrollToTarget(section)', context);
advance(100);
dispatch('keydown', 'a');
assert.ok(frames.size, 'typing does not cancel navigation');
dispatch('wheel');
const stoppedAt = root.scrollTop;
sectionTop += 400;
advance(600);
assert.equal(root.scrollTop, stoppedAt, 'manual scrolling cancels all pending corrections');
assert.equal(root.style.scrollBehavior, undefined, 'original scrolling styles are restored');

vm.runInContext('scrollToTarget(section)', context);
dispatch('keydown', 'PageDown');
assert.equal(frames.size, 0, 'keyboard scrolling also cancels');
vm.runInContext('scrollToTarget(section)', context);
location.hash = '#爱好';
advance(32);
assert.equal(frames.size, 0, 'leaving the target cancels pending navigation');
reduced = true;
vm.runInContext('scrollToTarget(section)', context);
advance(16);
assert.equal(root.scrollTop, sectionTop - 50, 'reduced motion aligns immediately');
dispatch('touchstart');
loaded = false;
vm.runInContext('scrollToTarget(section)', context);
advance(8100);
assert.equal(frames.size, 0, 'a failed or stalled request cannot keep controlling scroll indefinitely');
console.log('Immediate scrolling, late layout tracking, single navigation, cancellation and reduced motion verified');

section.id = 'category-AI-深度学习';
location.pathname = '/categories/';
location.hash = '#category-AI-深度学习';
const beforeCategory = preparations;
vm.runInContext('scrollToTarget(section, section)', context);
advance(16);
assert.equal(root.scrollTop, sectionTop - 50, 'category anchors respect the fixed navigation height');
assert.equal(preparations, beforeCategory, 'category navigation does not prepare or load comments');
for (let i = 0; i < 30; i++) advance(32);
assert.equal(frames.size, 0, 'category scrolling settles without waiting for comment widgets');
