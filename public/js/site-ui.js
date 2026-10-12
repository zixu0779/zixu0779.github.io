(() => {
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Keep native copying; the theme's bubbling handler appends copyright text.
  document.addEventListener(
    "copy",
    (event) => {
      if (event.target.closest?.(".post.block")) event.stopPropagation();
    },
    true,
  );
  let commentCorrection;
  const commentTarget = () =>
    document.getElementById("comments") || document.getElementById("new-comment")?.parentElement;
  const refresh = () => {
    // The theme copies the sidebar menu into the top navigation first.
    if (document.querySelector("#nav .menu .dropdown")) {
      document.querySelector("#sidebar .overview .menu .dropdown")?.remove();
      const menu = document.querySelector("#sidebar .overview .menu");
      if (menu && !menu.querySelector('a[href="/about/"]')) {
        const item = document.createElement("li");
        item.className = "item";
        item.innerHTML = '<a href="/about/" rel="section"><i class="ic i-coffee"></i>关于</a>';
        menu.querySelector('a[href="/friends/"]')?.closest("li")?.after(item);
      }
    }
    const social = document.querySelector("#sidebar .social");
    const emptySocial = JSON.parse(
      document.querySelector("script[data-empty-social]")?.dataset.emptySocial || "[]",
    );
    for (const { name, icon } of emptySocial) {
      if (!social || social.querySelector("." + name)) continue;
      const button = document.createElement("a");
      button.className = "item " + name;
      const glyph = document.createElement("i");
      glyph.className = "ic i-" + icon;
      button.append(glyph);
      social.append(button);
    }
    const brand = document.querySelector("#brand .title");
    if (
      brand?.textContent.trim() === "Z1gg7x's Blog" &&
      !document.querySelector("#brand .artboard")
    ) {
      const heading = document.createElement("p");
      heading.className = "artboard";
      heading.textContent = "Z1gg7x's Blog";
      brand.before(heading);
      brand.textContent = "Build · Play · Tinker";
    }
    document.querySelectorAll(".social a.item").forEach((link) => {
      const missing = !link.getAttribute("href")?.trim();
      link.classList.toggle("unlinked", missing);
      if (missing) {
        link.removeAttribute("href");
        link.setAttribute("role", "button");
        link.setAttribute("aria-label", "B站：暂时还没有哦");
        link.tabIndex = 0;
      }
    });
    const name = document.querySelector("#sidebar .author .name");
    if (name && !name.querySelector("a")) {
      const link = document.createElement("a");
      link.href = "/about/";
      link.title = "关于我";
      link.setAttribute("aria-label", `${name.textContent}：关于我`);
      link.textContent = name.textContent;
      name.replaceChildren(link);
    }
    const comments = commentTarget();
    const chat = document.querySelector("#tool .chat");
    if (chat) {
      chat.hidden = !comments;
      chat.title = document.getElementById("comments") ? "前往评论区" : "前往最新评论";
      chat.setAttribute("role", "button");
      chat.tabIndex = comments ? 0 : -1;
    }
    document.querySelectorAll('[itemprop="copyrightYear"]').forEach((el) => {
      const year = String(new Date().getFullYear());
      if (el.textContent !== year) el.textContent = year;
    });
  };
  document.addEventListener(
    "click",
    (event) => {
      if (!event.target.closest("#tool .chat")) return;
      // The theme treats a missing comment target as scroll position zero.
      event.stopImmediatePropagation();
      event.preventDefault();
      const comments = commentTarget();
      if (!comments) return;
      clearTimeout(commentCorrection);
      comments.scrollIntoView({ behavior: reducedMotion() ? "instant" : "smooth", block: "start" });
      // Lazy-loaded article images can shift the destination during the scroll.
      commentCorrection = setTimeout(() => {
        if (comments.isConnected) comments.scrollIntoView({ behavior: "instant", block: "start" });
      }, 700);
    },
    true,
  );
  document.addEventListener("keydown", (event) => {
    if (
      event.target.matches("#tool .chat, #rightNav .search, .social .unlinked") &&
      ["Enter", " "].includes(event.key)
    ) {
      event.preventDefault();
      event.target.click();
    }
  });
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-friend-copy]");
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.friendCopy);
      const label = button.innerHTML;
      button.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
      button.title = "已复制";
      setTimeout(() => {
        button.innerHTML = label;
      }, 1500);
    } catch {
      button.textContent = "请手动复制";
    }
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".social .unlinked");
    if (!button) return;
    event.preventDefault();
    const notice = document.createElement("div");
    notice.className = "unavailable-message";
    notice.setAttribute("role", "status");
    notice.textContent = "暂时还没有哦";
    document.body.append(notice);
    const anchor = button.getBoundingClientRect();
    notice.style.left =
      Math.max(
        8,
        Math.min((event.clientX || anchor.right) + 12, innerWidth - notice.offsetWidth - 8),
      ) + "px";
    notice.style.top =
      Math.max(
        8,
        Math.min((event.clientY || anchor.bottom) + 8, innerHeight - notice.offsetHeight - 8),
      ) + "px";
    setTimeout(() => {
      if (!reducedMotion()) {
        const canvas = document.createElement("canvas");
        const box = notice.getBoundingClientRect();
        canvas.width = Math.ceil(box.width);
        canvas.height = Math.ceil(box.height);
        const ctx = canvas.getContext("2d");
        const style = getComputedStyle(notice);
        ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.textBaseline = "top";
        ctx.fillText(
          notice.textContent,
          parseFloat(style.paddingLeft),
          parseFloat(style.paddingTop),
        );
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const color = getComputedStyle(notice).color;
        for (let y = 0; y < canvas.height; y += 3)
          for (let x = 0; x < canvas.width; x += 3) {
            if (!pixels[(y * canvas.width + x) * 4 + 3]) continue;
            const dust = document.createElement("span");
            dust.className = "unavailable-dust";
            Object.assign(dust.style, {
              left: box.left + x + "px",
              top: box.top + y + "px",
              width: "3px",
              height: "3px",
              background: color,
            });
            document.body.append(dust);
            dust
              .animate(
                [
                  { transform: "translate(0,0)", opacity: 1 },
                  {
                    transform: `translate(${Math.random() * 50 - 25}px,${40 + Math.random() * 60}px)`,
                    opacity: 0,
                  },
                ],
                { duration: 650 + Math.random() * 350, easing: "ease-in" },
              )
              .finished.then(() => dust.remove());
          }
      }
      notice.remove();
    }, 900);
  });

  const dialog = document.createElement("dialog");
  dialog.id = "local-search";
  dialog.setAttribute("aria-label", "搜索博客");
  dialog.innerHTML =
    '<div class="search-header"><input type="search" aria-label="搜索关键词" placeholder="搜索文章标题、正文或标签…"><button type="button" aria-label="关闭搜索">关闭</button></div><p role="status" aria-live="polite"></p><ul></ul>';
  document.body.append(dialog);
  const input = dialog.querySelector("input");
  const status = dialog.querySelector('[role="status"]');
  const results = dialog.querySelector("ul");
  let index;
  let loading;
  const render = () => {
    results.replaceChildren();
    if (!index) return;
    const words = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) {
      status.textContent = "输入关键词开始搜索";
      return;
    }
    const matches = index
      .map((post) => ({ post, score: window.searchScore(post, input.value) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.post);
    status.textContent = matches.length
      ? `找到 ${matches.length} 篇文章，显示前 30 篇`
      : "没有找到相关文章，试试其他关键词";
    for (const post of matches.slice(0, 30)) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = post.url;
      link.textContent = post.title;
      const snippet = document.createElement("p");
      const position = Math.max(0, post.text.toLocaleLowerCase().indexOf(words[0]) - 40);
      snippet.textContent = (position ? "…" : "") + post.text.slice(position, position + 160) + "…";
      item.append(link, snippet);
      results.append(item);
    }
  };
  const openSearch = async () => {
    if (!dialog.open) dialog.showModal();
    input.focus();
    if (!index) {
      status.textContent = "正在加载搜索索引…";
      try {
        loading ||= fetch("/search.json").then((response) => {
          if (!response.ok) throw new Error("Search index unavailable");
          return response.json();
        });
        index = await loading;
      } catch {
        loading = null;
        status.textContent = "索引加载失败，请检查网络后重新打开搜索";
        return;
      }
    }
    render();
  };
  input.addEventListener("input", render);
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("a")) dialog.close();
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#rightNav .search")) return;
    event.preventDefault();
    openSearch();
  });
  const init = () => {
    const search = document.querySelector("#rightNav .search");
    search?.setAttribute("role", "button");
    search?.setAttribute("aria-label", "搜索博客");
    if (search) search.tabIndex = 0;
    refresh();
    const sidebar = document.getElementById("sidebar");
    const scroller = sidebar.querySelector(".panels > .inner");
    const quick = sidebar.querySelector("#quick");
    const desktop = matchMedia("(min-width: 992px)");
    const holder = sidebar.querySelector(":scope > .inner");
    let docked = false;
    let previousHeight = 0;
    let frame;
    const updateSidebar = () => {
      if (!desktop.matches) {
        sidebar.classList.remove("desktop-docked");
        sidebar.style.minHeight = "";
        holder.style.height = "";
        return;
      }
      const content =
        scroller.scrollHeight +
        quick.offsetHeight +
        parseFloat(getComputedStyle(sidebar.querySelector(".panels")).paddingTop);
      const shouldDock = document.querySelector("main").getBoundingClientRect().top <= 0;
      sidebar.style.minHeight = content + "px";
      if (shouldDock && !docked) {
        sidebar.classList.add("desktop-docked");
        holder.style.height = innerHeight + "px";
        scroller.scrollTop = Math.max(0, content - innerHeight);
      } else if (!shouldDock && docked) {
        sidebar.classList.remove("desktop-docked");
        holder.style.height = "";
        scroller.scrollTop = 0;
      }
      docked = sidebar.classList.contains("desktop-docked");
      if (docked) {
        holder.style.height = innerHeight + "px";
        if (previousHeight && content !== previousHeight)
          scroller.scrollTop += content - previousHeight;
      }
      previousHeight = content;
    };
    const scheduleSidebar = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateSidebar);
    };
    window.addEventListener("scroll", scheduleSidebar, { passive: true });
    window.addEventListener("resize", scheduleSidebar);
    const sidebarSize = new ResizeObserver(scheduleSidebar);
    sidebar.querySelectorAll(".panel").forEach((panel) => sidebarSize.observe(panel));
    // Native scroll chaining passes subsequent wheel events to the page at either edge.
    scroller.style.overscrollBehaviorY = "auto";
    updateSidebar();
    // Theme modules and PJAX can create the toolbar after DOMContentLoaded.
    new MutationObserver(refresh).observe(document.getElementById("container"), {
      childList: true,
      subtree: true,
    });
  };
  window.addEventListener("DOMContentLoaded", init);
  window.addEventListener("pjax:success", refresh);
})();
