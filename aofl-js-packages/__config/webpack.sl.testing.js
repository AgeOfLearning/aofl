const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const UnitTesting = require('@aofl/unit-testing-plugin');
const webpack = require('webpack');

const config = merge(common('development'), {
  output: {
    filename: '[name]-[chunkhash].min.js'
  },
  devtool: 'none',
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new UnitTesting({
      clean: false,
      config: path.join(__dirname, '.wct-sl.config.js'),
      exclude: [
        '**/node_modules',
        '**/node_modules_sourced',
        '**/documentation{,!(/tests/**)}',
        '**/__config',
        '**/examples',
        '**/cli',
        '**/*-instance/**',
        '**/*-loader/**',
        '**/*-polyfill/**',
        '**/*-plugin/**',
        // '**/api-request',
        // '**/cache-manager',
        // '**/component-utils',
        // '**/form-validate',
        // '**/i18n-mixin',
        // '**/map-state-properties-mixin',
        // '**/middleware',
        // '**/object-utils',
        // '**/polyfill-service',
        // '**/register-callback',
        // '**/resource-enumerate',
        // '**/rotations',
        // '**/router',
        // '**/server-environment',
        // '**/store',
        // '**/uuid',
        // '**/web-components/aofl-drawer',
        // '**/web-components/aofl-element',
        // '**/web-components/aofl-img',
        // '**/web-components/aofl-list-option',
        // '**/web-components/aofl-picture',
        // '**/web-components/aofl-select-list',
        '**/web-components/aofl-source',
        '**/router/examples'
      ],
      scripts: [
        'runtime',
        'polyfill-service'
      ]
    })
  ]
});

module.exports = config;
