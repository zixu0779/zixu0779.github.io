const assert = require('node:assert/strict');
const { activityHistory, safeURL } = require('../lib/steam-sync.cjs');
const view = require('../lib/steam-view.cjs');
const initial = activityHistory(null,[{appid:1,minutes:100}],'2026-11-04T00:17:00Z');
assert.deepEqual(initial.history,[]);
const previous = { ...initial, updatedAt:'2026-11-04T00:17:00Z' };
assert.deepEqual(activityHistory(previous,[{appid:1,minutes:160},{appid:2,minutes:5000}],'2026-11-05T00:17:00Z').history,[{date:'2026-11-05',minutes:60}]);
assert.deepEqual(activityHistory(previous,[{appid:1,minutes:200}],'2026-11-07T00:17:00Z').history,[{date:'2026-11-07',minutes:null}]);
assert.equal(activityHistory(previous,[{appid:1,minutes:90}],'2026-11-05T00:17:00Z').history[0].minutes,0);
assert.equal(activityHistory(previous,[{appid:1,minutes:130}],'2026-11-04T01:17:00Z').history.length,0);
assert.equal(safeURL('https://steamstatic.com.attacker.invalid/image'),null);
assert.equal(safeURL('http://steamstatic.com/image'),null);
assert.equal(safeURL('https://shared.fastly.steamstatic.com/test.jpg'),'https://shared.fastly.steamstatic.com/test.jpg');
assert.equal(view(null),null);
const sample = view({updatedAt:previous.updatedAt, games:[],history:[]});
assert.equal(sample.history.length,14);
assert(sample.history.every(x=>x.minutes===null));
console.log('Steam history gaps, baseline, metadata URL boundary and missing data: passed');
const { replaceFragment } = require('../lib/steam-publish.cjs');
const before = '<header>keep</header><template id="steam-card-start"></template>old<template id="steam-card-end"></template><footer>keep</footer>';
assert.equal(replaceFragment(before,'card','NEW'),'<header>keep</header>NEW<footer>keep</footer>');
assert.throws(()=>replaceFragment('missing','card','NEW'));
assert.throws(()=>replaceFragment(before+before,'card','NEW'));
const sameDay = activityHistory(previous,[{appid:1,minutes:130}],'2026-11-04T01:17:00Z');
assert.equal(sameDay.baseline[1],100,'manual rerun must not discard increments before the next day');

const library = [{appid:1,minutes:900,recentMinutes:10,lastPlayed:30,metadata:{type:'application',tags:['软件']}},{appid:2,minutes:120,recentMinutes:5,lastPlayed:20,metadata:{type:'game',tags:[]}}];
const gameView=view({updatedAt:previous.updatedAt,games:library,history:[],featuredAppid:1,hero:'/software.jpg'});
assert.equal(gameView.featured.appid,2);
assert.equal(gameView.totalMinutes,120);
assert.equal(gameView.recentMinutes,5);
assert.equal(gameView.gameCount,1);
assert.notEqual(gameView.hero,'/software.jpg');
assert.equal(activityHistory({...previous,baseline:{1:800,2:100}},library,'2026-11-05T00:17:00Z').history[0].minutes,20);

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const checkout = fs.mkdtempSync(path.join(os.tmpdir(), 'steam-fragments-'));
try {
  fs.mkdirSync(path.join(checkout, 'js'));
  const snapshot = JSON.parse(fs.readFileSync('source/_data/steam.json', 'utf8'));
  const localTitles = require('js-yaml').load(fs.readFileSync('en/steam-titles.yml', 'utf8'));
  const game = view(snapshot, {}, localTitles).featured;
  for (const lang of ['', 'en/']) {
    for (const [dir, kind] of [['about','card'], ['steam','detail']]) {
      const folder = path.join(checkout, lang, dir);
      fs.mkdirSync(folder, {recursive:true});
      fs.writeFileSync(path.join(folder, 'index.html'), before.replaceAll('steam-card-', 'steam-' + kind + '-'));
    }
    // Exercise both an older Chinese-only checkout and a bilingual one.
    execFileSync(process.execPath, ['lib/steam-publish.cjs', checkout]);
    const card = fs.readFileSync(path.join(checkout, lang, 'about/index.html'), 'utf8');
    const detail = fs.readFileSync(path.join(checkout, lang, 'steam/index.html'), 'utf8');
    assert(card.includes('href="/' + lang + 'steam/"'));
    assert(detail.includes('href="/' + lang + 'about/#about-steam"'));
    assert(card.includes(lang ? 'Most played' : '游玩最多'));
    if (lang && game) assert(require('hexo-util').unescapeHTML(card).includes(game.name));
    assert(detail.includes(lang ? 'Library' : '游戏库'));
  }
} finally {
  fs.rmSync(checkout, { recursive: true, force: true });
}
