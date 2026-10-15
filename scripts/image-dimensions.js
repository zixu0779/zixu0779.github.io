const fs = require('node:fs/promises');
const path = require('node:path');
const { imageSize } = require('image-size');
const { unescapeHTML } = require('hexo-util');

const attribute = (tag, name) => tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2];
const validSize = size => Array.isArray(size) && size.length === 2 && size.every(n => Number.isInteger(n) && n > 0 && n < 1000000);

const reserveImages = async (html, lookup, displayWidths = {}) => {
  const images = [...html.matchAll(/<img\b[^>]*>/gi)];
  const replacements = await Promise.all(images.map(async ([tag]) => {
    if (/\s(?:width|height)\s*=/i.test(tag)) return tag;
    const src = attribute(tag, 'data-src') || attribute(tag, 'src');
    if (!src) return tag;
    const size = await lookup(unescapeHTML(src));
    if (!validSize(size)) return tag;
    const [width, height] = size;
    // Wide terminal strips need width; long captures need a taller reading area.
    const wide = width / height >= 3, tall = height / width >= 2;
    const preferred = displayWidths[unescapeHTML(src)];
    const defaultWidth = Math.min(width, wide ? 960 : 640, width * (tall ? 960 : 480) / height);
    // Reviewed dense/long captures can exceed the general preview box without upscaling.
    const displayWidth = Math.min(width, Number.isFinite(preferred) && preferred > 0 ? preferred : defaultWidth);
    const style = `--article-image-width:${displayWidth}px;--article-image-ratio:${width}/${height};`;
    const styled = /\sstyle\s*=/i.test(tag)
      ? tag.replace(/(\sstyle\s*=\s*["'])/i, `$1${style}`)
      : tag.replace(/\s*\/?\s*>$/, ` style="${style}">`);
    return styled.replace(/\s*\/?\s*>$/, ` width="${width}" height="${height}">`);
  }));
  let index = 0;
  return html.replace(/<img\b[^>]*>/gi, () => replacements[index++]);
};

// Read only enough of a remote image to identify its dimensions; never cache image bytes.
const remoteSize = async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { Range: 'bytes=0-524287' } });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
  const reader = response.body.getReader();
  let buffer = Buffer.alloc(0);
  try {
    while (buffer.length < 524288) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer = Buffer.concat([buffer, value]).subarray(0, 524288);
      try { return imageSize(buffer); } catch { /* The next chunk may contain the size header. */ }
    }
    throw new Error('Image dimensions unavailable in the first 512 KiB');
  } finally {
    await reader.cancel().catch(() => {});
  }
};

if (typeof hexo !== 'undefined') {
  const cachePath = path.join(hexo.base_dir, 'image-dimensions.json');
  const requests = new Map(), waiting = [];
  let cache, dirty = false, active = 0;
  let saving = Promise.resolve();
  const readCache = fs.readFile(cachePath, 'utf8').then(JSON.parse).catch(() => ({}));
  hexo.extend.filter.register('before_generate', () => requests.clear());
  const saveCache = () => {
    if (!dirty) return saving;
    dirty = false;
    saving = saving.then(() => fs.writeFile(cachePath, JSON.stringify(Object.fromEntries(Object.entries(cache).sort()), null, 2) + '\n'));
    return saving;
  };
  const lookup = src => {
    if (requests.has(src)) return requests.get(src);
    const request = (async () => {
      cache ||= await readCache;
      if (validSize(cache[src])) return cache[src];
      if (active >= 6) await new Promise(resolve => waiting.push(resolve));
      active++;
      try {
        const url = new URL(src, hexo.config.url);
        if (!['http:', 'https:'].includes(url.protocol)) return null;
        const local = path.resolve(hexo.source_dir, '.' + decodeURIComponent(url.pathname));
        let dimensions;
        if (url.origin === new URL(hexo.config.url).origin && local.startsWith(path.resolve(hexo.source_dir) + path.sep)) {
          dimensions = imageSize(await fs.readFile(local));
        } else dimensions = await remoteSize(url.href);
        const { width, height, orientation } = dimensions;
        const size = orientation >= 5 ? [height, width] : [width, height];
        if (!validSize(size)) throw new Error('Invalid image dimensions');
        cache[src] = size;
        dirty = true;
        return size;
      } catch (error) {
        hexo.log.warn(`Image size unavailable: ${src} (${error.message})`);
        return null;
      } finally {
        active--;
        waiting.shift()?.();
      }
    })();
    requests.set(src, request);
    return request;
  };
  hexo.extend.filter.register('after_render:html', async html => {
    const articles = [...html.matchAll(/<article\b[^>]*\bclass="[^"]*\bpost\b[^"]*"[^>]*>[\s\S]*?<\/article>/gi)];
    const reserved = await Promise.all(articles.map(([article]) => reserveImages(article, lookup, hexo.locals?.get('data')?.image_display || {})));
    // Hexo renders route HTML lazily, after after_generate has already run.
    await saveCache();
    let index = 0;
    return html.replace(/<article\b[^>]*\bclass="[^"]*\bpost\b[^"]*"[^>]*>[\s\S]*?<\/article>/gi, () => reserved[index++]);
  });
}

module.exports = { reserveImages, remoteSize };
