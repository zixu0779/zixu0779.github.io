const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('source/js/site-ui.js', 'utf8');
const rows = Array.from({length:12}, () => ({hidden:false}));
const listeners = {}, animations = [], label = {}, previous = {}, next = {}, nav = {};
const content = {
  getBoundingClientRect: () => ({height: rows.filter(row=>!row.hidden).length*50 + (nav.hidden?0:60)}),
  animate: (frames, options) => {const animation = {frames,options,cancel(){}}; animations.push(animation); return animation;}
};
const details = {dataset:{},open:false,querySelectorAll:()=>rows,closest:()=>({parentElement:{}}),addEventListener:(name,fn)=>listeners[name]=fn,
  querySelector:selector=>selector==='.category-content'?content:selector==='.category-pagination'?nav:selector.includes('.page-number')?label:selector.includes('"-1"')?previous:next};
vm.runInNewContext(code.slice(code.indexOf("    document.querySelectorAll('.category-group details"),code.indexOf('    const sidebarMenu')), {
 document:{querySelectorAll:selector=>selector.includes('not([data-ready])')?[details]:[]},reducedMotion:()=>false,categorySize:{observe(){}},scheduleLayout(){},Event
});
const summary = () => listeners.click({target:{closest:selector=>selector==='summary'?{}:null},preventDefault(){}});
const paginate = () => listeners.click({target:{closest:selector=>selector==='summary'?null:{disabled:false,dataset:{categoryPage:'1'}}}});
summary();
assert.deepEqual(JSON.parse(JSON.stringify(animations.at(-1).frames)),[{height:'0px'},{height:'310px'}]);
animations.at(-1).onfinish();
paginate();animations.at(-1).onfinish();
paginate();
assert.equal(label.textContent,'3 / 3');assert.equal(next.disabled,true);
assert.deepEqual(JSON.parse(JSON.stringify(animations.at(-1).frames)),[{height:'310px'},{height:'160px'}]);
assert.equal(animations.at(-1).options.duration,240);
animations.at(-1).onfinish();
summary();assert.equal(details.open,true,'closing keeps content present until the shared height animation ends');
assert.deepEqual(JSON.parse(JSON.stringify(animations.at(-1).frames)),[{height:'160px'},{height:'0px'}]);
animations.at(-1).onfinish();assert.equal(details.open,false);
console.log('Opening, pagination contraction and closing reuse the same height animation');
