const fs = require('fs');
const loaderUtils = require('loader-utils');
const uniki = require('uniki');

const defaultOptions = {
  tags: []
};

const escapeRegExp = (str) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

module.exports = function(content) {
  this.cacheable(true);
  const relativePath = this.resourcePath.replace(process.cwd(), '');
  const sourcePath = this.resourcePath;
  let updated = false;
  let {tags} = Object.assign({}, defaultOptions, loaderUtils.getOptions(this) || {});

  for (let i = 0; i < tags.length; i++) {
    let match = null;
    let tag = tags[i];
    let tagRegex = new RegExp(`<${escapeRegExp(tag)}\\b(?:(?!dom-scope)(.|\\s))*?>`, 'g');
    let count = 0;
    while (match = tagRegex.exec(content)) {
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
    }
  }

  if (updated) {
    fs.writeFileSync(sourcePath, content);
  }

  return content;
};
