const path = require('path');
const defaultsDeep = require('lodash.defaultsdeep');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getRoutes = require('./get-routes');
const replaceTemplateFiles = require('./replace-template-parts');
const server = require('./server');
const preRender = require('./prerender');
const validateOptions = require('schema-utils');
const schema = require('./__config/schema.json');
const partialsSchema = require('./__config/partials-schema.json');

const LOADER_OPTIONS = {
  enforce: 'pre',
  use: {
    loader: path.resolve(__dirname, 'routes-config-loader'),
    options: {
      configs: []
    }
  }
};

/**
 *
 *
 * @class TemplatingPlugin
 */
class TemplatingPlugin {
  /**
   *
   *
   * @readonly
   * @static
   * @memberof TemplatingPlugin
   */
  static get name() {
    return 'AoflTemplatingPlugin';
  }

  /**
   *Creates an instance of TemplatingPlugin.
   * @param {*} options
   * @memberof TemplatingPlugin
   */
  constructor(options = {}) {
    validateOptions(schema, options, TemplatingPlugin.name);

    if (typeof options.partials !== 'undefined') {
      for (const key in options.partials) {
        if (!options.partials.hasOwnProperty(key)) continue;
        validateOptions(partialsSchema, options.partials[key], TemplatingPlugin.name);
      }
    }

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
      partials: {
        // header: {
        //   pattern: path.join(__dirname, '..', 'js', 'header', '*.ejs'),
        //   ignore: ['**/__build/**/*', '**/node_modules/**/*'],
        //   filename: 'view-[chunkhash].html',
        //   static: true
        // }
      },
      locale: 'en-US',
      preRenderTimeout: 0,
      loaderOptions: {
        path: new RegExp(path.resolve(__dirname, 'routes.config.js'))
      }
    });

    this.assets = {
      template: {
        type: 'template',
        template: this.options.template
      },
      routes: [],
      partials: {}
    };

    LOADER_OPTIONS.test = (this.options.loaderOptions.path || new RegExp(path.resolve(__dirname, 'routes.config.js'))
      .replace(new RegExp('\\' + path.sep, 'g'), `\\${path.sep}`));

    LOADER_OPTIONS.use.options.configs.push(this.options);
    LOADER_OPTIONS.use.options.cache = this.options.loaderOptions.cache || true;
  }

  /**
   *
   *
   * @param {*} compiler
   * @memberof TemplatingPlugin
   */
  apply(compiler) {
    this.options.publicPath = compiler.options.output.publicPath || '/';
    TemplatingPlugin.addLoader(compiler);

    const templateHWP = new HtmlWebpackPlugin({
      ...this.options.template
    });
    templateHWP.apply(compiler);

    for (const key in this.options.partials) {
      if (!this.options.partials.hasOwnProperty(key)) continue;
      const partial = this.options.partials[key];
      const partialHWP = new HtmlWebpackPlugin({
        ...partial
      });
      partialHWP.apply(compiler);
      this.assets.partials[key] = partialHWP;
    }

    compiler.hooks.emit.tapAsync(TemplatingPlugin.name, async (compilation, cb) => {
      try {
        this.assets.template.outputPath = templateHWP.childCompilationOutputName;
        this.assets.routes = await getRoutes(this.options);
        await this.updateTemplates(compiler, compilation);
        cb(null);
      } catch (e) {
        cb(e);
      }
    });
  }


  /**
   *
   * @param {*} compiler
   */
  static addLoader(compiler) {
    const loaderIndex = compiler.options.module.rules.indexOf(LOADER_OPTIONS);
    if (loaderIndex === -1) {
      compiler.options.module.rules.push(LOADER_OPTIONS);
    }
  }


  /**
   *
   * @param {Object} assets
   * @param {Object} compiler
   * @param {Object} compilation
   */
  async prerender(assets, compiler, compilation) {
    const promises = [];
    if (compiler.options.mode === 'production') {
      for (const key in assets) {
        if (!assets.hasOwnProperty(key) || assets[key].routeInfo.prerender !== true) continue;
        const assetPath = key;
        const s = await server(compilation.assets, compiler.options.output.path, compiler.options.output.publicPath);
        const body = await preRender(s.url + compiler.options.output.publicPath + assets[key].routeInfo.outputName.replace(/index\.html$/, ''), this.options.preRenderTimeout);
        const source = compilation.assets[assetPath].source();

        let t = source; // str.replace is not consistent on large strings
        const bodyMatch = /<body.*<\/body>/.exec(source);
        if (bodyMatch !== null) {
          t = replaceTemplateFiles(source, bodyMatch[0], body);
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
  /**
   *
   * @param {Object} compiler
   * @param {Object} compilation
   */
  async updateTemplates(compiler, compilation) {
    const template = compilation.assets[this.assets.template.outputPath];
    const templateSource = template.source();
    const assets = this.getStaticTemplateAssets(compiler, compilation);

    for (const key in assets) {
      if (!assets.hasOwnProperty(key)) continue;
      let t = templateSource;
      for (const partialKey in assets[key].partialMap) {
        if (!assets[key].partialMap.hasOwnProperty(partialKey)) continue;
        t = replaceTemplateFiles(t, partialKey, assets[key].partialMap[partialKey]);
      }

      compilation.assets[key] = {
        source: () => t,
        size: () => t.length
      };
    }

    await this.prerender(assets, compiler, compilation);
  }

  /**
   *
   * @param {Object} routeConfig
   * @return {Boolean}
   */
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

  /**
   *
   * @param {Object} compiler
   * @param {Object} compilation
   * @param {Object} routeInfo
   * @return {Object}
   */
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

    for (const key in this.assets.partials) {
      if (!this.assets.partials.hasOwnProperty(key)) continue;
      const partial = this.assets.partials[key];
      const compiledPartial = compilation.assets[partial.childCompilationOutputName];
      if (typeof compiledPartial === 'undefined') continue;
      partialMap[`<template>aoflTemplate:partial:${key}</template>`] = compiledPartial.source();
      partialMap[`aoflTemplate:partial:${key}`] = compiledPartial.source();
    }

    assets[routeInfo.outputName] = {
      routeInfo,
      partialMap
    };

    return assets;
  }


  /**
   *
   * @param {*} compiler
   * @param {*} compilation
   * @return {Object}
   */
  getStaticTemplateAssets(compiler, compilation) {
    let assets = {};
    for (let i = 0; i < this.assets.routes.length; i++) {
      const routeInfo = this.assets.routes[i];
      const tmpAssets = this.getRouteTemplateAssets(compiler, compilation, routeInfo);

      assets = Object.assign(assets, tmpAssets);
    }

    return assets;
  }
}

module.exports = TemplatingPlugin;
