const glob = require('glob');
const chalk = require('chalk');
const path = require('path');
const defaultsDeep = require('lodash.defaultsdeep');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const JsonpTemplatePlugin = require('webpack/lib/web/JsonpTemplatePlugin');
const server = require('./server');
const preRender = require('./prerender');
const parseRoute = require('./parse-route');

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
      inlineConfig: false,
      partials: {}
    });
    this.options.template = path.resolve(this.options.template);
    this.options.assets = [{
      type: 'template',
      template: this.options.template
    }];
    this.getPartials();
    this.getRoutes();
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
   *
   * @memberof TemplatingPlugin
   */
  getRoutes() {
    let rotationRegex = /\/routes-([^\/]+?)\//;
    let routesRegex = new RegExp(`/${this.options.mainRoutes}/`);
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
        let routePath = path.relative(process.env.PWD,
          routeFile);
        let routeConfig = {
          resolve: `() => import('./${routePath}')`,
          rotation,
          path: routeInfo.url,
          dynamic: routeInfo.dynamic,
          title: routeInfo.title,
          meta: routeInfo.meta,
          locale: routeInfo.locale
        };

        this.options.assets.push({
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
  }


  /**
   *
   *
   * @param {*} compiler
   * @memberof TemplatingPlugin
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(TemplatingPlugin.name, async (compilation, cb, a, b, c) => {
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
      // for (let i = 0; i < this.options.assets.length; i++) {
      //   let route = this.options.assets[i];
      //   if (route.partialName === 'main') {
      //     compilation.fileDependencies.add(route.template);
      //   }
      // }
      this.routesConfigOuptputPath = await this.generateRouteConfig(compiler.options.output.path, compilation, compiler);
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
      compilation.assets[assets[key].routeInfo.outputName] = {
        source: () => t,
        size: () => t.length
      };
    }

    let promises = [];
    if (compiler.options.mode === 'production') {
      for (let key in assets) {
        if (!assets.hasOwnProperty(key) || assets[key].routeInfo.prerender !== true) continue;
        let s = await server(compilation.assets);
        let body = await preRender(s.url + '/' + assets[key].routeInfo.outputName.replace(/index\.html$/, ''));
        let source = compilation.assets[assets[key].routeInfo.outputName].source();
        let t = source.replace(/<body.*<\/body>/, body).replace(/\n/g, ' ');
        compilation.assets[assets[key].routeInfo.outputName] = {
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
   *
   * @param {*} outputPath
   * @param {*} compilation
   * @param {*} compiler
   * @param {*} html
   * @return {String}
   * @memberof TemplatingPlugin
   */
  generateRouteConfig(outputPath, compilation, compiler, html) {
    let routesConfigContent = '';
    try {
      routesConfigContent = fs.readFileSync(path.resolve('routes.config.min.js'));
    } catch (e) {}

    let routeConfig = this.options.assets.reduce((acc, {type, rotation, routeConfig}) => {
      if (type !== 'route') return acc;
      if (rotation === '') {
        rotation = 'routes';
      }

      if (typeof acc[rotation] === 'undefined') {
        acc[rotation] = [];
      }

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

    if (routesConfigContent !== routeConfigSource) {
      fs.writeFileSync(path.resolve('routes.config.js'), routeConfigSource, {encoding: 'utf-8'});
    }

    // compilation.assets['routes.config.min.js'] = {
    //   source: () => routeConfigSource,
    //   size: () => routeConfigSource.length
    // };
    let outputOptions = {
      ...compiler.options.output,
      filename: '[name].min.js'
    };

    let compilerName = 'routesConfigCompiler';
    const childCompiler = compilation.createChildCompiler(compilerName, outputOptions);
    childCompiler.context = compiler.context;

    new JsonpTemplatePlugin().apply(childCompiler);
    new SingleEntryPlugin(childCompiler.context, path.resolve('routes.config.js'), 'routes.config').apply(childCompiler);

    childCompiler.hooks.compilation.tap(TemplatingPlugin.name, (childCompilation) => {
      childCompilation.chunks = compilation.chunks;
      if (childCompilation.cache) {
        if (!childCompilation.cache[compilerName]) {
          childCompilation.cache[compilerName] = {};
        }
        childCompilation.cache = childCompilation.cache[compilerName];
      }
    });

    return new Promise((resolve, reject) => {
      childCompiler.runAsChild((err, entries, childCompilation) => {
        let routesConfigOutputPath = 'routes.config';
        for (let i = 0; i < childCompilation.chunks.length; i++) {
          if (childCompilation.chunks[i].name === 'routes.config') {
            routesConfigOutputPath = childCompilation.chunks[i].files[0];
            break;
          }
        }
        for (let dep of childCompilation.fileDependencies) {
          if (!compilation.fileDependencies.has(dep) && (dep.indexOf('routes.config') === -1)) {
            compilation.fileDependencies.add(dep);
          }
        }

        if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
          const errorDetails = childCompilation.errors.map((error) => error.message + (error.error ? ':\n' + error.error : '')).join('\n');
          reject(new Error('Child compilation failed:\n' + errorDetails));
        } else if (err) {
          reject(err);
        } else {
          return resolve(routesConfigOutputPath);
        }
      });
    });
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
    let routesConfigPartial = `<script src="${compiler.options.output.publicPath + this.routesConfigOuptputPath}"></script>`;
    if (this.options.inlineConfig) {
      routesConfigPartial = '<script>' + compilation.assets[this.routesConfigOuptputPath].source() + '</script>';
    }
    let partialMap = {
      // [`aoflTemplate:partial:${updatedRoute.partialName}`]: routeSource,
      ['aoflTemplate:partial:routes']: routesConfigPartial,
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
