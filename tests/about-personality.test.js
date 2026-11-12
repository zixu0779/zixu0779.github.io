const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { createRequire } = require('node:module');
const ejs = createRequire(require.resolve('hexo-renderer-ejs'))('ejs');
const yaml = require('js-yaml');
const root = join(__dirname, '..');
const template = readFileSync(join(root, 'source/_layouts/about-modules.ejs'), 'utf8');
const personality = yaml.load(readFileSync(join(root, 'source/_data/about_personality.yml'), 'utf8'));
const labels = yaml.load(readFileSync(join(root, 'en/ui.yml'), 'utf8'));
const render = (language = 'zh-CN') => ejs.render(template, {
  site: { data: { about_personality: personality } },
  site_label: label => language === 'en' ? labels[label] ?? label : label
});
personality.previous = null;
assert(!render().includes('id="about-nature"'));
assert(!render().includes('caption old'));
personality.previous = { type: 'infp', name: '调停者', traits: [48, 74, 79, 51, 58] };
assert(render().includes('id="about-nature"'));
assert(render().includes('caption old infp'));
assert(render().includes('aria-label="查看上次人格结果"'));
assert(render('en').includes('aria-label="Show previous result"'));
personality.previous.traits[0] = 101;
assert.throws(render, /Invalid personality percentage/);
console.log('Optional previous personality result: passed');
