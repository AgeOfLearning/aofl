const path = require('path');

module.exports = {
  name: '@aofl/resource-enumerate',
  mode: 'stand-alone',
  build: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    devtool: 'source-map',
    entryReplace: {
      'index': path.join(__dirname, 'index.js')
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
          runtimeChunk: false
        },
        externals: [
          {
            '@aofl/api-request': {
              commonjs2: '@aofl/api-request',
              commonjs: '@aofl/api-request',
              amd: '@aofl/api-request',
            },
            '@aofl/cache-manager': {
              commonjs2: '@aofl/cache-manager',
              commonjs: '@aofl/cache-manager',
              amd: '@aofl/cache-manager',
            },
            '@aofl/middleware': {
              commonjs2: '@aofl/middleware',
              commonjs: '@aofl/middleware',
              amd: '@aofl/middleware',
            },
            '@aofl/server-environment': {
              commonjs2: '@aofl/server-environment',
              commonjs: '@aofl/server-environment',
              amd: '@aofl/server-environment',
            },
          },
          function(context, request, callback) {
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
