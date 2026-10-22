const { escapeHTML } = require('hexo-util');
const categoryOrder = require('../lib/category-order');
const anchor = category => 'category-' + category.path.replace(/^categories\//, '').replace(/\/$/, '').replace(/\//g, '-');
hexo.extend.filter.register('before_generate', () => hexo.extend.generator.register('category', () => []));
// Both the theme and the expandable directory use Hexo's paginator and theme options.
hexo.extend.helper.register('site_pagination', function (options = {}) {
  if ((options.total ?? this.page.total) <= 1) return '';
  return this.paginator({
    prev_text: '<i class="ic i-angle-left" aria-label="' + this.__('accessibility.prev_page') + '"></i>',
    next_text: '<i class="ic i-angle-right" aria-label="' + this.__('accessibility.next_page') + '"></i>',
    mid_size: 1, escape: false, ...options
  });
});
hexo.extend.filter.register('before_generate', () => {
  hexo.theme.setView('_partials/pagination.pug', 'if page.prev || page.next\n    nav.pagination\n        .inner!= site_pagination()');
});
hexo.extend.helper.register('archive_row', function (post, format = 'MM-DD', showCategory = true) {
  const category = post.categories.toArray().slice(-1)[0];
  return `<article class="item normal" itemscope itemtype="http://schema.org/Article"><div class="meta"><time itemprop="dateCreated" datetime="${post.date.toISOString()}">${this.date(post.date, format)}</time>${showCategory && category ? `<a href="${this.url_for(category.path)}">${escapeHTML(category.name)}</a>` : ''}</div><div class="title"><a href="${this.url_for(post.path)}" itemprop="url"><span itemprop="name">${escapeHTML(post.title)}</span></a></div></article>`;
});
hexo.extend.helper.register('category_directory', function () {
  const categories = this.site.categories.toArray().sort(categoryOrder);
  const row = post => this.archive_row(post, 'YYYY-MM-DD', false);
  const group = (category, posts, hideTitle = false) => {
    if (!posts.length) return '';
    const title = hideTitle ? '文章' : escapeHTML(category.name);
    const pages = Math.ceil(posts.length / 5);
    const pagination = Array.from({ length: pages > 1 ? pages : 0 }, (_, index) => {
      const links = this.site_pagination({ current: index + 1, total: pages, base: '#category-page-1', format: '#category-page-%d' })
        .replace(/href="[^"]*#category-page-(\d+)"/g, 'href="#' + anchor(category) + '" data-category-page="$1"');
      return `<nav class="category-pagination pagination" data-pagination-page="${index}"${index ? ' hidden' : ''} aria-label="${escapeHTML(category.name)}文章分页"><div class="inner">${links}</div></nav>`;
    }).join('');
    return `<section class="category-group" id="${anchor(category)}"><details><summary class="item section"><span class="category-name">${title}</span><small>${posts.length} 篇</small></summary><div class="category-content"><div class="category-posts category-full">${posts.map(row).join('')}</div>${pagination}</div></details></section>`;
  };
  const render = (category, root = false) => {
    const children = categories.filter(item => item.parent === category._id);
    const childPosts = new Set(children.flatMap(item => item.posts.toArray().map(post => post._id)));
    const own = category.posts.toArray().sort((a, b) => Number(b.updated || b.date) - Number(a.updated || a.date)).filter(post => !childPosts.has(post._id));
    return group(category, own, root && !children.length) + children.map(child => render(child)).join('');
  };
  return `<div class="category-directory timeline">${categories.filter(item => !item.parent).map(category => `<section><h2 class="category-parent item header" id="${anchor(category)}-parent">${escapeHTML(category.name)} <small>（${category.posts.length}）</small></h2>${render(category, true)}</section>`).join('')}</div>`;
});
// All existing category links lead to the matching section on the directory page.
hexo.extend.filter.register('after_render:html', html => {
  for (const category of hexo.locals.get('categories').toArray()) {
    const path = '/' + category.path;
    const id = anchor(category) + (category.parent ? '' : '-parent');
    for (const link of new Set([path, encodeURI(path)])) html = html.split(`href="${link}"`).join(`href="/categories/#${encodeURIComponent(id)}"`);
  }
  return html;
});
