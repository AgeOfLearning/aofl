# Configuration

The default configuration covers most use cases. However, `.aofl.js` can be used to customize your application with additional configs.

Each section shows the available options and their default values.

## name
Name of the project. This shows during build.

```javascript
name: 'AofL JS App'
```

---
## root
Defaults to project's root directory and should only be overwritten if the config file isn't located in the project's root directory.

```js
root: 'path/to/directory/containing(.aofl.js)'
```
---
## build

```js
build: {
  filename: '[name]-[chunkhash].js', // https://webpack.js.org/configuration/output/#outputfilename
  path: 'project-root/__build', // https://webpack.js.org/configuration/output/#outputpath
  publicPath: '/', // https://webpack.js.org/configuration/output/#outputpublicpath
  devtool: 'nosources-source-map', // or source-map when NODE_ENV=development https://webpack.js.org/configuration/devtool/
  cache: true, // Enable/disable cache for loaders
  hardsourceCache: true, // Enable/disable hardSourceWebpackPlugin https://github.com/mzgoddard/hard-source-webpack-plugin
  css: { // rules for css modules (configure loaders, parser options, etc.) https://webpack.js.org/configuration/
    test: /\.css$/',
    include: [],
    exclude: [],
    issuer: {},
    enforce: '',
    component: [path.join(root, 'templates', 'main', 'css', 'index.css')], // https://www.npmjs.com/package/@aofl/webcomponent-css-loader
    global: { // https://www.npmjs.com/package/@aofl/html-webpack-purify-internal-css-plugin
      level: process.env.NODE_ENV === 'development'? 'none': 'auto',
      purifyCSS: {
        whitelist: ['route-view'],
      },
    },
    cssLoader: {}, // https://www.npmjs.com/package/css-loader
    postCssLoader: { // https://www.npmjs.com/package/postcss-loader
      plugins: [
        autoprefixer(),
        cssnano(),
      ],
    }
  },
  images: {  // rules for images modules (configure loaders, parser options, etc.) https://webpack.js.org/configuration/
    test: /\.(png|jpe?g|gif|svg)$/',
    include: [],
    exclude: /node_modules\/(?!@aofl|@polymer|lit-html|lit-element).*/,
    issuer: {}',
    enforce: '',
    fileLoader: {},// https://www.npmjs.com/package/file-loader
    imgLoader: { // https://www.npmjs.com/package/img-loader
      plugins: process.env.NODE_ENV === 'production' && [
        require('imagemin-gifsicle')(),
        require('imagemin-mozjpeg')({
          quality: 90,
        }),
        require('imagemin-optipng')(),
        require('imagemin-svgo')(),
      ]
    }
  },
  fonts: { // rules for fonts modules (configure loaders, parser options, etc.) https://webpack.js.org/configuration/
    test: /\.(woff2?|ttf|eot|svg#.*)$/,
    include: [],
    exclude: /node_modules\/(?!@aofl|@polymer|lit-html|lit-element).*/,
    issuer: {}',
    enforce: '',
    fileLoader: { // https://www.npmjs.com/package/file-loader
      name: process.env.NODE_ENV === environmentEnumerate.PRODUCTION ? '[hash:7].[ext]': '[name]-[hash:7].[ext]'
    }
  },
  eslint: { // rules for eslint modules (configure loaders, parser options, etc.) https://webpack.js.org/configuration/
    test: /\.js$/,
    include: [],
    exclude: /(node_modules|sw)/,
    issuer: {}',
    enforce: '',
    options: {
      config: path.join(__dirname, '.eslintrc.js')
    }
  }, // eslint-loader options or false
  js: { // rules for js modules (configure loaders, parser options, etc.) https://webpack.js.org/configuration/
    test: /\.js$/,
    include: [],
    exclude: /node_modules\/(?!@aofl|@polymer|lit-html|lit-element).*/,
    issuer: {}',
    enforce: '',
    babel: { // https://www.npmjs.com/package/babel-loader
      cacheDirectory: true,
      ...require(path.join(__dirname, '.babelrc.js')), // babel config
    }
  },
  templating: { // https://www.npmjs.com/package/@aofl/templating-plugin
    template: {
      name: 'main',
      template: path.resolve(root, 'templates', 'main', 'template.ejs'),
      filename: path.join('templates', 'main', 'template.html'),
      ...htmlWebpackconfig(process.env.NODE_ENV),
    },
    routes: {
      mainRoutes: path.join(root, 'routes'),
      pattern: [path.join('routes', '**', 'index.js')],
      ignore: ['**/__build/**/*', '**/node_modules/**/*'],
    },
    loaderOptions: {
      path: path.join(root, 'modules', '__config', 'routes.js'),
    }
  },
  terser: { // https://www.npmjs.com/package/terser-webpack-plugin
    parallel: true,
    sourceMap: true,
    extractComments: true,
  },
  serviceworker: { // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
    swSrc: path.join(__dirname, 'sw.js'),
    swDest: 'sw.js',
    exclude: [/\.LICENSE$/, /\.map\.js$/]
  },
  favicon: { // https://www.npmjs.com/package/copy-webpack-plugin
    from: 'assets/favicon.ico',
    to: 'favicon.ico',
  },
  pwaManifest: { // https://www.npmjs.com/package/webpack-pwa-manifest
    'name': 'Aofl Starter App',
    'short_name': 'AoflStarter',
    'description': 'Aofl Starter App',
    'display': 'standalone',
    'theme-color': '#fdf667',
    'background_color': '#fdf667',
    'crossorigin': 'use-credentials', // can be null, use-credentials or anonymous
    'ios': {
      'apple-mobile-web-app-title': 'Aofl Starter App',
      'apple-mobile-web-app-status-bar-style': '#fdf667',
    },
    'icons': [
      {
        src: 'assets/manifest/icon-48x48.png',
        sizes: '48x48',
      },
      {
        src: 'assets/manifest/icon-72x72.png',
        sizes: '72x72',
      },
      {
        src: 'assets/manifest/icon-96x96.png',
        sizes: '96x96',
      },
      {
        src: 'assets/manifest/icon-144x144.png',
        sizes: '144x144',
      },
      {
        src: 'assets/manifest/icon-192x192.png',
        sizes: '192x192',
      },
      {
        src: 'assets/manifest/icon-512x512.png',
        sizes: '512x512',
      },
    ],
  },
  extend: () => {} // can be used to modify webpack config
}
```

---
## devServer
Visit [`webpack-dev-server` config](https://webpack.js.org/configuration/dev-server/) for the full set of features.
```js
devServer: {
  contentBase: path.join(root, '__build'),
  port: 8080,
  host: 'localhost',
  openPage: '',
  open: true,
  stats: 'minimal',
  historyApiFallback: true,
}
```
---
## unitTesting

```js
unitTesting: {
  config: path.join(root, '.wctrc.json'),
  maxChunks: 1,
  include: ['**/*.js'],
  exclude: [
    '**/__build*',
    '**/node_modules',
    '**/node_modules_sourced',
    '**/documentation{,!(/tests/**)}',
    '**/__config',
    '**/*-instance/**',
    '**/*-polyfill/**',
  ],
  output: '__build_tests',
  clean: true
  scripts: [
    'runtime',
    'common',
    'main',
  ]
}
```
