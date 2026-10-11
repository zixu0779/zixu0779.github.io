const { escapeHTML } = require('hexo-util');
hexo.extend.helper.register('archive_row', function (post, format = 'MM-DD', showCategory = true) {
  const category = post.categories.toArray().slice(-1)[0];
  return `<article class="item normal" itemscope itemtype="http://schema.org/Article"><div class="meta"><time itemprop="dateCreated" datetime="${post.date.toISOString()}">${this.date(post.date, format)}</time>${showCategory && category ? `<a href="${this.url_for(category.path)}">${escapeHTML(category.name)}</a>` : ''}</div><div class="title"><a href="${this.url_for(post.path)}" itemprop="url"><span itemprop="name">${escapeHTML(post.title)}</span></a></div></article>`;
});
