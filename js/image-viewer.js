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
      // ShokaX PJAX skips links already marked as handled; images belong to the viewer.
      link.dataset.pjaxState = 'image';
      if (image.title) link.dataset.caption = image.title;
      image.before(link);
      link.append(image);
    });
    // Reuse the theme's configured Fancybox assets; keep original-image links if loading fails.
    loading ||= window.blogVendorReady.then(() => Promise.all(Object.values(vendors).map(vendor => window.blogLoadVendor(vendor.url)))).then(() => { jQuery.fancybox.defaults.hash = false; }).catch(error => {
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
