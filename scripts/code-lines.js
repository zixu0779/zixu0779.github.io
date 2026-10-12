const { createRequire } = require('node:module');
const { stripHTML } = require('hexo-util');
// Reuse the Markdown parser already installed by the site's renderer.
const rendererRequire = createRequire(require.resolve('hexo-renderer-multi-next-markdown-it'));
const parser = new (rendererRequire('markdown-it'))({ html: true });
const codeLines = post => parser.parse(post._content || '', {}).reduce((total, token) =>
  total + (['fence', 'code_block'].includes(token.type) && token.content
    ? token.content.replace(/\n$/, '').split('\n').length : 0), 0);
const wordCount = post => {
  const text = parser.parse(post._content || '', {}).flatMap(token => {
    if (token.type === 'inline') return (token.children || []).filter(child => child.type === 'text').map(child => child.content);
    if (token.type === 'html_block') return stripHTML(token.content.replace(/<(pre|code|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ''));
    return [];
  }).join(' ').replace(/https?:\/\/[^\s<>]+/g, '');
  return (text.match(/\p{Script=Han}/gu) || []).length
    + (text.match(/[\p{Script=Latin}]+(?:['’][\p{Script=Latin}]+)*/gu) || []).length;
};
if (typeof hexo !== 'undefined') hexo.extend.filter.register('before_generate', () => {
  let totals;
  const count = () => {
    if (!totals) {
      totals = { lines: 0, words: 0 };
      hexo.locals.get('posts').forEach(post => { totals.lines += codeLines(post); totals.words += wordCount(post); });
    }
    return totals;
  };
  hexo.extend.helper.register('siteCodeLines', () => count().lines);
  hexo.extend.helper.register('siteWordCount', () => count().words);
});
module.exports = { codeLines, wordCount };
