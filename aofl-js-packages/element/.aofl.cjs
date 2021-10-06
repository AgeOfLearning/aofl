const path = require('path');

module.exports = {
  name: '@aofl/element',
  mode: 'standalone',
  build: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    devtool: 'source-map',
    entryReplace: {
      'index': path.join(__dirname, 'lib', 'index.js')
    },
    eslint: {
      options: {
        config: path.join(__dirname, '..', '.eslintrc.js')
      }
    },
    js: {
      include: [
        path.join(__dirname, 'lib')
      ]
    },
    ts: {
      include: [
        path.join(__dirname, 'lib')
      ]
    },
    extend() {
      return {
        output: {
          libraryTarget: 'commonjs2'
        },
        optimization: {
          runtimeChunk: false
        },
        externals: [
          {
            'lit': {
              commonjs2: 'lit',
              commonjs: 'lit',
              amd: 'lit',
            },
            'lit/decorators.js': {
              commonjs2: 'lit/decorators.js',
              commonjs: 'lit/decorators.js',
              amd: 'lit/decorators.js',
            },
            '@aofl/store': {
              commonjs2: '@aofl/store',
              commonjs: '@aofl/store',
              amd: '@aofl/store'
            },
            '@aofl/object-utils': {
              commonjs2: '@aofl/object-utils',
              commonjs: '@aofl/object-utils',
              amd: '@aofl/object-utils'
            }
          },
          function({context, request}, callback) {
            if (/^core-js\//.test(request) || /^@babel\//.test(request) || /^regenerator-runtime\/runtime$/.test(request)){
              return callback(null, 'commonjs ' + request);
            }
            callback();
          }
        ]
      }
    }
  }
};
