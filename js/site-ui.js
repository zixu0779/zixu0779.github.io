(() => {
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Keep native copying; the theme's bubbling handler appends copyright text.
  document.addEventListener('copy', event => {
    if (event.target.closest?.('.post.block')) event.stopPropagation();
  }, true);
  const commentTarget = () => document.getElementById('comments') || document.getElementById('new-comment')?.parentElement;
  let cancelCommentScroll = () => {};
  const scrollToTarget = (resolveTarget, section = commentTarget()) => {
    cancelCommentScroll();
    const root = document.scrollingElement;
    const key = location.pathname + location.hash;
    const from = root.scrollTop, start = performance.now();
    const oldBehavior = root.style.scrollBehavior, oldAnchor = root.style.overflowAnchor;
    root.style.scrollBehavior = 'auto';
    root.style.overflowAnchor = 'none';
    let frame, previousTime = start, previousTop, stableSince = start, preparedTarget;
    const cancel = event => {
      if (event?.type === 'keydown' && !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return;
      cancelAnimationFrame(frame);
      for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(type, cancel);
      root.style.scrollBehavior = oldBehavior;
      root.style.overflowAnchor = oldAnchor;
      cancelCommentScroll = () => {};
    };
    cancelCommentScroll = cancel;
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.addEventListener(type, cancel, { passive: true });
    const tick = now => {
      if (!section?.isConnected || location.pathname + location.hash !== key) { cancel(); return; }
      const target = typeof resolveTarget === 'function' ? resolveTarget() : resolveTarget;
      if (section.id === 'comments' && window.shokaXPrepareCommentAnchor && preparedTarget !== target) {
        preparedTarget = target;
        window.shokaXPrepareCommentAnchor(target).catch(console.error);
      }
      const navHeight = document.getElementById('nav')?.getBoundingClientRect().height || 0;
      const top = Math.max(0, Math.min(root.scrollHeight - root.clientHeight,
        target.getBoundingClientRect().top + root.scrollTop - navHeight));
      const progress = Math.min(1, (now - start) / 500);
      const eased = progress < .5 ? 2 * progress ** 2 : 1 - (-2 * progress + 2) ** 2 / 2;
      // Start immediately with the theme's easing; follow late layout shifts without another jump.
      root.scrollTop = reducedMotion() ? top : progress < 1 ? from + (top - from) * eased
        : root.scrollTop + (top - root.scrollTop) * (1 - Math.exp(-(now - previousTime) / 80));
      if (previousTop === undefined || Math.abs(top - previousTop) > .5 || Math.abs(root.scrollTop - top) > 1) stableSince = now;
      previousTop = top;
      previousTime = now;
      const ready = section.id !== 'comments' || (section.querySelector('.wl-cards') && !section.querySelector('.wl-cards ~ .wl-loading'));
      const imagesReady = Array.from(document.querySelectorAll('main img')).every(image =>
        !(target.contains(image) || (image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) ||
        (image.complete && !image.dataset.src && !image.dataset.srcset));
      if ((progress === 1 && ready && imagesReady && now - stableSince > 350) || now - start > 8000) { cancel(); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };
  const loadComments = section => window.shokaXCommentSection === section ? window.shokaXLoadComments() : null;
  const updateAvatar = image => {
    const avatar = image.closest('[data-avatar-fallback]');
    if (!avatar) return;
    const loaded = image.complete && image.naturalWidth > 0;
    image.classList.toggle('avatar-loaded', loaded);
    avatar.classList.toggle('avatar-placeholder', !loaded);
  };
  for (const type of ['load', 'error']) document.addEventListener(type, event => {
    if (event.target.tagName === 'IMG') updateAvatar(event.target);
  }, true);
  const updateProgress = () => {
    const root = document.scrollingElement;
    const maximum = Math.max(0, root.scrollHeight - root.clientHeight);
    const offset = Math.max(0, root.scrollTop);
    const value = maximum > 0 ? (offset >= maximum - .5 ? 100 : Math.min(99, Math.floor(offset / maximum * 100))) : 100;
    const label = document.querySelector('#tool .page-scroll-progress');
    if (label && label.textContent !== value + '%') label.textContent = value + '%';
  };
  const updateCategoryLines = () => {
    document.querySelectorAll('.category-directory > section').forEach(section => {
      const nodes = Array.from(section.querySelectorAll('.item')).filter(node => !node.hidden && (!node.closest('details') || node.matches('summary') || node.closest('details').open));
      const box = section.getBoundingClientRect();
      const center = node => node.getBoundingClientRect().top - box.top + parseFloat(getComputedStyle(node, '::before').top);
      const values = { '--line-start': center(nodes[0]), '--line-solid': center(nodes[1]), '--line-end': Math.min(box.height, center(nodes.at(-1))) };
      for (const [key, value] of Object.entries(values)) if (section.style.getPropertyValue(key) !== value + 'px') section.style.setProperty(key, value + 'px');
    });
  };
  let layoutFrame;
  const scheduleLayout = () => {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => { updateProgress(); updateCategoryLines(); });
  };
  window.addEventListener('scroll', scheduleLayout, { passive: true });
  window.addEventListener('resize', scheduleLayout);
  const categorySize = new ResizeObserver(scheduleLayout);
  let commentAnchor;
  const locateComment = () => {
    const id = location.hash.slice(1);
    if (!/^[a-f0-9]{24}$/i.test(id)) {
      if (commentAnchor) cancelCommentScroll();
      commentAnchor = null;
      return;
    }
    const key = location.pathname + location.hash;
    const section = document.getElementById('comments');
    if (!section) return;
    if (commentAnchor?.key !== key || commentAnchor.section !== section) commentAnchor = { key, section, loading: false, started: false };
    if (!commentAnchor.started) {
      commentAnchor.started = true;
      scrollToTarget(() => {
        const target = document.getElementById(id);
        return target && section.contains(target) ? target : section;
      }, section);
    }
    if (!commentAnchor.loading) {
      const loading = loadComments(section);
      if (!loading) return;
      commentAnchor.loading = true;
      loading.catch(error => { if (commentAnchor?.key === key) commentAnchor.loading = false; console.error('Comments failed to load', error); });
    }
  };
  window.addEventListener('hashchange', locateComment);
  window.addEventListener('shokax:comments-ready', locateComment);
  let categoryAnchor;
  const locateCategory = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const group = document.getElementById(id);
    if (!group?.matches('.category-group')) { categoryAnchor = null; return; }
    const details = group.querySelector('details');
    if (!details?.dataset.ready || categoryAnchor === details) return;
    categoryAnchor = details;
    details.dispatchEvent(new Event('category:open'));
  };
  window.addEventListener('hashchange', locateCategory);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('data-category-page') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash.startsWith('#category-')) return;
    let group;
    try { group = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
    if (!group?.matches('.category-group')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    categoryAnchor = null;
    locateCategory();
  }, true);
  document.addEventListener('click', event => {
    const link = event.target.closest('#new-comment a');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !/^#[a-f0-9]{24}$/i.test(url.hash)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    history.pushState(null, '', url.hash);
    commentAnchor = null;
    locateComment();
  }, true);
  const refresh = () => {
    locateComment();
    document.querySelectorAll('[data-avatar-fallback] img').forEach(image => {
      updateAvatar(image);
    });
    document.querySelectorAll('.category-group details:not([data-ready])').forEach(details => {
      details.dataset.ready = 'true';
      let page = 0, animation, fade;
      const content = details.querySelector('.category-content');
      const rows = Array.from(details.querySelectorAll('.category-full .item.normal'));
      const pages = Math.ceil(rows.length / 5);
      const update = () => {
        rows.forEach((row, index) => { row.hidden = Math.floor(index / 5) !== page; });
        details.querySelectorAll('[data-pagination-page]').forEach(nav => {
          nav.hidden = Number(nav.dataset.paginationPage) !== page;
        });
      };
      const transition = (change, close = false) => {
        const from = details.open ? content.getBoundingClientRect().height : 0;
        animation?.cancel();
        fade?.cancel();
        details.open = true;
        change();
        const to = close ? 0 : content.getBoundingClientRect().height;
        details.dataset.expanded = String(!close);
        animation = content.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: reducedMotion() ? 0 : 240, easing: 'ease-in-out' });
        animation.onfinish = () => { if (close) details.open = false; scheduleLayout(); };
      };
      details.addEventListener('category:close', () => transition(() => {}, true));
      details.addEventListener('category:open', () => {
        document.querySelectorAll('.category-group details[data-expanded="true"]').forEach(other => {
          if (other !== details) other.dispatchEvent(new Event('category:close'));
        });
        transition(() => { page = 0; update(); });
        if (details.isConnected && categoryAnchor === details) {
          const group = details.closest('.category-group');
          scrollToTarget(group, group);
        }
      });
      details.addEventListener('click', event => {
        if (event.target.closest('summary')) {
          event.preventDefault();
          const close = details.dataset.expanded === 'true';
          if (!close) document.querySelectorAll('.category-group details[data-expanded="true"]').forEach(other => { if (other !== details) other.dispatchEvent(new Event('category:close')); });
          transition(() => { if (!close) { page = 0; update(); } }, close);
          return;
        }
        const button = event.target.closest('[data-category-page]');
        if (!button) return;
        event.preventDefault();
        if (fade?.playState === 'running') return;
        const nextPage = Math.max(0, Math.min(pages - 1, Number(button.dataset.categoryPage) - 1));
        if (nextPage === page) return;
        const changePage = () => {
          transition(() => { page = nextPage; update(); });
          fade = content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reducedMotion() ? 0 : 180, easing: 'ease-out' });
        };
        if (reducedMotion()) { changePage(); return; }
        fade = content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, easing: 'ease-in', fill: 'forwards' });
        fade.onfinish = changePage;
      });
      update();
      categorySize.observe(details.closest('.category-group').parentElement);
    });
    locateCategory();
    const topButton = document.querySelector('#tool .back-to-top');
    if (topButton && !topButton.querySelector('.page-scroll-progress')) {
      const label = document.createElement('span');
      label.className = 'page-scroll-progress';
      topButton.append(label);
    }
    scheduleLayout();
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
    const name = document.querySelector('#sidebar .author .name');
    if (name && !name.querySelector('a')) {
      const link = document.createElement('a');
      link.href = '/about/';
      link.title = '关于我';
      link.setAttribute('aria-label', `${name.textContent}：关于我`);
      link.textContent = name.textContent;
      name.replaceChildren(link);
    }
    const tool = document.getElementById('tool');
    if (tool && !tool.querySelector('#nyx-show-btn')) {
      const player = tool.querySelector('.player');
      if (player) player.innerHTML = '<button id="nyx-show-btn" aria-label="显示或隐藏播放器"><i class="ic i-music"></i></button><button id="nyx-play-btn" aria-label="播放或暂停"><i class="ic i-play"></i></button>';
      const top = tool.querySelector('.back-to-top');
      const chat = tool.querySelector('.chat');
      if (top) tool.prepend(top);
      if (chat) top?.after(chat);
      if (player) chat?.after(player);
      for (const [selector, label] of [['.back-to-top', '返回顶部'], ['.contents', '切换侧栏']]) {
        const button = tool.querySelector(selector);
        if (button) { button.setAttribute('role', 'button'); button.setAttribute('aria-label', label); button.tabIndex = 0; }
      }
    }
    const comments = commentTarget();
    const chat = document.querySelector('#tool .chat');
    if (chat) {
      chat.hidden = !comments;
      chat.title = document.getElementById('comments') ? '前往评论区' : '前往最新评论';
      chat.setAttribute('role', 'button');
      chat.tabIndex = comments ? 0 : -1;
    }
    document.querySelectorAll('[itemprop="copyrightYear"]').forEach(el => {
      const year = String(new Date().getFullYear());
      if (el.textContent !== year) el.textContent = year;
    });
  };
  document.addEventListener('click', event => {
    if (!event.target.closest('#tool .chat')) return;
    // The theme treats a missing comment target as scroll position zero.
    event.stopImmediatePropagation();
    event.preventDefault();
    const comments = commentTarget();
    if (!comments) return;
    loadComments(comments)?.catch(error => console.error('Comments failed to load', error));
    scrollToTarget(comments);
  }, true);
  document.addEventListener('keydown', event => {
    if (event.target.matches('#tool .chat, #tool .back-to-top, #tool .contents, #rightNav .search, .social .unlinked') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.target.click();
    }
  });
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-friend-copy]');
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.friendCopy);
      const label = button.innerHTML;
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
      button.title = '已复制';
      setTimeout(() => { button.innerHTML = label; }, 1500);
    } catch {
      button.textContent = '请手动复制';
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
