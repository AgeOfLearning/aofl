const glob = require('fast-glob');
const LANG_CODE_REGEX = /translations_(.*)\.json/;

module.exports = function(content, map, meta) {
  this.cacheable(false);

  let out = 'export default {';
  const dirname = this.resourcePath.substr(0, this.resourcePath.lastIndexOf('/')); ;
  const files = glob.sync(['translations_*.json'], {
    cwd: dirname
  });

  for (let i = 0; i < files.length; i++) {
    const matches = LANG_CODE_REGEX.exec(files[i]);
    if (matches !== null) {
      out += `
  '${matches[1]}': () => import('./${files[i]}'),
`;
    }
  }

  out += '}';
  return out;
};
