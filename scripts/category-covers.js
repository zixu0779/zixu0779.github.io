const checkedReplace = require('../lib/checked-replace');
const { readFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const categoryOrder = require('../lib/category-order');
let indexWrapped = false;

hexo.extend.filter.register('before_generate', () => {
  if (!indexWrapped) {
    const generate = hexo.extend.generator.get('index');
    hexo.extend.generator.register('index', async function (locals) {
      // Filter only the homepage feed; categories, archives and search retain these posts.
      const posts = locals.posts.filter(post => !post.categories.toArray().some(category => category.parent && category.name === '日常琐记'));
      const routes = await generate.call(this, { ...locals, posts });
      const featured = post => post.categories.toArray().some(category => !category.parent && ['软件开发', '游戏工坊', '博客搭建'].includes(category.name));
      const feedRoutes = routes.filter(route => route.data?.__index);
      const ordered = feedRoutes.flatMap(route => route.data.posts.toArray()).sort((a, b) => Number(featured(b)) - Number(featured(a)) || Number(b.date) - Number(a.date));
      let offset = 0;
      for (const route of feedRoutes) {
        const count = route.data.posts.length;
        route.data.posts = new route.data.posts.constructor(ordered.slice(offset, offset + count));
        offset += count;
      }
      const categories = locals.categories;
      for (const route of routes) {
        const cards = route.data?.catlist;
        if (!Array.isArray(cards)) continue;
        categories.forEach(cat => {
          if (!hexo.theme.config.category_covers?.[cat.slug] || cards.some(item => item._id === cat._id)) return;
          let top = cat;
          while (top.parent) top = categories.findOne({ _id: top.parent });
          if (top !== cat) cat.top = top;
          const children = categories.find({ parent: cat._id });
          cat.child = children.length;
          cat.subs = children.length ? children.toArray().sort(categoryOrder).slice(0, 6) : [];
          const posts = children.length ? cat.posts.sort({ title: 1 }).filter(post => post.categories.last()._id === cat._id) : cat.posts.sort({ title: 1 });
          cat.subs.push(...posts.limit(Math.max(0, 6 - cat.subs.length)).toArray());
          cards.push(cat);
        });
        const featuredOrder = Object.keys(hexo.theme.config.category_covers || {});
        cards.sort((a, b) => featuredOrder.indexOf(a.slug) - featuredOrder.indexOf(b.slug));
        cards.forEach(card => {
          const children = categories.find({ parent: card._id }).toArray().sort(categoryOrder);
          if (children.length) card.subs = [...children.slice(0, 6), ...card.subs.filter(sub => !sub.posts)].slice(0, 6);
        });
      }
      return routes;
    });
    indexWrapped = true;
  }
  const layout = join(dirname(require.resolve('hexo-theme-shokax/package.json')), 'layout');
  const original = "url_for(theme.statics + item.slug + '/cover.jpg')";
  const card = readFileSync(join(layout, '_mixin/card.pug'), 'utf8');
  if (!card.includes(original)) throw new Error('ShokaX category cover template changed; review category-covers.js');
  const configured = "url_for((theme.category_covers || {})[item.slug] || theme.statics + item.slug + '/cover.jpg')";
  const index = readFileSync(join(layout, 'index.pug'), 'utf8');
  if (!index.includes('include _mixin/card.pug')) throw new Error('ShokaX category card include changed');
  const configuredCard = checkedReplace(card, original, configured, 'category cover URL');
  const optimizedCard = checkedReplace(configuredCard, 'div(class="cover" data-background-image!=cover ? cover:"")', 'div(class="cover")\n            != optimized_cover_image(cover)', 'category cover image');
  hexo.theme.setView('index.pug', checkedReplace(index, 'include _mixin/card.pug', optimizedCard, 'category card include'));
});
