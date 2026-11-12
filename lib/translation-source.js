const { createHash } = require('node:crypto');
const yaml = require('js-yaml');

function readMarkdown(raw) {
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/.exec(raw.replace(/\r\n?/g, '\n'));
  if (!match) throw new Error('Expected Markdown front matter');
  return { meta: yaml.load(match[1]), body: match[2] };
}

function sourceDigest({ meta, body }) {
  const fields = ['title', 'description', 'subtitle', 'excerpt'].map(key => meta[key] ?? null);
  return createHash('sha256').update(JSON.stringify([...fields, body.trimEnd()])).digest('hex');
}

module.exports = { readMarkdown, sourceDigest };
