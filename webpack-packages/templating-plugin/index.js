const path = require('path');
const {validate} = require('schema-utils');
const schema = require('./__config/schema.json');
const {defaultsDeep} = require('@aofl/cli-lib');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getRoutes = require('./get-routes');
const server = require('./server');
const prerender = require('./prerender');
const replaceString = require('./replace-string');

const LOADER_OPTIONS = {
  enforce: 'pre',
  use: {
    loader: path.resolve(__dirname, 'routes-config-loader'),
    options: {
      configs: []
    }
  }
};

class TemplatingPlugin {
  static get name() {
    return 'AoflTemplatingPlugin';
  }

  constructor(options = {}) {
    validate(schema, options, {name: TemplatingPlugin.name});

    this.options = defaultsDeep(options, {
      template: {
        // name: '',
        // template: '',
        // filename: 'index.html'
      },
      routes: {
        // mainRoutes: path.join(__dirname, '..', 'routes'),
        // pattern: path.join(__dirname, '..', 'routes*', 'index.js'),
        // ignore: ['**/__build/**/*', '**/node_modules/**/*']
      },
      locale: 'en-US',
      prerender: {
        timeout: 0,
        externalServer: false,
        schema: 'http',
        host: 'localhost',
        port: 8090
      },
      loaderOptions: {
        path: new RegExp(path.resolve(__dirname, 'routes.config.js'))
      }
    });

    this.assets = {
      template: {
        type: 'template',
        template: this.options.template
      },
      routes: []
    };

    LOADER_OPTIONS.test = (this.options.loaderOptions.path || new RegExp(path.resolve(__dirname, 'routes.config.js'))
      .replace(new RegExp('\\' + path.sep, 'g'), `\\${path.sep}`));

    LOADER_OPTIONS.use.options.configs.push(this.options);
    LOADER_OPTIONS.use.options.cache = this.options.loaderOptions.cache || true;
  }

  apply(compiler) {
    this.options.publicPath = compiler.options.output.publicPath || '/';
    TemplatingPlugin.addLoader(compiler);


    const templateHWP = new HtmlWebpackPlugin({
      ...this.options.template
    });
    templateHWP.apply(compiler);

    compiler.hooks.make.tap(TemplatingPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tapAsync({
        name: TemplatingPlugin.name + '#processAssets',
        stage: compilation.hooks.processAssets.PROCESS_ASSETS_STAGE_ADDITIONAL,
        additionalAssets: true
      }, async (assets, cb) => {
        if (typeof assets[this.assets.template.template.filename] !== 'undefined') {
          try {
            this.assets.template.outputPath = templateHWP.options.filename;
            this.assets.routes = await getRoutes(this.options);
            await this.updateTemplates(compiler, compilation);
            cb(null);
          } catch (e) {
            cb(e);
          }
        } else {
          cb(null);
        }
      });
    });
  }

  static addLoader(compiler) {
    const loaderIndex = compiler.options.module.rules.indexOf(LOADER_OPTIONS);
    if (loaderIndex === -1) {
      compiler.options.module.rules.push(LOADER_OPTIONS);
    }
  }

  async updateTemplates(compiler, compilation) {
    const template = compilation.assets[this.assets.template.outputPath];
    const templateSource = template.source();
    const assets = this.getStaticTemplateAssets(compiler, compilation);

    for (const key in assets) {
      if (!Object.prototype.hasOwnProperty.call(assets, key)) continue;
      const t = templateSource;

      const regex = new RegExp(Object.keys(assets[key].partialMap).join('|'), 'gi');
      const text = String(t).replace(regex, (matched) => assets[key].partialMap[matched]);

      compilation.assets[key] = {
        source: () => text,
        size: () => text.length
      };
    }

    await this.prerender(assets, compiler, compilation);
  }
  getStaticTemplateAssets(compiler, compilation) {
    let assets = {};

    for (let i = 0; i < this.assets.routes.length; i++) {
      const routeInfo = this.assets.routes[i];
      const tmpAssets = this.getRouteTemplateAssets(compiler, compilation, routeInfo);

      assets = Object.assign(assets, tmpAssets);
    }

    return assets;
  }

  getRouteTemplateAssets(compiler, compilation, routeInfo) {
    const assets = {};
    const template = compilation.assets[this.assets.template.outputPath];

    if (typeof template === 'undefined' || routeInfo.rotation !== 'routes' || !this.shouldCreateDynamic(routeInfo.routeConfig)) { // nothing here
      return assets;
    }

    const partialMap = {
      [`aoflTemplate:title`]: routeInfo.routeConfig.title || '',
      [`<template>aoflTemplate:title</template>`]: routeInfo.routeConfig.title || '',
      [`<template>aoflTemplate:metaTags</template>`]: routeInfo.metaTags || '',
      [`aoflTemplate:metaTags`]: routeInfo.metaTags || '',
      [`<template>aoflTemplate:linkTags</template>`]: routeInfo.linkTags || '',
      [`aoflTemplate:linkTags`]: routeInfo.linkTags || '',
      [`<template>aoflTemplate:locale</template>`]: routeInfo.routeConfig.locale || this.options.locale,
      [`aoflTemplate:locale`]: routeInfo.routeConfig.locale || this.options.locale,
      'sourceMappingURL=': 'sourceMappingURL=' + path.relative(routeInfo.routeConfig.path, this.options.publicPath) + '/'
    };

    assets[routeInfo.outputName] = {
      routeInfo,
      partialMap
    };

    return assets;
  }
  shouldCreateDynamic(routeConfig) {
    if (routeConfig.dynamic === false) {
      return true;
    }

    for (let i = 0; i < this.assets.routes.length; i++) {
      const asset = this.assets.routes[i];
      if (asset.routeConfig.url === routeConfig.url) {
        return false;
      }
    }
    return true;
  }

  async prerender(assets, compiler, compilation) {
    const promises = [];
    if (compiler.options.mode === 'production') {
      for (const key in assets) {
        if (!Object.prototype.hasOwnProperty.call(assets, key) || assets[key].routeInfo.prerender !== true) continue;
        const assetPath = key;
        // eslint-disable-next-line no-await-in-loop
        const s = await server(compilation.assets, compiler.options.output.path,
          compiler.options.output.publicPath, this.options.prerender);
        // eslint-disable-next-line no-await-in-loop
        const body = await prerender(
          s.url + compiler.options.output.publicPath +
          assets[key].routeInfo.outputName.replace(/index\.html$/, ''),
          this.options.prerender
        );
        const source = compilation.assets[assetPath].source();

        let t = source; // str.replace is not consistent on large strings
        const bodyMatch = /<body.*<\/body>/.exec(source);
        if (bodyMatch !== null) {
          t = replaceString(source, bodyMatch[0], body);
        }
        t.replace(/\n/g, ' ');
        compilation.assets[assetPath] = {
          source: () => t,
          size: () => t.length
        };
        s.close();
      }
    }
    await Promise.all(promises);
  }
}

module.exports = TemplatingPlugin;
