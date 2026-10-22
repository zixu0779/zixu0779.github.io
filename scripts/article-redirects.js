// Merged articles retain their published addresses without duplicate archive entries.
hexo.extend.generator.register('merged-article-redirects', () => [
  ['博客建设/建站部署/云服务器建站准备/', '博客搭建/建站部署/用宝塔搭建 WordPress/#准备工作'],
  ['人工智能/机器学习/机器学习模型的优化/', '人工智能/机器学习/机器学习杂记/#模型优化检查']
].map(([path, target]) => {
  const url = encodeURI('/' + target);
  return {
    path: path + 'index.html',
    data: `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${url}"><title>文章已合并</title><a href="${url}">查看合并后的文章</a></html>`
  };
}));
