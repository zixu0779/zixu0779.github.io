const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const callbacks = {};
let created;
const image = {
  dataset: {}, src: '/images/theme-showcase/sakura.jpg',
  closest: () => null,
  before: link => { created = link; }
};
const document = {
  currentScript: { dataset: { vendors: '{}' } },
  querySelectorAll: () => [image],
  createElement: () => ({ dataset: {}, tagName: 'A', append: () => {}, hasAttribute(name) { return name === 'data-pjax-state' && 'pjaxState' in this.dataset; } }),
  addEventListener: (type, callback) => { callbacks[type] = callback; }
};
vm.runInNewContext(fs.readFileSync('source/js/image-viewer.js', 'utf8'), {
  document, window: { addEventListener() {}, blogVendorReady: Promise.resolve() },
  jQuery: { fancybox: { defaults: {} } }, console
});
callbacks.DOMContentLoaded();
assert.equal(created.href, image.src);
assert.equal(created.dataset.fancybox, 'article');
// Exercise the installed PJAX parser: it must not attach article-navigation handlers.
global.HTMLCollection = class {};
global.NodeList = class {};
const Pjax = require('theme-shokax-pjax');
Pjax.prototype.parseDOM.call({ getElements: () => [created], attachLink() { assert.fail('PJAX captured an image link'); } }, document);
console.log('Local image links retain originals and are excluded from PJAX navigation');
