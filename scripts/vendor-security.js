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
  const loader = `<script src="/js/vendor-loader.js" data-assets="${escapeHTML(JSON.stringify(assets))}"></script>`;
  html = html.replace('<head>', '<head>' + loader);
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs) => {
    const src = attrs.match(/\bsrc=["']([^"']+)["']/)?.[1];
    if (!src) return tag;
    if (src === busuanzi) return `<script>window.blogLoadVendor(${literal(src)}).catch(error=>console.warn("Statistics unavailable",error));</script>`;
    if (/^(?:https?:)?\/\//.test(src)) {
      if (!assets[src] || assets[src].kind !== 'js') throw new Error('Unregistered external script: ' + src);
      return `<script>window.blogVendorReady=Promise.all([window.blogVendorReady,window.blogLoadVendor(${literal(src)})]);</script>`;
    }
    if (/^\/js\/siteInit\.js(?:\?|$)/.test(src)) return `<script type="module">await window.blogVendorReady;await import(${literal(src)});</script>`;
    return tag;
  });
});
