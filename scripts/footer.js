const { readFileSync } = require('node:fs');
const { join } = require('node:path');

hexo.extend.filter.register('theme_inject', injects => {
  const directory = join(hexo.source_dir, '_layouts/footer');
  // Injection views are relocated by ShokaX; resolve the local includes first.
  const template = readFileSync(join(directory, 'index.pug'), 'utf8').replace(/^([ \t]*)include (\S+)$/gm, (_, indent, name) =>
    readFileSync(join(directory, name), 'utf8').split('\n').map(line => indent + line).join('\n'));
  injects.footer.raw('footer-addon', template);
});
