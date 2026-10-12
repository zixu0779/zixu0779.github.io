(() => {
  const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-friend-copy]");
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.friendCopy);
      button.setAttribute("aria-label", "已复制");
    } catch {
      button.setAttribute("aria-label", "复制失败");
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest(".reward button")) {
      const qr = document.querySelector("#qr");
      if (qr) qr.classList.toggle("migration-open");
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".social .unlinked")) {
      event.preventDefault();
      event.target.click();
    }
  });
})();

const footerYear=document.querySelector('[itemprop="copyrightYear"]');if(footerYear)footerYear.textContent=String(new Date().getFullYear())+' ';
