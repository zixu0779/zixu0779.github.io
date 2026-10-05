(() => {
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const refresh = () => {
    const sidebarMenu = document.querySelector('#sidebar .overview .menu');
    if (sidebarMenu && !sidebarMenu.dataset.hoverReady) {
      sidebarMenu.dataset.hoverReady = 'true';
      const highlight = event => {
        const link = event.target.closest('.item > a');
        if (!link || !sidebarMenu.contains(link)) return;
        const box = link.getBoundingClientRect(), menuBox = sidebarMenu.getBoundingClientRect();
        for (const [key, value] of Object.entries({ x: box.left - menuBox.left, y: box.top - menuBox.top, w: box.width, h: box.height })) sidebarMenu.style.setProperty('--hover-' + key, value + 'px');
        sidebarMenu.classList.toggle('hover-visible', !link.parentElement.classList.contains('active'));
      };
      sidebarMenu.addEventListener('pointerover', highlight);
      sidebarMenu.addEventListener('focusin', highlight);
      sidebarMenu.addEventListener('pointerleave', () => requestAnimationFrame(() => { if (!sidebarMenu.matches(':hover')) sidebarMenu.classList.remove('hover-visible'); }));
      sidebarMenu.addEventListener('focusout', event => { if (!sidebarMenu.contains(event.relatedTarget) && !sidebarMenu.matches(':hover')) sidebarMenu.classList.remove('hover-visible'); });
    }
    // The theme copies the sidebar menu into the top navigation first.
    if (document.querySelector('#nav .menu .dropdown')) {
      document.querySelector('#sidebar .overview .menu .dropdown')?.remove();
      const menu = document.querySelector('#sidebar .overview .menu');
      if (menu && !menu.querySelector('a[href="/about/"]')) {
        const item = document.createElement('li');
        item.className = 'item';
        item.innerHTML = '<a href="/about/" rel="section"><i class="ic i-coffee"></i>关于</a>';
        menu.querySelector('a[href="/friends/"]')?.closest('li')?.after(item);
      }

    }
    const social = document.querySelector('#sidebar .social');
    const emptySocial = JSON.parse(document.querySelector('script[data-empty-social]')?.dataset.emptySocial || '[]');
    for (const { name, icon } of emptySocial) {
      if (!social || social.querySelector('.' + name)) continue;
      const button = document.createElement('a');
      button.className = 'item ' + name;
      const glyph = document.createElement('i');
      glyph.className = 'ic i-' + icon;
      button.append(glyph);
      social.append(button);
    }
    const brand = document.querySelector('#brand .title');
    if (brand?.textContent.trim() === "Z1gg7x's Blog" && !document.querySelector('#brand .artboard')) {
      const heading = document.createElement('p');
      heading.className = 'artboard';
      heading.textContent = "Z1gg7x's Blog";
      brand.before(heading);
      brand.textContent = 'Build · Play · Tinker';
    }
    document.querySelectorAll('.social a.item').forEach(link => {
      const missing = !link.getAttribute('href')?.trim();
      link.classList.toggle('unlinked', missing);
      if (missing) {
        link.removeAttribute('href');
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', 'B站：暂时还没有哦');
        link.tabIndex = 0;
      }
    });
    document.querySelectorAll('[itemprop="copyrightYear"]').forEach(el => {
      const year = String(new Date().getFullYear());
      if (el.textContent !== year) el.textContent = year;
    });
  };
  document.addEventListener('keydown', event => {
    if (event.target.matches('#rightNav .search, .social .unlinked') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.target.click();
    }
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('.social .unlinked');
    if (!button) return;
    event.preventDefault();
    const notice = document.createElement('div');
    notice.className = 'unavailable-message';
    notice.setAttribute('role', 'status');
    notice.textContent = '暂时还没有哦';
    document.body.append(notice);
    const anchor = button.getBoundingClientRect();
    notice.style.left = Math.max(8, Math.min((event.clientX || anchor.right) + 12, innerWidth - notice.offsetWidth - 8)) + 'px';
    notice.style.top = Math.max(8, Math.min((event.clientY || anchor.bottom) + 8, innerHeight - notice.offsetHeight - 8)) + 'px';
    setTimeout(() => {
      if (!reducedMotion()) {
        const canvas = document.createElement('canvas');
        const box = notice.getBoundingClientRect();
        canvas.width = Math.ceil(box.width);
        canvas.height = Math.ceil(box.height);
        const ctx = canvas.getContext('2d');
        const style = getComputedStyle(notice);
        ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.textBaseline = 'top';
        ctx.fillText(notice.textContent, parseFloat(style.paddingLeft), parseFloat(style.paddingTop));
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const color = getComputedStyle(notice).color;
        for (let y = 0; y < canvas.height; y += 3) for (let x = 0; x < canvas.width; x += 3) {
          if (!pixels[(y * canvas.width + x) * 4 + 3]) continue;
          const dust = document.createElement('span');
          dust.className = 'unavailable-dust';
          Object.assign(dust.style, { left: box.left + x + 'px', top: box.top + y + 'px', width: '3px', height: '3px', background: color });
          document.body.append(dust);
          dust.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${Math.random() * 50 - 25}px,${40 + Math.random() * 60}px)`, opacity: 0 }], { duration: 650 + Math.random() * 350, easing: 'ease-in' }).finished.then(() => dust.remove());
        }
      }
      notice.remove();
    }, 900);
  });

  const dialog = document.createElement('dialog');
  dialog.id = 'local-search';
  dialog.setAttribute('aria-label', '搜索博客');
  dialog.innerHTML = '<div class="search-header"><input type="search" aria-label="搜索关键词" placeholder="搜索文章标题、正文或标签…"><button type="button" aria-label="关闭搜索">关闭</button></div><p role="status" aria-live="polite"></p><ul></ul>';
  document.body.append(dialog);
  const input = dialog.querySelector('input');
  const status = dialog.querySelector('[role="status"]');
  const results = dialog.querySelector('ul');
  let index;
  let loading;
  const render = () => {
    results.replaceChildren();
    if (!index) return;
    const words = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) { status.textContent = '输入关键词开始搜索'; return; }
    const matches = index.map(post => ({ post, score: window.searchScore(post, input.value) }))
      .filter(result => result.score > 0).sort((a, b) => b.score - a.score).map(result => result.post);
    status.textContent = matches.length ? `找到 ${matches.length} 篇文章，显示前 30 篇` : '没有找到相关文章，试试其他关键词';
    for (const post of matches.slice(0, 30)) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = post.url;
      link.textContent = post.title;
      const snippet = document.createElement('p');
      const position = Math.max(0, post.text.toLocaleLowerCase().indexOf(words[0]) - 40);
      snippet.textContent = (position ? '…' : '') + post.text.slice(position, position + 160) + '…';
      item.append(link, snippet);
      results.append(item);
    }
  };
  const openSearch = async () => {
    if (!dialog.open) dialog.showModal();
    input.focus();
    if (!index) {
      status.textContent = '正在加载搜索索引…';
      try {
        loading ||= fetch('/search.json').then(response => {
          if (!response.ok) throw new Error('Search index unavailable');
          return response.json();
        });
        index = await loading;
      } catch {
        loading = null;
        status.textContent = '索引加载失败，请检查网络后重新打开搜索';
        return;
      }
    }
    render();
  };
  input.addEventListener('input', render);
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target.closest('a')) dialog.close();
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#rightNav .search')) return;
    event.preventDefault();
    openSearch();
  });
  const init = () => {
    const search = document.querySelector('#rightNav .search');
    search?.setAttribute('role', 'button');
    search?.setAttribute('aria-label', '搜索博客');
    if (search) search.tabIndex = 0;
    refresh();
    const sidebar = document.getElementById('sidebar');
    const scroller = sidebar.querySelector('.panels > .inner');
    const quick = sidebar.querySelector('#quick');
    const desktop = matchMedia('(min-width: 992px)');
    const holder = sidebar.querySelector(':scope > .inner');
    let frame;
    const updateSidebar = () => {
      if (!desktop.matches) {
        sidebar.classList.remove('desktop-docked');
        sidebar.style.minHeight = '';
        holder.style.height = '';
        scroller.style.maxHeight = '';
        scroller.style.overflow = '';
        return;
      }
      const panelsStyle = getComputedStyle(sidebar.querySelector('.panels'));
      const padding = parseFloat(panelsStyle.paddingTop) + parseFloat(panelsStyle.paddingBottom);
      // Measure real panels, not the stretched scrolling viewport.
      const naturalHeight = Array.from(scroller.children)
        .filter(panel => getComputedStyle(panel).display !== 'none')
        .reduce((height, panel) => height + panel.offsetHeight, 0);
      const tabHeight = holder.querySelector('.tab')?.offsetHeight || 0;
      const topSpace = parseFloat(getComputedStyle(holder).paddingTop) || 0;
      const available = Math.max(0, innerHeight - quick.offsetHeight - tabHeight - padding - topSpace);
      const shouldDock = document.querySelector('main').getBoundingClientRect().top <= 0;
      sidebar.classList.toggle('desktop-docked', shouldDock);
      sidebar.style.minHeight = naturalHeight + padding + tabHeight + topSpace + quick.offsetHeight + 'px';
      holder.style.height = shouldDock ? innerHeight + 'px' : '';
      const needsScroll = shouldDock && naturalHeight > available;
      const shadowSpace = parseFloat(getComputedStyle(scroller).paddingTop) || 0;
      scroller.style.maxHeight = needsScroll ? available + shadowSpace + 'px' : '';
      scroller.style.overflow = needsScroll ? 'hidden auto' : 'visible';
      if (!needsScroll) scroller.scrollTop = 0;
    };
    const scheduleSidebar = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateSidebar);
    };
    window.addEventListener('scroll', scheduleSidebar, { passive: true });
    window.addEventListener('resize', scheduleSidebar);
    const sidebarSize = new ResizeObserver(scheduleSidebar);
    sidebar.querySelectorAll('.panel').forEach(panel => sidebarSize.observe(panel));
    // Native scroll chaining passes subsequent wheel events to the page at either edge.
    scroller.style.overscrollBehaviorY = 'auto';
    updateSidebar();
    // Theme modules and PJAX can create the toolbar after DOMContentLoaded.
    new MutationObserver(refresh).observe(document.getElementById('container'), { childList: true, subtree: true });
  };
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pjax:success', refresh);
})();
