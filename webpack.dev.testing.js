const merge = require('webpack-merge');
const devConfig = require('./webpack.dev');
const UnitTesting = require('@aofl/unit-testing-plugin');

const config = merge(devConfig, {
  plugins: [
    new UnitTesting({
      exclude: [
        '**/node_modules',
        '**/node_modules_sourced',
        '**/documentation{,!(/tests/**)}',
        '**/__config',
        '**/cli',
        '**/*-loader/**',
        '**/*-polyfill/**',
        '**/*-plugin/**',
        '**/api-request',
        // '**/cache-manager',
        // '**/form-validate',
        // '**/i18n-mixin',
        // '**/map-state-properties-mixin',
        // '**/middleware',
        // '**/object-utils',
        // '**/parent-dep-mixin',
        // '**/polyfill-service',
        // '**/register-callback',
        '**/resource-enumerate',
        // '**/rotations',
        '**/router/examples'
        // '**/server-environment',
        // '**/store',
        // '**/throttle-service',
        // '**/uuid',
        // '**/web-components'
      ],
      scripts: [
        'runtime',
        'init-polyfill-service',
        'custom-elements-es5-adapter'
      ]
    })
  ]
});

module.exports = config;
