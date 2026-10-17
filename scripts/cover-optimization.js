const { escapeHTML, unescapeHTML } = require('hexo-util');
const delivery = (url, width) => url.replace(/^(https:\/\/res\.cloudinary\.com\/sycamore\/image\/upload\/)(v\d+\/)/, `$1f_auto,q_auto,c_limit,w_${width}/$2`);
const widths = kind => kind === 'hero' ? [640, 960, 1440, 1920, 2560] : [400, 640, 960];
const sizes = kind => kind === 'hero' ? 'max(100vw, 125vh, 712px)' : '(max-width: 767px) 90vw, (max-width: 1200px) 45vw, 480px';
const srcset = (url, kind) => widths(kind).map(w => `${delivery(url, w)} ${w}w`).join(', ');
function picture(url, kind, deferred = false) {
  const prefix = deferred ? 'data-cover-' : '';
  return `<img class="optimized-cover" ${prefix}src="${escapeHTML(delivery(url, kind === 'hero' ? 1920 : 640))}" ${prefix}srcset="${escapeHTML(srcset(url, kind))}" sizes="${sizes(kind)}" alt="" decoding="async" loading="${kind === 'hero' ? 'eager' : 'lazy'}" fetchpriority="${kind === 'hero' && !deferred ? 'high' : 'low'}">`;
}
function optimizeHero(html) {
  const single = html.match(/(<div\b[^>]*\bid="imgs"[^>]*>)\s*(<img\b[^>]*>)\s*(<\/div>)/);
  if (single) {
    const source = single[2].match(/\ssrc="([^"]+)"/);
    if (!source || /\ssrcset=/.test(single[2])) return html;
    const url = unescapeHTML(source[1]);
    // The theme iterates a single cover URL as characters when emitting preloads.
    html = html.replace(/<link\b[^>]*rel="preload"[^>]*>/g, tag => {
      const href = tag.match(/\shref="([^"]*)"/);
      return /\bas="image"/.test(tag) && href && (unescapeHTML(href[1]).length <= 1 || unescapeHTML(href[1]) === url) ? '' : tag;
    });
    if (delivery(url, 1920) === url) return html;
    const img = single[2].replace(/\ssrc="[^"]+"/, ` src="${escapeHTML(delivery(url, 1920))}" srcset="${escapeHTML(srcset(url, 'hero'))}" sizes="${sizes('hero')}"`);
    html = html.replace(single[0], single[1] + img + single[3]);
    return html.replace('</head>', `<link rel="preload" as="image" href="${escapeHTML(delivery(url, 1920))}" imagesrcset="${escapeHTML(srcset(url, 'hero'))}" imagesizes="${sizes('hero')}" fetchpriority="high"></head>`);
  }
  const gallery = html.match(/(<div\b[^>]*\bid="imgs"[^>]*>)\s*<ul>([\s\S]*?)<\/ul>/);
  if (!gallery) return html;
  const urls = [...gallery[2].matchAll(/url\(&quot;([^&]+)&quot;\)/g)].map(match => match[1]);
  if (urls.length !== 6 || urls.some(url => !url.startsWith('https://res.cloudinary.com/sycamore/image/upload/'))) return html;
  html = html.replace(gallery[0], gallery[1] + `<ul class="optimized-hero">${urls.map((url, i) => `<li class="item">${picture(url, 'hero', i !== 0)}</li>`).join('')}</ul>`);
  html = html.replace(/<link\b[^>]*rel="preload"[^>]*>/g, tag => urls.some(url => tag.includes(`href="${url}"`)) ? '' : tag);
  return html.replace('</head>', `<link rel="preload" as="image" href="${escapeHTML(delivery(urls[0], 1920))}" imagesrcset="${escapeHTML(srcset(urls[0], 'hero'))}" imagesizes="${sizes('hero')}" fetchpriority="high"></head>`);
}
module.exports = { delivery, picture, srcset, optimizeHero };
if (typeof hexo !== 'undefined') {
  hexo.extend.helper.register('optimized_cover_image', url => picture(url, 'card'));
  hexo.extend.filter.register('after_render:html', optimizeHero);
  hexo.extend.filter.register('theme_inject', injects => injects.bodyEnd.raw('optimized-hero', '<script src="/js/optimized-hero.js" defer></script>'));
}
