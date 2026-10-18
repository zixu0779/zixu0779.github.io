const checkedReplace = require('../lib/checked-replace');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

hexo.extend.filter.register('before_generate', () => {
  const { dirname } = require('node:path');
  const template = readFileSync(join(dirname(require.resolve('hexo-theme-shokax/package.json')), 'layout/_partials/footer.pug'), 'utf8');
  const count = readFileSync(join(hexo.source_dir, '_layouts/footer/count.pug'), 'utf8');
  hexo.theme.setView('_partials/footer.pug', checkedReplace(template,
    /    if theme.footer.count[\s\S]*?(?=    if theme.footer.powered)/,
    count.trimEnd().split('\n').map(line => '    ' + line).join('\n') + '\n', 'footer count'
  ));
});

hexo.extend.filter.register('theme_inject', injects => {
  const directory = join(hexo.source_dir, '_layouts/footer');
  // Injection views are relocated by ShokaX; resolve the local includes first.
  const template = readFileSync(join(directory, 'index.pug'), 'utf8').replace(/^([ \t]*)include (\S+)$/gm, (_, indent, name) =>
    readFileSync(join(directory, name), 'utf8').split('\n').map(line => indent + line).join('\n'));
  injects.footer.raw('footer-addon', template);
});
