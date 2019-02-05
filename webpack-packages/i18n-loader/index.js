const glob = require('fast-glob');
const LANG_CODE_REGEX = /translations_(.*)\.json/;
const schema = require('./__config/schema.json');
const validationOptions = require('schema-utils');
const {getOptions} = require('loader-utils');

module.exports = function() {
  const options = Object.assign({
    cache: true,
  }, getOptions(this));

  validationOptions(schema, options, '@aofl/i18n-loader');

  if (options.cache === false) {
    this.cacheable(false);
  }

  let out = 'export default {';
  const dirname = this.resourcePath.substr(0, this.resourcePath.lastIndexOf('/'));
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
