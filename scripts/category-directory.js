const { escapeHTML } = require('hexo-util');
const anchor = category => 'category-' + category.path.replace(/^categories\//, '').replace(/\/$/, '').replace(/\//g, '-');
hexo.extend.filter.register('before_generate', () => hexo.extend.generator.register('category', () => []));
hexo.extend.helper.register('archive_row', function (post, format = 'MM-DD', showCategory = true) {
  const category = post.categories.toArray().slice(-1)[0];
  return `<article class="item normal" itemscope itemtype="http://schema.org/Article"><div class="meta"><time itemprop="dateCreated" datetime="${post.date.toISOString()}">${this.date(post.date, format)}</time>${showCategory && category ? `<a href="${this.url_for(category.path)}">${escapeHTML(category.name)}</a>` : ''}</div><div class="title"><a href="${this.url_for(post.path)}" itemprop="url"><span itemprop="name">${escapeHTML(post.title)}</span></a></div></article>`;
});
hexo.extend.helper.register('category_directory', function () {
  const categories = this.site.categories.toArray().sort((a, b) => a.name.localeCompare(b.name, 'en'));
  const row = post => this.archive_row(post, 'YYYY-MM-DD', false);
  const group = (category, posts, hideTitle = false) => {
    if (!posts.length) return '';
    const title = hideTitle ? '文章' : escapeHTML(category.name);
    return `<section class="category-group" id="${anchor(category)}"><details><summary class="item section"><span class="category-name">${title}</span><small>${posts.length} 篇</small></summary><div class="category-content"><div class="category-posts category-full">${posts.map(row).join('')}</div><nav class="category-pagination pagination" aria-label="${escapeHTML(category.name)}文章分页"><div class="inner"><button class="prev" type="button" data-category-page="-1" aria-label="上一页"><i class="ic i-angle-left"></i></button><span class="page-number current"></span><button class="next" type="button" data-category-page="1" aria-label="下一页"><i class="ic i-angle-right"></i></button></div></nav></div></details></section>`;
  };
  const render = (category, root = false) => {
    const children = categories.filter(item => item.parent === category._id);
    const childPosts = new Set(children.flatMap(item => item.posts.toArray().map(post => post._id)));
    const own = category.posts.sort('-date').toArray().filter(post => !childPosts.has(post._id));
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
