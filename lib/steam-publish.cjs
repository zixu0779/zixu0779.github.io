const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ejs = require(require.resolve('ejs', { paths: [require.resolve('hexo-renderer-ejs')] }));
const steamView = require('./steam-view.cjs');
const yaml = require('js-yaml');
function replaceFragment(html, kind, rendered) {
  const re = new RegExp(`<template\\s+id=["']?steam-${kind}-start["']?\\s*><\\/template>[\\s\\S]*?<template\\s+id=["']?steam-${kind}-end["']?\\s*><\\/template>`, 'g');
  const matches = [...html.matchAll(re)];
  if (matches.length !== 1) throw new Error(`Expected one ${kind} fragment, found ${matches.length}; refusing to change published HTML`);
  return html.replace(re, () => rendered);
}
function main() {
  const dest = process.argv[2];
  if (!dest) throw new Error('Usage: node lib/steam-publish.cjs <published-checkout>');
  const snapshot = JSON.parse(fs.readFileSync('source/_data/steam.json','utf8'));
  const displayPath='source/_data/steam-display.json';
  const display=fs.existsSync(displayPath)?JSON.parse(fs.readFileSync(displayPath,'utf8')):{};
  const changes = [];
  const languages = fs.existsSync(path.join(dest, 'en')) ? ['zh-CN', 'en'] : ['zh-CN'];
  for (const language of languages) {
    const english = language === 'en';
    const labels = english ? yaml.load(fs.readFileSync('en/ui.yml', 'utf8')) : {};
    const titles = english ? yaml.load(fs.readFileSync('en/steam-titles.yml', 'utf8')) : null;
    const view = steamView(snapshot, display, titles);
    for (const [kind, directory] of [['card', 'about'], ['detail', 'steam']]) {
      const file = path.join(dest, english ? 'en' : '', directory, 'index.html');
      const rendered = ejs.render(fs.readFileSync(`source/_layouts/steam-${kind}.ejs`, 'utf8'), {
        page: {language}, steam_view: () => view, site_label: label => labels[label] ?? label
      });
      changes.push([file, replaceFragment(fs.readFileSync(file, 'utf8'), kind, rendered)]);
    }
  }
  // Validate all page targets before replacing any fragments.
  for (const [file,html] of changes) fs.writeFileSync(file,html);
  const script = fs.readFileSync('source/js/site-ui.js');
  const version = crypto.createHash('sha256').update(script).digest('hex').slice(0,12);
  fs.copyFileSync('source/js/site-ui.js',path.join(dest,'js/site-ui.js'));
  // Update the shared script version on every entry page so PJAX also gets sorting.
  function updateScripts(dir) {
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      if (entry.name.startsWith('.')) continue;
      const file=path.join(dir,entry.name);
      if(entry.isDirectory()) updateScripts(file);
      else if(entry.name.endsWith('.html')) {
        const html=fs.readFileSync(file,'utf8');
        const updated=html.replace(/\/js\/site-ui\.js\?v=[a-f0-9]+/g,'/js/site-ui.js?v='+version);
        if(updated!==html) fs.writeFileSync(file,updated);
      }
    }
  }
  updateScripts(dest);
  fs.mkdirSync(path.join(dest,'data'),{recursive:true});
  fs.copyFileSync('source/_data/steam.json',path.join(dest,'data/steam.json'));
  fs.cpSync('source/images/steam',path.join(dest,'images/steam'),{recursive:true});
  fs.mkdirSync(path.join(dest,'css'),{recursive:true});
  fs.copyFileSync('source/css/steam.css',path.join(dest,'css/steam.css'));
}
module.exports = {replaceFragment};
if (require.main === module) main();
