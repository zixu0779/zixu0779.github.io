const { escapeHTML, unescapeHTML } = require('hexo-util');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'))?.[1];
const cloudImage = url => /^https:\/\/res\.cloudinary\.com\/sycamore\/image\/upload\/v\d+\/.+\.(?:png|jpe?g|webp|bmp)(?:[?#].*)?$/i.test(url);
const derived = (url, width, quality = 'best') => url.replace('/image/upload/', `/image/upload/f_auto,q_auto:${quality},c_limit,w_${width}/`);
function optimizePostImages(html) {
  return html.replace(/<article\b[^>]*\bclass="[^"]*\bpost\b[^"]*"[^>]*>[\s\S]*?<\/article>/gi, article => article.replace(/<img\b[^>]*>/gi, tag => {
    if (attr(tag, 'data-original-src') || attr(tag, 'srcset')) return tag;
    const original = unescapeHTML(attr(tag, 'data-src') || attr(tag, 'src') || '');
    const width = Number(attr(tag, 'width'));
    const display = Number((attr(tag, 'style') || '').match(/--article-image-width:([\d.]+)px/)?.[1]);
    if (!cloudImage(original) || !width || !display) return tag;
    const candidates = [...new Set([Math.min(width, Math.ceil(display)), Math.min(width, Math.ceil(display * 2))])];
    const srcset = candidates.map(w => `${derived(original, w)} ${w}w`).join(', ');
    const clean = tag.replace(/\s(?:data-src|src)=["'][^"']*["']/gi, '');
    return clean.replace(/\s*\/?\s*>$/, ` src="${escapeHTML(derived(original, candidates[0]))}" srcset="${escapeHTML(srcset)}" sizes="(max-width: ${Math.ceil(display + 32)}px) calc(100vw - 32px), ${Math.ceil(display)}px" data-original-src="${escapeHTML(original)}"${attr(tag, 'loading') ? '' : ' loading="lazy"'}>`);
  }));
}
function optimizeListImages(html) {
  return html.replace(/<img\b[^>]*alt="article cover"[^>]*>/gi, tag => {
    if (attr(tag, 'srcset')) return tag;
    const original = unescapeHTML(attr(tag, 'data-src') || attr(tag, 'src') || '');
    if (!cloudImage(original)) return tag;
    return tag.replace(/\s(?:data-src|src)=["'][^"']*["']/gi, '').replace(/\s*\/?\s*>$/, ` src="${escapeHTML(derived(original, 640, 'good'))}" srcset="${[400, 640, 960].map(w => `${escapeHTML(derived(original, w, 'good'))} ${w}w`).join(', ')}" sizes="(max-width: 767px) 90vw, 420px">`);
  });
}
module.exports = { optimizePostImages, optimizeListImages };
if (typeof hexo !== 'undefined') hexo.extend.filter.register('after_render:html', html => optimizeListImages(optimizePostImages(html)), 20);
