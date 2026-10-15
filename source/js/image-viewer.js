(() => {
  const vendors = JSON.parse(document.currentScript.dataset.vendors);
  let loading;
  const init = () => {
    if (window.LOCAL?.fancybox === false) return;
    const images = document.querySelectorAll('.post.block .md img:not(.emoji):not(.vemoji)');
    if (!images.length) return;
    images.forEach(image => {
      if (image.closest('a')) return;
      const link = document.createElement('a');
      link.className = 'fancybox';
      link.href = image.dataset.src || image.src;
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
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pjax:success', init);
})();
