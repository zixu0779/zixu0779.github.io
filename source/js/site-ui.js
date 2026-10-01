(() => {
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const refresh = () => {
    document.querySelectorAll('[itemprop="copyrightYear"]').forEach(el => {
      const year = String(new Date().getFullYear());
      if (el.textContent !== year) el.textContent = year;
    });
  };
  document.addEventListener('keydown', event => {
    if (event.target.matches('#rightNav .search') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.target.click();
    }
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
    // Theme modules and PJAX can create the toolbar after DOMContentLoaded.
    new MutationObserver(refresh).observe(document.getElementById('container'), { childList: true, subtree: true });
  };
  window.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pjax:success', refresh);
})();
