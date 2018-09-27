const merge = require('webpack-merge');
const common = require('./__config/webpack.common');
const UnitTesting = require('@aofl/unit-testing-plugin');

const config = merge(common('development'), {
  devtool: 'source-map',
  plugins: [
    new UnitTesting({
      exclude: [
        '**/node_modules',
        '**/node_modules_sourced',
        '**/documentation{,!(/tests/**)}',
        '**/__config',
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
        '**/router/examples'
        // '**/router',
        // '**/server-environment',
        // '**/store',
        // '**/throttle-service',
        // '**/uuid',
        // '**/web-components'
      ],
      scripts: [
        'runtime',
        // 'webcomponents-bundle',
        'polyfill-service',
        'custom-elements-es5-adapter'
      ]
    })
  ]
});

module.exports = config;
