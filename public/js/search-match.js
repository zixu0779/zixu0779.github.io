(() => {
  const normalize = (value) =>
    String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/cyberpunk(?:[\s-]*2077)?|cp[\s-]*2077|赛博朋克(?:[\s-]*2077)?/g, "cp2077")
      .replace(/[\s_-]+/g, " ")
      .trim();
  const score = (post, query) => {
    const words = normalize(query).split(" ").filter(Boolean);
    if (!words.length) return 0;
    const fields = [post.title, post.tags, post.categories, post.text].map(normalize);
    if (!words.every((word) => fields.some((field) => field.includes(word)))) return 0;
    return words.reduce(
      (total, word) =>
        total +
        fields.reduce((sum, field, i) => sum + (field.includes(word) ? [8, 5, 4, 1][i] : 0), 0),
      0,
    );
  };
  if (typeof module !== "undefined") module.exports = score;
  else window.searchScore = score;
})();
