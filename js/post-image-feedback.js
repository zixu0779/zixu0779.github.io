(() => {
  const images = new WeakMap();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) images.get(entry.target).visible(entry.isIntersecting);
  });

  function attach(image) {
    const english = image.closest('article').lang === 'en';
    const frame = document.createElement('span');
    frame.className = 'post-image-frame';
    frame.style.setProperty('--frame-width', image.style.getPropertyValue('--article-image-width'));
    frame.style.setProperty('--frame-ratio', image.style.getPropertyValue('--article-image-ratio'));
    const content = image.closest('a') || image.closest('picture') || image;
    content.before(frame);
    frame.append(content);
    const feedback = document.createElement('span');
    feedback.className = 'post-image-feedback';
    frame.append(feedback);
    let timer;

    function pending() {
      clearTimeout(timer);
      frame.dataset.state = 'pending';
      feedback.replaceChildren();
      feedback.setAttribute('role', 'img');
      feedback.setAttribute('aria-label', english ? 'Loading image' : '图片加载中');
      observer.observe(image);
    }

    function finish() {
      clearTimeout(timer);
      observer.unobserve(image);
      feedback.replaceChildren();
      feedback.removeAttribute('role');
      feedback.removeAttribute('aria-label');
      delete frame.dataset.state;
    }

    function failed() {
      finish();
      frame.dataset.state = 'failed';
      feedback.innerHTML = `<span class="post-image-error">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/>
          <path d="m4 17 5-5 3 3 3-4 5 6"/>
        </svg>
        <span class="post-image-alt"></span><small role="status"></small><button type="button"></button>
      </span>`;
      const caption = feedback.querySelector('.post-image-alt');
      caption.textContent = image.alt;
      caption.title = image.alt;
      feedback.querySelector('small').textContent = english ? 'Image failed to load' : '图片加载失败';
      const retry = feedback.querySelector('button');
      retry.textContent = english ? 'Retry' : '重新加载';
      retry.onclick = () => {
        frame.querySelector('a')?.focus({ preventScroll: true });
        pending();
        // Setting src again retries even a previously broken request (including srcset images).
        image.src = image.getAttribute('src') || image.currentSrc;
      };
    }

    images.set(image, {
      visible(inside) {
        clearTimeout(timer);
        if (!['pending', 'slow'].includes(frame.dataset.state)) return;
        frame.dataset.state = 'pending';
        if (inside) timer = setTimeout(() => {
          if (image.isConnected) frame.dataset.state = 'slow';
        }, 800);
      }
    });
    image.addEventListener('load', finish);
    image.addEventListener('error', failed);
    // Native lazy loading reports failures on the actual img, including unoptimized GIFs.
    for (const name of ['srcset', 'src']) {
      if (image.dataset[name]) {
        image.setAttribute(name, image.dataset[name]);
        delete image.dataset[name];
      }
    }
    if (!image.complete) pending();
    else if (!image.naturalWidth) failed();
  }

  function init() {
    observer.disconnect();
    for (const image of document.querySelectorAll('.article.wrap article.post .body.md img:not(.emoji):not(.vemoji):not(.links img):not(.gallery img)')) {
      if (!images.has(image)) attach(image);
      else if (image.closest('.post-image-frame[data-state="pending"], .post-image-frame[data-state="slow"]')) observer.observe(image);
    }
  }
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pjax:success', init);
})();
