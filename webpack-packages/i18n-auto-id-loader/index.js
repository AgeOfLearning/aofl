const {TtTag} = require('../../cli-tools/cli-lib');
const fs = require('fs');
const schema = require('./__config/schema.json');
const validationOptions = require('schema-utils');
const {getOptions} = require('loader-utils');

module.exports = function(content) {
  const options = Object.assign({
    cache: true,
  }, getOptions(this));

  validationOptions(schema, options, '@aofl/i18n-loader');

  if (options.cache === false) {
    this.cacheable(false);
  }

  const sourcePath = this.resourcePath;
  const ttTags = TtTag.addIds(content);

  if (ttTags !== content) {
    fs.writeFileSync(sourcePath, ttTags);
  }
  return ttTags;
};
