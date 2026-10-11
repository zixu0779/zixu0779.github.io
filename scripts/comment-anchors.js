// ShokaX 0.4.17 treats a hash ID as a CSS selector; numeric Waline IDs throw.
// Patch generated assets only, keeping the installed theme untouched.
const fixHashLookup = source => source.replace(/document\.querySelector\(decodeURI\(([\w$]+)\)\)/g,
  (_, hash) => `document.getElementById(decodeURIComponent(${hash}.slice(1)))`);
if (typeof hexo !== 'undefined') hexo.extend.filter.register('after_generate', async () => {
  for (const path of hexo.route.list().filter(path => /^js\/.*\.js$/.test(path))) {
    let source = '';
    for await (const chunk of hexo.route.get(path)) source += chunk;
    const patched = fixHashLookup(source);
    if (patched !== source) hexo.route.set(path, patched);
  }
});
module.exports = { fixHashLookup };
