const { escapeHTML, unescapeHTML } = require('hexo-util');
// Keep the theme's link-card markup and replace only its background avatar.
hexo.extend.filter.register('after_render:html', html => html.replace(/(<div class="links">[\s\S]*?<div class="item") title="[^"]*"/g, '$1').replace(/(<div class="item") title="[^"]*"(?= style="--block-color:)/g, '$1').replace(
  /(<a\b[^>]*class="image"[^>]*?) data-background-image="([^"]*)"([^>]*>)(<\/a>)(\s*<div class="info">\s*<a[^>]*class="title"[^>]*>)([^<]*)/g,
  (_, before, image, end, close, info, title) => {
    const name = unescapeHTML(title).trim();
    const initial = /[\u3400-\u9fff]/.test(name[0]) ? name[0] : (name.split(/[\s_-]+/).length > 1 ? name.split(/[\s_-]+/).map(word => word[0]).join('') : name).slice(0, 2).toUpperCase();
    return `${before.replace('class="image"', 'class="image avatar-placeholder"')} data-avatar-fallback="${escapeHTML(initial)}" aria-label="${escapeHTML(name)}"${end}<span class="avatar-initial" aria-hidden="true">${escapeHTML(initial)}</span><img src="${image}" alt="${escapeHTML(name)}" loading="lazy">${close}${info}${title}`;
  }
));
