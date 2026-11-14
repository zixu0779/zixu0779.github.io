const { stripHTML } = require('hexo-util');

// A configurable estimate, not measured reading time. Include Markdown and code.
const minutesFor = (post, charactersPerMinute = 400) => {
  const source = post._content ?? stripHTML(post.content || '');
  const characters = Array.from(source.replace(/\s/g, '')).length;
  return Math.max(1, Math.ceil(characters / charactersPerMinute));
};
const formatTime = (minutes, suffix = '分钟') => minutes < 60
  ? `${minutes} ${suffix}`
  : `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
const totalMinutes = (site, speed) => {
  let minutes = 0;
  site.posts.forEach(post => { minutes += minutesFor(post, speed); });
  return minutes;
};
if (typeof hexo !== 'undefined') hexo.extend.filter.register('before_generate', () => {
  const { dirname, join } = require('node:path');
  const { readFileSync } = require('node:fs');
  const checkedReplace = require('../lib/checked-replace');
  const layout = join(dirname(require.resolve('hexo-theme-shokax/package.json')), 'layout');
  const post = readFileSync(join(layout, 'post.pug'), 'utf8');
  const mixin = readFileSync(join(layout, '_mixin/postmeta.pug'), 'utf8');
  const metadata = checkedReplace(mixin.replaceAll("__('symbols_count_time.count')",
    "(item.language === 'en' ? 'Characters' : __('symbols_count_time.count'))"),
    /\n +span\(class="text"\)\s*\n +!= __\('symbols_count_time.word'\)/, '', 'article count unit');
  hexo.theme.setView('post.pug', checkedReplace(post, 'include _mixin/postmeta.pug', metadata, 'article metadata'));
  const speed = hexo.config.symbols_count_time.wpm;
  hexo.extend.helper.register('symbolsTime', (post, awl, wpm, suffix) => formatTime(minutesFor(post, speed), suffix));
  hexo.extend.helper.register('symbolsTimeTotal', (site, awl, wpm, suffix) => formatTime(totalMinutes(site, speed), suffix));
});
module.exports = { minutesFor, formatTime, totalMinutes };
