const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('source/js/site-ui.js', 'utf8');
const filters = ['all', 'recent'].map(filter => ({ dataset: { filter }, setAttribute(name, value) { this[name] = value; } }));
const games = [true, true, false].map(recent => ({ hasAttribute: () => recent }));
const section = { querySelector: () => null, querySelectorAll: selector => selector === '.game' ? games : filters };
filters.forEach(button => button.closest = () => section);
let click;
vm.runInNewContext(source.slice(source.indexOf('  // Game filters'), source.indexOf('  const refresh =')), {
  document: { addEventListener: (_, handler) => { click = handler; } }
});
click({ target: { closest: () => filters[1] } });
assert.deepEqual(games.map(game => game.hidden), [false, false, true]);
assert.equal(filters[1]['aria-pressed'], 'true');
click({ target: { closest: () => filters[0] } });
assert(games.every(game => !game.hidden));
click({ target: { closest: () => null } });
const about = fs.readFileSync('public/about/index.html', 'utf8');
assert(about.indexOf('id="about-steam"') < about.indexOf('id="about-modules"'));
assert(!about.includes('fade-before'));
assert(!source.includes('authorObserver'));
console.log('Steam filters, module order and immediate rendering: passed');
