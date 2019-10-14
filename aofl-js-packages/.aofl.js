const path = require('path');

const include = [
  path.join(__dirname, '__config'),
  path.join(__dirname, 'node_modules', 'api-request'),
  path.join(__dirname, 'node_modules', 'cache-manager'),
  path.join(__dirname, 'node_modules', 'component-utils'),
  path.join(__dirname, 'node_modules', 'drawer'),
  path.join(__dirname, 'node_modules', 'element'),
  path.join(__dirname, 'node_modules', 'form-validate'),
  path.join(__dirname, 'node_modules', 'i18n'),
  path.join(__dirname, 'node_modules', 'i18n-mixin'),
  path.join(__dirname, 'node_modules', 'map-state-properties-mixin'),
  path.join(__dirname, 'node_modules', 'middleware'),
  path.join(__dirname, 'node_modules', 'object-utils'),
  path.join(__dirname, 'node_modules', 'picture'),
  path.join(__dirname, 'node_modules', 'polyfill-service'),
  path.join(__dirname, 'node_modules', 'register-callback'),
  path.join(__dirname, 'node_modules', 'resource-enumerate'),
  path.join(__dirname, 'node_modules', 'rotations'),
  path.join(__dirname, 'node_modules', 'router'),
  path.join(__dirname, 'node_modules', 'select'),
  path.join(__dirname, 'node_modules', 'server-environment'),
  path.join(__dirname, 'node_modules', 'store'),
  path.join(__dirname, 'node_modules', 'uuid'),
  path.join(__dirname, 'node_modules', 'web-components'),
  path.join(__dirname, 'api-request'),
  path.join(__dirname, 'cache-manager'),
  path.join(__dirname, 'component-utils'),
  path.join(__dirname, 'drawer'),
  path.join(__dirname, 'element'),
  path.join(__dirname, 'form-validate'),
  path.join(__dirname, 'i18n'),
  path.join(__dirname, 'i18n-mixin'),
  path.join(__dirname, 'map-state-properties-mixin'),
  path.join(__dirname, 'middleware'),
  path.join(__dirname, 'object-utils'),
  path.join(__dirname, 'picture'),
  path.join(__dirname, 'polyfill-service'),
  path.join(__dirname, 'register-callback'),
  path.join(__dirname, 'resource-enumerate'),
  path.join(__dirname, 'rotations'),
  path.join(__dirname, 'router'),
  path.join(__dirname, 'select'),
  path.join(__dirname, 'server-environment'),
  path.join(__dirname, 'store'),
  path.join(__dirname, 'uuid'),
  path.join(__dirname, 'web-components'),
];

module.exports = {
  name: 'Aofl JS',
  build: {
    // publicPath: '/__build_tests/',
    eslint: {
      options: {
        config: path.join(__dirname, '.eslintrc.js')
      }
    },
    css: {
      replace: {
        include: [
          ...include,
          path.join(__dirname, 'node_modules', '@aofl')
        ],
      }
    },
    images: {
      replace: {include}
    },
    fonts: {
      replace: {include}
    },
    eslint: {
      replace: {include}
    },
    js: {
      replace: {
        include: [
          path.join(__dirname, 'node_modules', '@aofl'),
          path.join(__dirname, 'node_modules', 'lit-element'),
          path.join(__dirname, 'node_modules', 'lit-html'),
          path.join(__dirname, 'node_modules', 'chai'),
          path.join(__dirname, 'node_modules', 'chai-as-promised'),
          path.join(__dirname, 'node_modules', '@webcomponents'),
          ...include
        ]
      }
    },
    extend() {
      return {
        resolve: {
          mainFields: ['module', 'main'],
          alias: {
            'isomorphic-fetch': path.join(__dirname, 'node_modules', 'isomorphic-fetch', 'fetch-npm-browserify.js'),
          },
          symlinks: true,
          cacheWithContext: false
        },
      }
    }
  },
  unitTesting: {
    include: ['**/*.spec.js'],
    config: process.env.SAUCE === '1'? path.join(__dirname, '.wct-sl.config.js'): path.join(__dirname, '.wctrc.json'),
    polyfill: path.join(__dirname, '__config', 'polyfills.js'),
    exclude: [
      '**/__build*',
      '**/node_modules',
      '**/node_modules_sourced',
      '**/documentation{,!(/tests/**)}',
      '**/docs',
      '**/__config',
      '__config',
      '**/*-instance/**',
      '**/*-polyfill/**',
      'sw.js',
      'coverage',
      '.wct.config.js',
      '**/examples/**',
      '**/*.sample.js',
      '**/cli',
      '**/*-loader/**',
      '**/*-plugin/**',
      '**/router/examples',
      '**/web-components',
      '**/dist'
    ]
  }
};
