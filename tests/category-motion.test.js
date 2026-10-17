const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('source/js/site-ui.js', 'utf8');
const rows = Array.from({length:12}, () => ({hidden:false}));
const listeners = {}, animations = [], nav = {dataset:{paginationPage:0}}, navs = [nav, {dataset:{paginationPage:1}}, {dataset:{paginationPage:2}}];
let reduceMotion = false, scrolls = 0;
const content = {
  getBoundingClientRect: () => ({height: rows.filter(row=>!row.hidden).length*50 + (navs.some(nav=>!nav.hidden)?60:0)}),
  animate: (frames, options) => {const animation = {frames,options,playState:'running',cancel(){this.playState='idle';}}; animations.push(animation); return animation;}
};
const details = {dataset:{},open:false,querySelectorAll:selector=>selector==='[data-pagination-page]'?navs:rows,closest:()=>({parentElement:{}}),addEventListener:(name,fn)=>listeners[name]=fn,
  querySelector:selector=>selector==='.category-content'?content:null};
vm.runInNewContext(code.slice(code.indexOf("    document.querySelectorAll('.category-group details"),code.indexOf('    const topButton')), {
 document:{querySelectorAll:selector=>selector.includes('not([data-ready])')?[details]:[]},reducedMotion:()=>reduceMotion,categorySize:{observe(){}},scheduleLayout(){},locateCategory(){},categoryAnchor:details,scrollToTarget(){scrolls++;},Event
});
const finish = animation => { animation.playState = 'finished'; animation.onfinish?.(); };
const summary = () => listeners.click({target:{closest:selector=>selector==='summary'?{}:null},preventDefault(){}});
const paginate = (targetPage) => listeners.click({target:{closest:selector=>selector==='summary'?null:{disabled:false,dataset:{categoryPage:String(targetPage)}}},preventDefault(){}});
summary();
assert.deepEqual(JSON.parse(JSON.stringify(animations.at(-1).frames)),[{height:'0px'},{height:'310px'}]);
finish(animations.at(-1));
paginate(2);
assert.deepEqual(navs.map(nav=>nav.hidden),[false,true,true], 'old page stays visible during fade-out');
assert.equal(animations.at(-1).frames[1].opacity, 0);
finish(animations.at(-1));
assert.equal(animations.at(-1).frames[0].opacity, 0);
const duringFade = animations.length;
paginate(3);
assert.equal(animations.length, duringFade, 'ignore rapid clicks during a page fade');
finish(animations.at(-1));
paginate(3);
finish(animations.at(-1));
assert.deepEqual(navs.map(nav=>nav.hidden),[true,true,false]);
assert.deepEqual(JSON.parse(JSON.stringify(animations.at(-2).frames)),[{height:'310px'},{height:'160px'}]);
assert.equal(animations.at(-2).options.duration,240);
finish(animations.at(-2));
summary();assert.equal(details.open,true,'closing keeps content present until the shared height animation ends');
assert.deepEqual(JSON.parse(JSON.stringify(animations.at(-1).frames)),[{height:'160px'},{height:'0px'}]);
finish(animations.at(-1));assert.equal(details.open,false);
summary();finish(animations.at(-1));
paginate(2);
const pendingFade = animations.at(-1);
summary();
assert.equal(pendingFade.playState, 'idle', 'closing cancels pending page replacement');
finish(animations.at(-1));
reduceMotion = true;
summary();finish(animations.at(-1));
paginate(2);
assert.deepEqual(navs.map(nav=>nav.hidden),[true,false,true], 'reduced motion switches immediately');
assert.equal(animations.at(-1).options.duration, 0);
console.log('Opening, pagination contraction and closing reuse the same height animation');

details.isConnected = true;
listeners['category:open']();
assert.equal(scrolls, 1, 'anchor scroll starts without waiting for expansion to finish');
assert.equal(details.open, true);
assert.equal(details.dataset.expanded, 'true');
assert.deepEqual(navs.map(nav=>nav.hidden), [false,true,true], 'anchor navigation resets pagination to page one');
