const { readFileSync } = require('node:fs');
const { join, dirname } = require('node:path');
const { stripHTML, unescapeHTML, escapeHTML } = require('hexo-util');

hexo.extend.filter.register('before_generate', () => {
  // Reuse the theme's Markdown body, metadata and reward; omit only article-only sections.
  const postView = readFileSync(join(dirname(require.resolve('hexo-theme-shokax/package.json')), 'layout/_partials/post/post.pug'), 'utf8');
  hexo.theme.setView('standalone-post.pug', postView
    .replace('if theme.reward.enable', 'if theme.reward.enable && standaloneReward')
    .replace("        if theme.creative_commons.license\n            != partial('_partials/post/copyright.pug')", '')
    .replace("    != shokax_inject('postBodyEnd')", ''));

  hexo.theme.setView('friends.pug', readFileSync(join(hexo.source_dir, '_layouts/friends.pug'), 'utf8'));
});

// Keep customization outside the installed theme so dependency updates preserve it.
hexo.extend.filter.register('theme_inject', injects => {
  const emptySocial = Object.entries(hexo.theme.config.social || {}).filter(([, value]) => !value.split('||')[0].trim()).map(([name, value]) => ({ name, icon: value.split('||')[1].trim() }));
  injects.bodyEnd.raw('site-ui', `<script src="/js/search-match.js" defer></script><script src="/js/site-ui.js" data-empty-social="${escapeHTML(JSON.stringify(emptySocial))}" defer></script>`);
});

hexo.extend.generator.register('local-search', locals => ({
  path: 'search.json',
  data: JSON.stringify(locals.posts.sort('-date').filter(post => post.indexing !== false).map(post => ({
    title: post.title,
    url: hexo.config.root + post.path,
    text: unescapeHTML(stripHTML(post.content)).replace(/\s+/g, ' ').trim(),
    tags: post.tags.map(tag => tag.name).join(' '),
    categories: post.categories.map(category => category.name).join(' ')
  })))
}));
