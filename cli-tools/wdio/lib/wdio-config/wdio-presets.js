const path = require('path');

module.exports.configMap = {
  'none': path.join(__dirname, 'presets', 'none'),
  'default': path.join(__dirname, 'presets', 'default.js'),
  'sauce': path.join(__dirname, 'presets', 'sauce.js')
};
