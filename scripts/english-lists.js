const englishRoutes = require('../lib/english-routes');
const fs = require('node:fs');
const path = require('node:path');
const { readMarkdown } = require('../lib/translation-source');

function entries(posts, translations) {
  return posts.map(post => ({
    title: translations.get(post.source), url: '/' + englishRoutes.english(post.path),
    date: post.date.format('YYYY-MM-DD')
  })).filter(item => item.title);
}

hexo.extend.generator.register('english-lists', async function (locals) {
  const label = this.extend.helper.get('site_label').bind({page: {language: 'en'}});
  const translated = new Map();
  for (const post of locals.posts.toArray()) {
    const file = englishRoutes.files.get(post.source);
    if (fs.existsSync(file)) translated.set(post.source, readMarkdown(fs.readFileSync(file, 'utf8')).meta.title);
  }
  this.theme.setView('english-list.pug', fs.readFileSync(path.join(this.source_dir, '_layouts/english-list.pug'), 'utf8'));
  const pages = [];
  function add(key, title, groups, links = []) {
    pages.push({ path: 'en/' + key, layout: 'english-list', data: { language: 'en', title, groups, links } });
  }
  // Use the same generators as the Chinese pages, including the custom home feed order.
  for (const generator of ['index', 'tag']) {
    const routes = await this.extend.generator.get(generator).call(this, locals);
    for (const route of routes) {
      const data = route.data;
      if (!data?.posts || (!data.__index && !data.tag)) continue;
      if (data.tag) {
        pages.push({ path: englishRoutes.english(route.path), layout: 'tag', data: {
          ...data, language: 'en', tag: label(data.tag), base: englishRoutes.english(data.base)
        } });
        continue;
      }
      const links = Array.from({ length: data.total || 1 }, (_, i) => {
        const page = i + 1;
        const base = data.base || '';
        return { number: page, current: page === data.current, url: '/en/' + base + (i ? this.config.pagination_dir + '/' + page + '/' : '') };
      });
      add(route.path, label(data.tag) || this.config.title, [{ entries: entries(data.posts.toArray(), translated) }], links);
    }
  }
  const months = new Map();
  for (const post of locals.posts.sort('-date').toArray()) {
    const key = post.date.format('YYYY-MM');
    if (!months.has(key)) months.set(key, { id: key, title: post.date.clone().locale('en').format('MMMM YYYY'), entries: [] });
    months.get(key).entries.push(...entries([post], translated));
  }
  add('archives/', 'Archives', [...months.values()]);
  pages.push({ path: 'en/tags/', layout: 'page', data: { type: 'tags', language: 'en', title: 'Tags' } });
  pages.push({ path: 'en/categories/', layout: 'page',
    data: { language: 'en', type: 'categories', title: 'Categories', translatedTitles: Object.fromEntries(translated) } });
  return pages;
});
