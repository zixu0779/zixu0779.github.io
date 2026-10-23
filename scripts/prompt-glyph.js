// Load the single-glyph font only in articles that explicitly request it.
hexo.extend.filter.register('after_post_render', post => {
  if (post.prompt_glyph) post.content += `<style id="zsh-prompt-glyph-font">
@font-face {
  font-family: "Zsh Prompt Glyph";
  src: url("/fonts/zsh-prompt/glyph.woff2") format("woff2");
  font-display: swap;
  unicode-range: U+E23A;
}
.md:has(#zsh-prompt-glyph-font) code,
.md:has(#zsh-prompt-glyph-font) pre {
  font-family: "Zsh Prompt Glyph", Inconsolata, consolas, Menlo, -apple-system, "PingFang SC", "Microsoft YaHei";
}
</style>`;
  return post;
});
