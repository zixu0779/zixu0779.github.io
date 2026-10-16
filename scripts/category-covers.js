const { readFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
let indexWrapped = false;

hexo.extend.filter.register('before_generate', () => {
  if (!indexWrapped) {
    const generate = hexo.extend.generator.get('index');
    hexo.extend.generator.register('index', async function (locals) {
      const routes = await generate.call(this, locals);
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
          cat.subs = children.length ? children.sort({ name: 1 }).limit(6).toArray() : [];
          const posts = children.length ? cat.posts.sort({ title: 1 }).filter(post => post.categories.last()._id === cat._id) : cat.posts.sort({ title: 1 });
          cat.subs.push(...posts.limit(Math.max(0, 6 - cat.subs.length)).toArray());
          cards.push(cat);
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
  hexo.theme.setView('index.pug', index.replace('include _mixin/card.pug', card.replace(original, configured)));
});
