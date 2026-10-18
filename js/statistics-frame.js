(() => {
  const frames = () => Array.from(document.querySelectorAll('iframe[data-statistics-frame]'));
  window.addEventListener('message', event => {
    if (event.origin !== 'null' || !frames().some(frame => frame.contentWindow === event.source)) return;
    if (!event.data || event.data.type !== 'blog-statistics') return;
    for (const key of ['site_pv', 'page_pv', 'site_uv']) {
      const value = event.data[key];
      if (!Number.isSafeInteger(value) || value < 0) continue;
      const target = document.getElementById('busuanzi_value_' + key);
      if (target) target.textContent = String(value);
    }
  });
})();
