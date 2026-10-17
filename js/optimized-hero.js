(() => {
  function start() {
    const gallery = document.querySelector('.optimized-hero');
    if (!gallery || gallery.dataset.started) return;
    gallery.dataset.started = 'true';
    const images = [...gallery.querySelectorAll('img')];
    const ready = image => new Promise(resolve => {
      if (image.complete && image.naturalWidth) return resolve(true);
      image.addEventListener('load', () => resolve(true), { once: true });
      image.addEventListener('error', () => resolve(false), { once: true });
    });
    ready(images[0]).then(async loaded => {
      if (!loaded || !gallery.isConnected) return;
      const results = await Promise.all(images.slice(1).map(image => {
        const wait = ready(image);
        image.srcset = image.dataset.coverSrcset;
        image.src = image.dataset.coverSrc;
        return wait;
      }));
      // Keep the first image visible if a later slide fails, rather than animating into a blank frame.
      if (gallery.isConnected && results.every(Boolean)) gallery.classList.add('ready');
    });
  }
  start();
  window.addEventListener('pjax:success', start);
})();
