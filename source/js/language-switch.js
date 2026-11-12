(() => {
  function update() {
    const link = document.querySelector('#rightNav a[hreflang]');
    if (!link) return;
    const english = location.pathname.startsWith('/en/');
    const url = new URL(link.dataset.counterpart, location.origin);
    link.hreflang = english ? 'zh-CN' : 'en';
    url.hash = '';
    const top = (document.querySelector('#nav')?.getBoundingClientRect().height || 0) + 12;
    const comments = document.getElementById('comments');
    if (location.pathname.endsWith('/categories/')) {
      url.search = location.search;
      url.hash = location.hash;
    } else if (location.pathname.endsWith('/archives/')) {
      for (const month of document.querySelectorAll('.astro-archive h3[id]')) {
        if (month.getBoundingClientRect().top > top) break;
        url.hash = month.id;
      }
    } else if (comments && comments.getBoundingClientRect().top < innerHeight * 0.7 && comments.getBoundingClientRect().bottom > top) {
      const id = location.hash.slice(1);
      const box = /^[a-f0-9]{24}$/i.test(id) && document.getElementById(id)?.getBoundingClientRect();
      url.hash = box && box.top < innerHeight && box.bottom > top ? id : 'comments';
    } else {
      const headings = document.querySelectorAll('[itemprop="articleBody"] :is(h1,h2,h3,h4,h5,h6)[id]');
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > top) break;
        url.hash = heading.dataset.section || heading.id;
      }
    }
    link.href = url.href;
  }
  let frame;
  function queue() {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); });
  }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('pjax:success', queue);
  document.addEventListener('pjax:complete', queue);
  document.addEventListener('focusin', event => { if (event.target.matches('#rightNav a[hreflang]')) update(); });
  document.addEventListener('click', event => {
    const link = event.target.closest('#rightNav a[hreflang]');
    if (!link) return;
    update();
    if (event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
      location.assign(link.href);
    }
  }, true);
  queue();
})();
