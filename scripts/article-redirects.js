// Merged articles retain their published addresses without duplicate archive entries.
hexo.extend.generator.register('merged-article-redirects', () => {
  const { english, files } = require('../lib/english-routes');
  const previous = hexo.locals.get('posts').toArray().filter(p => files.has(p.source)).map(p => ['en/' + p.path, english(p.path)]);
  const aliases = [
  ['网络安全/安全实验/反弹 Shell/', '网络安全/安全实验/反弹 Shell：连接原理与实现方式/'],
  ['博客建设/建站部署/云服务器建站准备/', '博客搭建/建站部署/用宝塔搭建 WordPress/#准备工作'],
  ['人工智能/机器学习/机器学习模型的优化/', '人工智能/机器学习/机器学习杂记/#模型优化检查']
].flatMap(([path, target]) => ['', 'en/'].map(prefix => {
  const [pathname, hash] = target.split('#');
  return [prefix + path, (prefix ? english(pathname) : pathname) + (hash ? '#' + hash : '')];
}));
  return [...aliases, ...previous].map(([path, target]) => {
  const url = encodeURI('/' + target);
  // A saved comment or section on a renamed article takes precedence over a default section.
  const preserveHash = `<script>if(location.hash)location.replace(${JSON.stringify(url.split('#')[0])}+location.hash)</script>`;
  const prefix = path.startsWith('en/');
  return {
    path: path + 'index.html',
    data: `<!doctype html><html lang="${prefix ? 'en' : 'zh-CN'}"><meta charset="utf-8"><meta name="robots" content="noindex">${preserveHash}<meta http-equiv="refresh" content="0;url=${url}"><title>${prefix ? 'Article moved' : '文章地址已更新'}</title><a href="${url}">${prefix ? 'Read the article' : '查看文章'}</a></html>`
  };
});
});
