(() => {
  const vendors = JSON.parse(document.currentScript.dataset.vendors);
  let loading;
  const init = () => {
    if (window.LOCAL?.fancybox === false) return;
    const images = document.querySelectorAll('.post.block .md img:not(.emoji):not(.vemoji)');
    if (!images.length) return;
    images.forEach(image => {
      const existing = image.closest('a');
      if (existing) {
        if (image.dataset.originalSrc && existing.classList.contains('fancybox')) existing.href = image.dataset.originalSrc;
        return;
      }
      const link = document.createElement('a');
      link.className = 'fancybox';
      link.href = image.dataset.originalSrc || image.dataset.src || image.src;
      link.dataset.fancybox = 'article';
      if (image.title) link.dataset.caption = image.title;
      image.before(link);
      link.append(image);
    });
    // Reuse the theme's configured Fancybox assets; keep original-image links if loading fails.
    loading ||= Promise.all(Object.entries(vendors).map(([kind, vendor]) => new Promise((resolve, reject) => {
      const asset = document.createElement(kind === 'css' ? 'link' : 'script');
      if (kind === 'css') { asset.rel = 'stylesheet'; asset.href = vendor.url; }
      else asset.src = vendor.url;
      if (vendor.sri) { asset.integrity = vendor.sri; asset.crossOrigin = 'anonymous'; }
      asset.onload = resolve;
      asset.onerror = reject;
      document.head.append(asset);
    }))).then(() => { jQuery.fancybox.defaults.hash = false; }).catch(error => {
      loading = null;
      console.warn('Image viewer unavailable; original-image links remain usable.', error);
    });
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a.fancybox');
    const original = link?.querySelector('img[data-original-src]')?.dataset.originalSrc;
    if (original) link.href = original;
  }, true);
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pjax:success', init);
})();
