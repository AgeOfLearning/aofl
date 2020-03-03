const path = require('path');

module.exports.configMap = {
  'none': path.join(__dirname, 'presets', 'none'),
  'default': path.join(__dirname, 'presets', 'default.js'),
  'sauce': path.join(__dirname, 'presets', 'sauce.js'),
  'testingbot': path.join(__dirname, 'presets', 'testingbot.js'),
  'crossbrowser': path.join(__dirname, 'presets', 'crossbrowser.js')
};
