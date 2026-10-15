(async () => {
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { fixHashLookup, fixRecentExcerpt, fixCommentNavigation, fixPreviewSecurity } = require('../scripts/comment-anchors');
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
const preview=fixPreviewSecurity('return parser.parse(emoji(text,map))}');
assert.ok(preview.includes('sanitizeWalineHTML(parser.parse(emoji(text,map)))'));
assert.equal(fixPreviewSecurity(preview),preview);
assert.throws(()=>fixPreviewSecurity('changed parser'),/preview parser changed/);
const code=fs.readFileSync('source/js/site-ui.js','utf8');
const theme=fs.readFileSync('public/js/siteInit.js','utf8');
const fixed=fixCommentNavigation(theme);
assert.ok(fixed.includes('window.shokaXLoadComments='));
assert.ok(fixed.includes('rootMargin:window.innerHeight+"px 0px"'));
assert.ok(fixed.includes('if(!/^#[a-f0-9]{24}$/i.test(location.hash))'));
assert.equal(fixCommentNavigation(fixed),fixed);
const scrollTheme=fs.readFileSync('public/js/chunk-D7X35BKP.js','utf8');
assert.ok(fixCommentNavigation(scrollTheme).includes('window.shokaXPageScroll='));
assert.equal(fixCommentNavigation(fixCommentNavigation(scrollTheme)),fixCommentNavigation(scrollTheme));
assert.ok(!code.includes('commentCorrection') && !code.includes('}, 700)'),'no delayed snap interrupts navigation');
(async () => {
  const loaderCode=fixed.match(/let commentSection=document.getElementById\("comments"\);if\(commentSection\)\{[\s\S]*?observer\.observe\(commentSection\)\}/)[0].replace(/import\("[^"]+"\)/,'fakeImport()');
  let imports=0, initialized=0, callback, fail=true;
  const loader={window:{innerHeight:800,dispatchEvent:()=>{}},Event:class {},console:{error:()=>{}},document:{getElementById:()=>({isConnected:true})},IntersectionObserver:class {
    constructor(fn,options){callback=fn;assert.equal(options.rootMargin,'800px 0px');}
    observe(){} disconnect(){}
  },fakeImport:()=>{imports++;return fail?Promise.reject(new Error('offline')):Promise.resolve({walinePageview:()=>{},walineComment:()=>initialized++});}};
  vm.runInNewContext(loaderCode,loader);
  callback([{isIntersecting:false}]);assert.equal(imports,0,'distant comments stay lazy');
  await assert.rejects(loader.window.shokaXLoadComments());
  fail=false;
  const first=loader.window.shokaXLoadComments();assert.equal(loader.window.shokaXLoadComments(),first,'anchor and viewport share one request');
  await first;assert.equal(initialized,1);assert.equal(imports,2,'failed loading can retry');
  console.log('Earlier lazy loading, single-flight retry, shared smooth scroll and no delayed snaps verified');
})().catch(error=>{console.error(error);process.exitCode=1;});

})().catch(error=>{console.error(error);process.exitCode=1;});
