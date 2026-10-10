const { join } = require('node:path');
const { build } = require('esbuild');
hexo.extend.generator.register('site-player', async () => {
  const result = await build({ entryPoints: [join(hexo.source_dir, '_player/site-player.js')], bundle: true, platform: 'browser', format: 'esm', minify: true, write: false, outfile: 'site-player.js' });
  return result.outputFiles.map(file => ({ path: file.path.endsWith('.css') ? 'css/site-player.css' : 'js/site-player.js', data: file.text }));
});
hexo.extend.filter.register('theme_inject', injects => {
  injects.head.raw('site-player-style', '<link rel="stylesheet" href="/css/site-player.css">');
  injects.bodyEnd.raw('site-player-script', '<script type="module" src="/js/site-player.js"></script>');
});
