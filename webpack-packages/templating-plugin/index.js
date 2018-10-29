const glob = require('glob');
const chalk = require('chalk');
const path = require('path');
const defaultsDeep = require('lodash.defaultsdeep');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const server = require('./server');
const preRender = require('./prerender');
const parseRoute = require('./parse-route');
const md5 = require('md5');

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
    this.options = defaultsDeep(options, {
      template: 'template.html',
      templateFilename: 'template.html',
      filename: 'index.html',
      routes: {
        pattern: path.join(__dirname, '..', 'routes*', 'index.js'),
        ignore: ['**/__build/**/*', '**/node_modules/**/*']
      },
      mainRoutes: 'routes',
      locale: 'en-US',
      partials: {}
    });
    this.options.template = path.resolve(this.options.template);
    this.options.assets = [{
      type: 'template',
      template: this.options.template
    }];
    this.getPartials();
  }


  /**
   *
   * @memberof TemplatingPlugin
   */
  getPartials() {
    try {
      for (let key in this.options.partials) {
        if (!this.options.partials.hasOwnProperty(key)) continue;
        if (typeof this.options.partials[key].pattern !== 'undefined') {
          let options = {};
          if (typeof this.options.partials[key].ignore !== 'undefined') {
            options.ignore = this.options.partials[key].ignore;
          }
          let paths = glob.sync(this.options.partials[key].pattern, options);
          let partialType = 'static';

          if (Array.isArray(paths)) {
            for (let i = 0; i < paths.length; i++) {
              this.options.assets.push({
                type: partialType,
                template: paths[i],
                partialName: key
              });
            }
          }
        }
      }
    } catch (e) {
      console.log(chalk.yellow(e));
    }
  }


  /**
   * @param {Object} compiler
   * @memberof TemplatingPlugin
   */
  getRoutes(compiler) {
    let assets = [];
    let rotationRegex = /\/routes-([^\/]+?)\//;
    let routesRegex = new RegExp(`/${this.options.mainRoutes}/`);
    const leadingSlashRegex = /^\//;
    const trailingSlashRegex = /\/$/;
    let options = {};
    if (typeof this.options.routes.ignore !== 'undefined') {
      options.ignore = this.options.partials.ignore;
    }

    let routeFiles = glob.sync(this.options.routes.pattern, options);
    if (Array.isArray(routeFiles)) {
      for (let i = 0; i < routeFiles.length; i++) {
        let routeFile = routeFiles[i];
        let partialType = 'route';
        let rotation = 'routes';
        let routesMatches = routeFile.match(routesRegex);
        let rotationMatches = routeFile.match(rotationRegex);

        if (routesMatches === null) {
          if (rotationMatches === null) {
            continue;
          } else if (rotationMatches !== null && rotationMatches.length > 0) {
            rotation = rotationMatches[1];
          }
        }

        let routeInfo = this.parseRouteFile(routeFile);
        if (typeof routeInfo.url === 'undefined' || routeInfo.url === '') {
          continue;
        }

        let routePath = path.relative(process.env.PWD,
          routeFile);
        let routeConfig = {
          resolve: `() => import('./${routePath}')`,
          rotation,
          path: (compiler.options.output.publicPath.replace(trailingSlashRegex, '') + '/' + routeInfo.url.replace(leadingSlashRegex, '').replace(trailingSlashRegex, '') + '/').replace(/\/\//g, '/'),
          dynamic: routeInfo.dynamic,
          title: routeInfo.title,
          meta: routeInfo.meta,
          locale: routeInfo.locale
        };

        assets.push({
          template: routeFile,
          type: partialType,
          outputName: routeInfo.routeOutputName,
          partialName: 'main',
          rotation,
          metaTags: routeInfo.metaTags,
          routeConfig,
          prerender: routeInfo.prerender
        });
      }
    }
    for (let i = 0; i < this.options.assets.length; i++) {
      let asset = this.options.assets[i];
      if (this.options.assets[i].type !== 'route') {
        assets.push(asset);
      }
    }
    this.options.assets = assets;
  }


  /**
   *
   *
   * @param {*} compiler
   * @memberof TemplatingPlugin
   */
  apply(compiler) {
    let routeFileInfo = this.generateRouteConfig(compiler);

    new SingleEntryPlugin(compiler.context, routeFileInfo.path, routeFileInfo.name).apply(compiler);

    compiler.hooks.watchRun.tapAsync(TemplatingPlugin.name, async (compiler, cb) => {
      await this.generateRouteConfig(compiler);
      cb(null);
    });

    compiler.hooks.emit.tapAsync(TemplatingPlugin.name, async (compilation, cb) => {
      for (let i = 0; i < compilation.options.plugins.length; i++) {
        if (compilation.options.plugins[i].constructor.name === HtmlWebpackPlugin.name) {
          let templatePath = this.cleanAssetPath(compilation.options.plugins[i].options.template);
          for (let j = 0; j < this.options.assets.length; j++) {
            if (this.options.assets[j].template === templatePath) {
              this.options.assets[j].outputName = compilation.options.plugins[i].childCompilationOutputName;
            }
          }
        }
      }

      await this.updateTemplates(compilation, compiler);
      cb(null);
    });
  }


  /**
   *
   * @param {String} path
   * @return {String}
   * @memberof TemplatingPlugin
   */
  cleanAssetPath(path) {
    const regex = /!(?!.*!)(.*)$/;
    let matches = path.match(regex);
    if (matches.length > 1) {
      return matches[1];
    }
    return path;
  }
  /**
   *
   *
   * @return {Object}
   * @memberof TemplatingPlugin
   */
  getTemplateData() {
    for (let i = 0; i < this.options.assets.length; i++) {
      let asset = this.options.assets[i];
      if (asset.type === 'template') {
        return asset;
      }
    }
    return false;
  }

  /**
   * @param {Object} compilation
   * @param {*} compiler
   * @param {String} data
   * @return {Promise}
   * @memberof TemplatingPlugin
   */
  async updateTemplates(compilation, compiler) {
    const updatedAsset = this.getTemplateData();
    let assets = {};
    let templateAsset = compilation.assets[this.options.templateFilename];
    if (typeof templateAsset === 'undefined') {
      return; // can't do anything if template hasn't compiled yet
    }

    try {
      if (updatedAsset.type === 'template' || updatedAsset.type === 'static') {
        assets = this.updateStaticTemplates(compiler, compilation);
      } else if (updatedAsset.type === 'route' && updatedAsset.rotation === 'routes') {
        assets = this.updateRouteTemplate(compiler, compilation, updatedAsset);
      }
    } catch (e) {
      console.log(e);
    }

    for (let key in assets) {
      if (!assets.hasOwnProperty(key)) continue;
      let t = templateAsset.source();
      for (let partialKey in assets[key].partialMap) {
        if (!assets[key].partialMap.hasOwnProperty(partialKey)) continue;
        t = this.replaceTemplatePart(t, partialKey, assets[key].partialMap[partialKey]);
      }

      compilation.assets[key] = {
        source: () => t,
        size: () => t.length
      };
    }

    let promises = [];
     if (compiler.options.mode === 'production') {
      for (let key in assets) {
        if (!assets.hasOwnProperty(key) || assets[key].routeInfo.prerender !== true) continue;
        const assetPath = key;
        let s = await server(compilation.assets, compiler.options.output.path, compiler.options.output.publicPath);
        let body = await preRender(s.url + compiler.options.output.publicPath + assets[key].routeInfo.outputName.replace(/index\.html$/, ''));
        let source = compilation.assets[assetPath].source();
        let t = source.replace(/<body.*<\/body>/, body).replace(/\n/g, ' ');
        compilation.assets[assetPath] = {
          source: () => t,
          size: () => t.length
        };
        s.close();
      }
    }
    return Promise.all(promises);
  }


  /**
   *
   *
   * @param {*} template
   * @param {*} match
   * @param {*} replace
   * @return {String}
   * @memberof TemplatingPlugin
   */
  replaceTemplatePart(template, match, replace) {
    let i = template.indexOf(match);
    while (i > -1) {
      template = template.substring(0, i) + replace + template.substring(i + match.length);
      i = template.indexOf(match);
    }
    return template;
  }
 /**
   *
   *
   * @param {String} file
   * @return {Object}
   * @memberof TemplatingPlugin
   */
  parseRouteFile(file) {
    let routeFile = fs.readFileSync(path.resolve(file), 'utf-8');
    const parsedData = parseRoute(routeFile);
    const routePath = parsedData.route.replace(/:.*/, '');

    return {
      url: parsedData.route,
      path: routePath,
      routeOutputName: (routePath + this.options.filename).replace(/^\//, ''),
      dynamic: parsedData.route !== routePath,
      title: parsedData.title,
      prerender: parsedData.prerender,
      metaTags: parsedData.metaTags.reduce((acc, item) => {
        acc += `<meta`;
        for (let key in item) {
          if (!item.hasOwnProperty(key)) continue;
          acc += ` ${key}="${item[key]}"`;
        }
        acc += '>\n';
        return acc;
      }, ''),
      meta: parsedData.meta,
      locale: parsedData.locale
    };
  }

  /**
   *
   * @return {String}
   * @memberof TemplatingPlugin
   */
  generateRouteConfig(compiler) {
    this.getRoutes(compiler);
    let routesConfigContent = '';
    try {
      routesConfigContent = fs.readFileSync(path.resolve('routes.config.js'), {encoding: 'utf-8'});
    } catch (e) {}

    let routeConfig = this.options.assets.reduce((acc, {type, rotation, routeConfig}) => {
      if (type !== 'route') return acc;
      if (rotation === '') {
        rotation = 'routes';
      }

      if (typeof acc[rotation] === 'undefined') {
        acc[rotation] = [];
      }

      routeConfig.template = path.basename(path.dirname(this.options.template));
      acc[rotation].push(routeConfig);
      return acc;
    }, {});

    let resolveRegex = /(resolve":\s)"(.*)"/g;
    let quoteRegex = /"/g;
    let routeConfigObject = JSON.stringify(routeConfig, null, 2).replace(resolveRegex, (match, p1, p2) => {
      return p1 + p2;
    });

    routeConfigObject = routeConfigObject.replace(quoteRegex, '\'');

    let routeConfigSource = `window.aofljsConfig = window.aofljsConfig || {};\nwindow.aofljsConfig.routesConfig = ${routeConfigObject};\n`;

    const routeConfigName = 'routes.config.js';
    const routeConfigPath = path.resolve(routeConfigName);
    if (md5(routesConfigContent) !== md5(routeConfigSource)) {
      fs.writeFileSync(routeConfigPath, routeConfigSource, {encoding: 'utf-8'});
    }
    let stats = fs.statSync(routeConfigPath);

    return {
      name: routeConfigName,
      path: routeConfigPath,
      mtimeMs: stats.mtimeMs
    };
  }

  /**
   *
   * @param {Object} routeConfig
   * @return {Boolean}
   * @memberof TemplatingPlugin
   */
  shouldCreateDynamic(routeConfig) {
    if (routeConfig.dynamic === false) {
      return true;
    }

    for (let i = 0; i < this.options.assets.length; i++) {
      let asset = this.options.assets[i];
      if (asset.type !== 'routes') continue;
      if (asset.routeConfig.url === routeConfig.url) {
        return false;
      }
    }
    return true;
  }
  /**
   *
   * @param {*} compiler
   * @param {*} compilation
   * @param {*} updatedRoute
   * @return {Object}
   * @memberof TemplatingPlugin
   */
  updateRouteTemplate(compiler, compilation, updatedRoute) {
    let assets = {};
    let compiledRoute = compilation.assets[this.options.templateFilename];

    if (typeof compiledRoute === 'undefined' || updatedRoute.rotation !== 'routes' || !this.shouldCreateDynamic(updatedRoute.routeConfig)) { // nothing here
      return assets;
    }

    let partialMap = {
      [`aoflTemplate:title`]: updatedRoute.routeConfig.title || '',
      [`aoflTemplate:metaTags`]: updatedRoute.metaTags || '',
      [`aoflTemplate:locale`]: updatedRoute.routeConfig.locale || this.options.locale
    };

    for (let i = 0; i < this.options.assets.length; i++) {
      let partial = this.options.assets[i];
      let compiledPartial = compilation.assets[partial.outputName];
      if (typeof compiledPartial === 'undefined' || partial.type !== 'static') continue;
      partialMap[`aoflTemplate:partial:${partial.partialName}`] = compiledPartial.source();
    }

    assets[updatedRoute.outputName] = {
      routeInfo: updatedRoute,
      partialMap
    };
    return assets;
  }


  /**
   *
   *
   * @param {*} compiler
   * @param {*} compilation
   * @return {Object}
   * @memberof TemplatingPlugin
   */
  updateStaticTemplates(compiler, compilation) {
    let assets = {};
    for (let i = 0; i < this.options.assets.length; i++) {
      let partial = this.options.assets[i];
      if (partial.type === 'route') {
        let tmpAssets = this.updateRouteTemplate(compiler, compilation, partial);
        assets = Object.assign(assets, tmpAssets);
      }
    }
    return assets;
  }
}

module.exports = TemplatingPlugin;
