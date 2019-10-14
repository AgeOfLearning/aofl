const path = require('path');

module.exports = {
  name: '@aofl/store',
  mode: 'stand-alone',
  build: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    entryReplace: {
      'index': path.join(__dirname, 'index.js'),
      'legacy': path.join(__dirname, 'modules', 'legacy', 'index.js'),
    },
    eslint: {
      options: {
        config: path.join(__dirname, '..', '.eslintrc.js')
      }
    },
    js: {
      include: [
        path.join(__dirname, 'modules')
      ]
    },
    extend() {
      return {
        output: {
          libraryTarget: 'commonjs2'
        },
        optimization: {
          runtimeChunk: false,
          splitChunks: false
        },
        externals: {
          '@aofl/object-utils': {
            commonjs2: '@aofl/object-utils',
            commonjs: '@aofl/object-utils',
            amd: '@aofl/object-utils'
          },
          '@aofl/register-callback': {
            commonjs2: '@aofl/register-callback',
            commonjs: '@aofl/register-callback',
            amd: '@aofl/register-callback'
          },
        }
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
