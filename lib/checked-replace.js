// Required theme edits must match exactly once; never silently skip an upstream change.
module.exports = function checkedReplace(source, before, after, label) {
  const matches = typeof before === 'string' ? source.split(before).length - 1 : [...source.matchAll(new RegExp(before.source, 'g'))].length;
  if (matches !== 1) throw new Error(`Theme patch ${label}: expected 1 match, found ${matches}; review theme compatibility.`);
  return source.replace(before, after);
};
