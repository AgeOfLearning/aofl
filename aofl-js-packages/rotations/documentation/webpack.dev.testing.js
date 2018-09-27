const merge = require('webpack-merge');
const devConfig = require('./webpack.dev');
const UnitTesting = require('@aofl/unit-testing-plugin');

const config = merge(devConfig, {
  plugins: [
    new UnitTesting({
      exclude: [
        'node_modules/**/*',
        'node_modules_sourced/**/*',
        'js/__config/**/*',
        'server/**/*'
      ],
      scripts: [
        'runtime',
        'webcomponents-loader',
        'custom-elements-es5-adapter'
      ]
    })
  ]
});

module.exports = config;
