const englishRoutes = require('../lib/english-routes');
const fs = require('node:fs');
const path = require('node:path');
const { readMarkdown, sourceDigest } = require('../lib/translation-source');
const { stripHTML, unescapeHTML, escapeHTML } = require('hexo-util');

// ShokaX caches shared partials by template path. Include the page language in that key.
const renderPartial = hexo.extend.helper.get('partial');
hexo.extend.helper.register('partial', function (name, locals, options) {
  if (options?.cache === true) {
    options = { ...options, cache: name + ':' + (this.page.language || this.page.lang || this.config.language) };
  }
  return renderPartial.call(this, name, locals, options);
});

const translatedTitles = new Map();
const labels = require('js-yaml').load(fs.readFileSync(path.join(hexo.base_dir, 'en/ui.yml'), 'utf8'));
hexo.extend.filter.register('before_generate', () => {
  // Source processing can cache locals before all posts and tags are available.
  hexo.locals.invalidate();
  englishRoutes.prepare(hexo, labels);
});
hexo.extend.helper.register('site_label', function (label) {
  return this.page.language === 'en' ? labels[label] ?? label : label;
});

// Resolve every English route through its Chinese source so renamed permalinks follow Hexo.
hexo.extend.generator.register('english-pages', async function (locals) {
  translatedTitles.clear();
  const routes = [];
  const index = [];
  const feedPosts = [];
  for (const original of [...locals.posts.sort('-date').toArray(), ...locals.pages.toArray()]) {
    const file = englishRoutes.files.get(original.source) || path.join(this.base_dir, 'en', original.source);
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    const { meta, body } = readMarkdown(raw);
    translatedTitles.set(original.title, meta.title);
    const chinese = readMarkdown(fs.readFileSync(path.join(this.source_dir, original.source), 'utf8'));
    if (!meta.translation_id || meta.translation_id !== chinese.meta.translation_id) {
      throw new Error('Mismatched translation_id: ' + file);
    }
    if (sourceDigest(chinese) !== meta.source_digest) this.log.warn('English translation needs review: ' + original.source);
    let { content } = await this.post.render(file, { disableNunjucks: chinese.meta.disableNunjucks, math: chinese.meta.math, ...meta, source: original.source, layout: original.layout, content: body });
    const sections = meta.sections || {};
    content = content.replace(/<h([1-6]) id="([^"]+)"/g, (tag, level, id) => {
      const stable = sections[id];
      if (!stable) return tag;
      const aliases = Array.isArray(stable) ? stable : [stable];
      const targets = aliases.filter(alias => alias !== id)
        .map(alias => `<span id="${escapeHTML(alias)}" aria-hidden="true"></span>`).join('');
      return `${targets}${tag} data-section="${escapeHTML(aliases[0])}"`;
    });
    const route = englishRoutes.english(original.path);
    if (original.layout === 'post' && feedPosts.length < this.config.feed.limit) {
      feedPosts.push({ title: meta.title, content, date: original.date, permalink: new URL(route, this.config.url + '/').href });
    }
    if (original.layout === 'post' && original.indexing !== false) {
      index.push({ title: meta.title, url: '/' + route, text: unescapeHTML(stripHTML(content)).replace(/\s+/g, ' ').trim(),
        tags: (meta.tags || []).join(' '), categories: (meta.categories || []).flat().join(' ') });
    }
    const categories = original.categories?.map(category => ({
      _id: category._id, path: category.path, name: labels[category.name] ?? category.name
    }));
    routes.push({
      path: route,
      layout: original.layout || 'page',
      data: { math: original.math, prompt_glyph: original.prompt_glyph, date: original.date, updated: original.updated, cover: original.cover, layout: original.layout, source: original.source,
        categories: categories && Object.assign(categories, { toArray: () => categories }),
        title: meta.title, _content: body, content, language: 'en', path: route,
        permalink: new URL(route, this.config.url + '/').href
      }
    });
  }
  routes.push({ path: 'en/search.json', data: JSON.stringify(index) });
  if (feedPosts.length) {
    const helpers = this.extend.helper;
    const context = {
      posts: feedPosts, lastBuildDate: feedPosts[0].date,
      config: { ...this.config, url: this.config.url + '/en/', language: 'en', title: this.config.title + ' (English)' },
      moment: helpers.get('moment').bind(this),
      full_url_for: helpers.get('full_url_for').bind(this)
    };
    for (const format of ['rss', 'atom', 'jsonFeed']) {
      const feed = this.config.feed[format];
      if (feed.enable) routes.push({ path: 'en/' + feed.output, data: await this.render.render({ path: path.resolve(this.base_dir, feed.template) }, context) });
    }
  }
  return routes;
});

// Only expose a switch on a route that already has a reviewed counterpart.
hexo.extend.filter.register('after_render:html', function (html, data) {
  const current = data.page?.path;
  if (!current || !html.includes('id="rightNav"')) return html;
  const english = current.startsWith('en/');
  html = html.replace('</head>', '<link rel="stylesheet" href="/css/bilingual.css"></head>');
  if (english) {
    html = html.replace(/(<a\b[^>]*\bhref="\/(?:en\/)?tags\/[^"]+"[^>]*>)([^<>]+)(?=<)/gi, (match, open, text) => {
      const key = unescapeHTML(text.trim());
      return Object.hasOwn(labels, key) ? open + escapeHTML(labels[key]) : match;
    });
    html = html.replace(/>([^<>]+)</g, (match, text) => {
      const key = unescapeHTML(text.trim());
      if (/^[\d.,]+k? (字|行)$/.test(key)) return '>' + key.replace(' 字', ' words').replace(' 行', ' lines') + '<';
      const translated = translatedTitles.get(key) || (Object.hasOwn(labels, key) ? labels[key] : undefined);
      return translated ? '>' + escapeHTML(translated) + '<' : match;
    });
    // Localise navigational anchors only. Assets, external URLs and explicit language links retain their targets.
    html = html.replace(/<a\b[^>]*>/gi, tag => {
      if (/\b(?:hreflang|download)=/i.test(tag)) return tag;
      return tag.replace(/\bhref="(\/(?!\/|en\/)[^"#?]*)([^"]*)"/, (attribute, pathname, suffix) => {
        let target;
        try { target = decodeURIComponent(pathname.slice(1)); } catch { return attribute; }
        const destination = englishRoutes.english(target);
        const route = destination + (!target || target.endsWith('/') ? 'index.html' : '');
        if (pathname === '/tags' && this.route.get('en/tags/index.html')) return `href="/en/tags/${suffix}"`;
        return this.route.get(route) ? `href="/${encodeURI(destination)}${suffix}"` : attribute;
      });
    });
    // The theme compares the Chinese post paths against the English page path.
    // Restore its current-article marker after the bookmark URLs have been localised.
    html = html.replace(/<li\s*><a href="([^"]+)" rel="bookmark" title="[^"]*">([^<]+)<\/a><\/li>/g,
      (_, href, text) => {
        const active = decodeURI(href) === '/' + current ? ' class="active"' : '';
        return `<li${active}><a href="${href}" rel="bookmark" title="${escapeHTML(unescapeHTML(text))}">${text}</a></li>`;
      });
    html = html.replace(/(<link\b[^>]*\btype="application\/(?:rss\+xml|atom\+xml|feed\+json|json)"[^>]*>)/g,
      tag => tag.replace(/href="([^"]*?)\/(rss\.xml|atom\.xml|feed\.json)"/, 'href="$1/en/$2"'));
  }
  const key = current.replace(/index\.html$/, '');
  const counterpart = english ? englishRoutes.chinese(key) : englishRoutes.english(key);
  const route = !counterpart || counterpart.endsWith('/') ? counterpart + 'index.html' : counterpart;
  if (!this.route.get(route)) return html;
  const href = '/' + encodeURI(counterpart.replace(/index\.html$/, ''));
  const label = english ? '切换到中文' : 'Read in English';
  // ShokaX replaces .pjax fragments on navigation, including this page-specific route.
  const link = '<li class="item pjax"><a data-counterpart="' + href + '" href="' + href + '" hreflang="' + (english ? 'zh-CN' : 'en') + '" aria-label="' + label + '" title="' + label + '" data-no-pjax><i class="ic i-translate" aria-hidden="true"></i></a></li>';
  return html.replace('</body>', '<script src="/js/language-switch.js" defer></script></body>').replace(/(<ul\b[^>]*\bid="rightNav"[^>]*>)/, '$1' + link);
}, 40);
