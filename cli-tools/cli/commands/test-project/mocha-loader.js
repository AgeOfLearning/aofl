const {getOptions} = require('loader-utils');

module.exports = function(content) {
  const options = Object.assign({
    cache: true,
  }, getOptions(this));

  try {
    const mochaStr = JSON.stringify(options.mocha);
    return content.replace(/window\.mochaConfig = {}/, 'window.mochaConfig = ' + mochaStr);
  } catch (e) {
    return content;
  }
};
