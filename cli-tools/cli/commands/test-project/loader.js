const {getOptions} = require('loader-utils');

module.exports = function(content) {
  const options = Object.assign({
    cache: true,
  }, getOptions(this));

  return `import polyfills from '${options.polyfillPath}';\n${content}`;
};
