const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assets = require('../lib/vendor-assets.json');
const filters={}, generators={};
global.hexo={source_dir:path.resolve('source'),extend:{filter:{register:(name,fn)=>filters[name]=fn},generator:{register:(name,fn)=>generators[name]=fn}}};
require('../scripts/vendor-security');
filters.before_generate();
assert.throws(()=>filters['after_render:html']('<head></head><script src="https://unknown.invalid/a.js"></script>'),/Unregistered/);
const page=filters['after_render:html']('<head></head><script src="https://unpkg.com/busuanzi@2.3.0/bsz.pure.mini.js"></script><script src="/js/siteInit.js?v=0.4.17"></script>');
assert.match(page,/sandbox="allow-scripts"/);assert.ok(!page.includes('allow-same-origin'));
assert.match(page,/await window.blogVendorReady;await import/);
assert.ok(generators['statistics-sandbox']().data.includes('Number.isSafeInteger'));
(async()=>{
 const url=Object.keys(assets)[1];
 for(const failure of [false,true]){
  const requests=[], executed=[];
  const context={window:{},Map,Promise,JSON,Error,AbortSignal,document:{currentScript:{dataset:{assets:JSON.stringify(assets)}},createElement:()=>({dataset:{}}),head:{append:e=>executed.push(e.textContent)}},fetch:async (source,options)=>{
   requests.push(source);assert.equal(options.integrity,assets[url].integrity);assert.equal(options.credentials,'omit');
   if(failure&&source===url)throw Error('CDN integrity/network failure');
   return {ok:true,text:async()=> 'verified bytes'};
  }};
  vm.runInNewContext(fs.readFileSync('source/js/vendor-loader.js','utf8'),context);
  const first=context.window.blogLoadVendor(url);assert.equal(context.window.blogLoadVendor(url),first);
  await first;assert.deepEqual(executed,['verified bytes']);
  assert.deepEqual(requests,failure?[url,assets[url].local]:[url]);
  await assert.rejects(context.window.blogLoadVendor('https://unknown.invalid/a.js'),/Unregistered/);
 }
 console.log('Vendor hashes, rejection, sandbox isolation contract and single-flight fallback verified');
})().catch(e=>{console.error(e);process.exitCode=1;});
