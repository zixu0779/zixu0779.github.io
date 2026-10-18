const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { escapeHTML } = require('hexo-util');
const assets = require('../lib/vendor-assets.json');
const busuanzi = 'https://unpkg.com/busuanzi@2.3.0/bsz.pure.mini.js';
const literal = value => JSON.stringify(value).replace(/</g, '\\u003c');

hexo.extend.filter.register('before_generate', () => {
  for (const [url, asset] of Object.entries(assets)) {
    const bytes = fs.readFileSync(path.join(hexo.source_dir, asset.local.slice(1)));
    const actual = 'sha384-' + crypto.createHash('sha384').update(bytes).digest('base64');
    if (actual !== asset.integrity) throw new Error('Local vendor integrity mismatch: ' + url);
  }
});
hexo.extend.filter.register('after_render:html', html => {
  const loader = `<script src="/js/vendor-loader.js" data-assets="${escapeHTML(JSON.stringify(assets))}"></script><script src="/js/statistics-frame.js" defer></script>`;
  html = html.replace('<head>', '<head>' + loader);
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs) => {
    const src = attrs.match(/\bsrc=["']([^"']+)["']/)?.[1];
    if (!src) return tag;
    if (src === busuanzi) return '<iframe data-statistics-frame src="/vendor/statistics-frame.html" sandbox="allow-scripts" title="访问统计" hidden></iframe>';
    if (/^(?:https?:)?\/\//.test(src)) {
      if (!assets[src] || assets[src].kind !== 'js') throw new Error('Unregistered external script: ' + src);
      return `<script>window.blogVendorReady=Promise.all([window.blogVendorReady,window.blogLoadVendor(${literal(src)})]);</script>`;
    }
    if (/^\/js\/siteInit\.js(?:\?|$)/.test(src)) return `<script type="module">await window.blogVendorReady;await import(${literal(src)});</script>`;
    return tag;
  });
});
// JSONP cannot have a fixed hash. Keep it in an opaque-origin sandbox with no
// parent DOM/storage access; only validated numeric counters cross the boundary.
hexo.extend.generator.register('statistics-sandbox', () => {
  const fallback = fs.readFileSync(path.join(hexo.source_dir, assets[busuanzi].local.slice(1)), 'utf8');
  return { path: 'vendor/statistics-frame.html', data: `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://busuanzi.ibruce.info; connect-src https://unpkg.com; upgrade-insecure-requests">
<span id="busuanzi_value_site_pv"></span><span id="busuanzi_value_site_uv"></span><span id="busuanzi_value_page_pv"></span>
<script>
const send=()=>{const result={type:'blog-statistics'};for(const key of ['site_pv','site_uv','page_pv']){const text=document.getElementById('busuanzi_value_'+key).textContent;if(/^\\d+$/.test(text)){const n=Number(text);if(Number.isSafeInteger(n))result[key]=n;}}parent.postMessage(result,'*');};
new MutationObserver(send).observe(document.body,{subtree:true,childList:true,characterData:true});
fetch(${literal(busuanzi)},{integrity:${literal(assets[busuanzi].integrity)},credentials:'omit',signal:AbortSignal.timeout(6000)}).then(r=>{if(!r.ok)throw Error(r.status);return r.text();}).catch(()=>${literal(fallback)}).then(code=>{const s=document.createElement('script');s.textContent=code;document.body.append(s);});
</script>` };
});
