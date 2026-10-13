const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { fixHashLookup, fixRecentExcerpt } = require('../scripts/comment-anchors');
const excerpt = 'item.orig.length>50?item.orig.substring(0,50)+"...":item.orig';
const patchedExcerpt = fixRecentExcerpt(excerpt);
assert.equal(fixRecentExcerpt(patchedExcerpt), patchedExcerpt);
for (const item of [{orig:'Old Markdown'}, {comment:'Rendered text'}, {comment:''}]) {
  const expected = item.orig ?? item.comment;
  const result = vm.runInNewContext(patchedExcerpt, {item, DOMParser: class {
    parseFromString(text) { return {body:{textContent:text}}; }
  }});
  assert.equal(result, expected);
}
assert.equal(fixHashLookup('target=document.querySelector(decodeURI(anchor))'), 'target=document.getElementById(decodeURIComponent(anchor.slice(1)))');
assert.equal(fixHashLookup('document.querySelector(".other")'), 'document.querySelector(".other")');
const calls=[], section={contains:target=>target?.comment}, copyright={scrollIntoView:()=>calls.push('load')}, target={comment:true,isConnected:true,scrollIntoView:()=>calls.push('target')};
let loaded=false;
const location={pathname:'/about/',hash:''};
const context={location,document:{getElementById:id=>id==='comments'?section:id==='copyright'?copyright:loaded?target:null},setTimeout:()=>{}};
vm.createContext(context);
const code=fs.readFileSync('source/js/site-ui.js','utf8');
vm.runInContext(code.slice(code.indexOf('  let commentAnchor;'),code.indexOf("  window.addEventListener('hashchange'")),context);
vm.runInContext('locateComment()',context);assert.deepEqual(calls,[],'ordinary page visits do not trigger comment loading');
location.hash='#爱好';vm.runInContext('locateComment()',context);assert.deepEqual(calls,[],'ordinary heading anchors retain lazy comment loading');
location.hash='#69943657b70cb32a7e901789';
vm.runInContext('locateComment()',context);assert.deepEqual(calls,['load']);
vm.runInContext('locateComment()',context);assert.deepEqual(calls,['load'],'loading is triggered once');
loaded=true;vm.runInContext('locateComment()',context);assert.deepEqual(calls,['load','target']);
vm.runInContext('locateComment()',context);assert.deepEqual(calls,['load','target'],'later DOM changes do not repeatedly jump');
location.hash='#爱好';vm.runInContext('locateComment()',context);assert.equal(calls.length,2);
location.hash='#69943657b70cb32a7e901789';vm.runInContext('locateComment()',context);assert.equal(calls.length,3);
console.log('Numeric hash lookup, lazy comment loading and one-time target positioning verified');
