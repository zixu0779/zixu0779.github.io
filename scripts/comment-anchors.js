// ShokaX 0.4.17 treats a hash ID as a CSS selector; numeric Waline IDs throw.
// Patch generated assets only, keeping the installed theme untouched.
const fixHashLookup = source => source.replace(/document\.querySelector\(decodeURI\(([\w$]+)\)\)/g,
  (_, hash) => `document.getElementById(decodeURIComponent(${hash}.slice(1)))`);
// Waline 1.43.4 omits anonymous raw Markdown; use rendered text for recent excerpts.
const fixRecentExcerpt = source => source.replace(/([\w$]+)\.orig\.length/g,
  (_, item) => `(${item}.orig??=(new DOMParser().parseFromString(${item}.comment||"","text/html").body.textContent||"").trim()).length`);
const fixPreviewSecurity = source => {
  if (source.includes('sanitizeWalineHTML')) return source;
  let count = 0;
  const patched = source.replace(/return ([\w$]+)\.parse\(([\w$]+)\(([\w$]+),([\w$]+)\)\)\}/g, (_, parser, emoji, text, map) => {
    count++;
    return `return sanitizeWalineHTML(${parser}.parse(${emoji}(${text},${map})))}`;
  });
  if (count !== 1) throw new Error('Waline preview parser changed; review sanitization before building.');
  return 'import{sanitizeComment as sanitizeWalineHTML,prepareCommentAnchor}from"./comment-tools.js";window.shokaXPrepareCommentAnchor=prepareCommentAnchor;' + patched;
};
const fixCommentNavigation = source => source
  // Share the same 500ms easing used by saved-position restoration.
  .replace(/(?<![.\w$])([\w$]+)=\(([\w$]+),([\w$]+),([\w$]+)\)=>\{([\w$]+)\(\{targets:typeof ([\w$]+)=="number"/, '$1=window.shokaXPageScroll=($2,$3,$4)=>{$5({targets:typeof $6=="number"')
  // Comment anchors have their own load-then-scroll path; don't race it at 500ms.
  .replace(/setTimeout\(\(\)=>\{([\w$]+)\(\)\},500\)/g, 'setTimeout(()=>{if(!/^#[a-f0-9]{24}$/i.test(location.hash))$1()},500)')
  .replace(/let ([\w$]+)=document\.getElementById\("copyright"\);if\(\1\)\{let ([\w$]+)=new IntersectionObserver\([\s\S]*?;\2\.observe\(\1\)\}/g, block => {
    const module = block.match(/import\(("\.\/comments-[^"]+\.js")\)/)?.[1];
    if (!module) return block;
    return `let commentSection=document.getElementById("comments");if(commentSection){let loading;window.shokaXCommentSection=commentSection;let load=window.shokaXLoadComments=()=>loading??=(import(${module}).then(({walinePageview,walineComment})=>{if(commentSection.isConnected){walinePageview();walineComment()}}).catch(error=>{loading=null;throw error}));window.dispatchEvent(new Event("shokax:comments-ready"));let observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))load().then(()=>observer.disconnect()).catch(console.error)},{rootMargin:window.innerHeight+"px 0px",threshold:0});observer.observe(commentSection)}`;
  });
if (typeof hexo !== 'undefined') {
hexo.extend.generator.register('comment-tools', () => ({
  path: 'js/comment-tools.js',
  data: require('esbuild').buildSync({
    entryPoints: [require('node:path').join(hexo.source_dir, '_waline/comment-tools.js')],
    bundle: true, format: 'esm', platform: 'browser', target: 'es2022', minify: true, write: false
  }).outputFiles[0].text
}));
hexo.extend.filter.register('after_generate', async () => {
  for (const path of hexo.route.list().filter(path => /^js\/.*\.js$/.test(path))) {
    let source = '';
    for await (const chunk of hexo.route.get(path)) source += chunk;
    let patched = fixCommentNavigation(fixRecentExcerpt(fixHashLookup(source)));
    if (/^js\/comments-[\w-]+\.js$/.test(path)) patched = fixPreviewSecurity(patched);
    if (patched !== source) hexo.route.set(path, patched);
  }
});
}
module.exports = { fixHashLookup, fixRecentExcerpt, fixCommentNavigation, fixPreviewSecurity };
