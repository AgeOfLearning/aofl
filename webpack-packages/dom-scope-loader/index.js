const fs = require('fs');
const {getOptions} = require('loader-utils');
const uniki = require('uniki');
const schema = require('./__config/schema.json');
const validationOptions = require('schema-utils');

const escapeRegExp = (str) => {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
};

module.exports = function(content) {
  const relativePath = this.resourcePath.replace(process.cwd(), '');
  const sourcePath = this.resourcePath;
  const options = Object.assign({
    tags: [],
    cache: true
  }, getOptions(this));
  let updated = false;

  validationOptions(schema, options, 'Web components css loader');

  if (options.cache === false) {
    this.cacheable(false);
  }

  for (let i = 0; i < options.tags.length; i++) {
    const tag = options.tags[i];
    const tagRegex = new RegExp(`<${escapeRegExp(tag)}\\b(?:(?!dom-scope)(.|\\s))*?>`, 'g');
    let match = tagRegex.exec(content);
    let count = 0;
    while (match) {
      let id = uniki(`${relativePath}-${tag}-${count}`);
      let idRegex = new RegExp(escapeRegExp(id), 'g');
      while (idRegex.exec(content)) {
        count++;
        id = uniki(`${relativePath}-${tag}-${count}`);
        idRegex = new RegExp(escapeRegExp(id), 'g');
      }
      content = content.substring(0, match.index + tag.length + 1) + ` dom-scope="${id}"` + content.substring(match.index + tag.length + 1);
      count++;
      updated = true;
      match = tagRegex.exec(content);
    }
  }

  if (updated) {
    fs.writeFileSync(sourcePath, content);
  }

  return content;
};
