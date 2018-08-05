const glob = require('glob');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const defaultsDeep = require('lodash.defaultsdeep');
const fs = require('fs');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const JsonpTemplatePlugin = require('webpack/lib/web/JsonpTemplatePlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
const parseImports = require('parse-es6-imports');
const {steps} = require('web-component-tester');
const WctContext = require('web-component-tester/runner/context');
const {CliReporter} = require('web-component-tester/runner/clireporter');
const cleankill = require('cleankill');

/**
 *
 *
 * @class UnitTestingPlugin
 */
class UnitTestingPlugin {
  /**
   *
   *
   * @readonly
   * @static
   * @memberof UnitTestingPlugin
   */
  static get name() {
    return 'AoflUnitTestingPlugin';
  }

  /**
   * Creates an instance of UnitTestingPlugin.
   * @param {*} [options={}]
   * @memberof UnitTestingPlugin
   */
  constructor(options = {}) {
    this.options = defaultsDeep(options, {
      include: '**/*.spec.{html,js}',
      exclude: ['**/node_modules/**'],
      output: 'tests-dest',
      config: path.join(process.env.PWD, 'wct.conf.json'),
      clean: true
    });
    this.options.exclude.push(path.join('**', this.options.output, '**'));
    this.options.output = path.resolve(process.env.PWD, this.options.output);
    let wctConfig = {};
    try {
       wctConfig = require(this.options.config);
    } catch (e) {}

    this.wctConfig = defaultsDeep(wctConfig, {
      verbose: false,
      sauce: null,
      plugins: {
        local: {
          browsers: ['chrome']
        },
        sauce: null,
        istanbul: {
          dir: path.join(process.env.PWD, 'coverage'),
          reporters: ['text-summary', 'lcov'],
          include: this.options.include,
          exclude: this.options.exclude
        }
      },
      root: process.env.PWD,
      npm: true,
      skipCleanup: false,
      persistent: false,
      expanded: false
    });
    this.wctContext = new WctContext(this.wctConfig);
    if (this.wctContext.options.output) {
      new CliReporter(this.wctContext, this.wctContext.options.output, this.wctContext.options);
    }
    this.firstRun = true;
  }

  /**
   *
   *
   * @param {*} compiler
   * @memberof UnitTestingPlugin
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(UnitTestingPlugin.name, async (compilation, cb) => {
      try {
        await this.cleanOutputFolder();
        await this.createOutputFolder();
        const suitePaths = this.getInputSuitePaths();
        const htmlRegex = /\.html$/;
        const jsRegex = /\.js$/;

        this.wctContext.options.suites = [];
        for (let i = 0; i < suitePaths.length; i++) {
          if (compilation.fileDependencies.has(suitePaths[i])) {
            compilation.fileDependencies.delete(suitePaths[i]);
          }
          compilation.fileDependencies.add(suitePaths[i]);
          if (htmlRegex.test(suitePaths[i])) {
            let suite = await this.getHtmlSuite(suitePaths[i], compiler, compilation);
            this.wctContext.options.suites.push(suite);
          } else if (jsRegex.test(suitePaths[i])) {
            let suite = await this.getJsSuite(suitePaths[i], compiler, compilation);
            this.wctContext.options.suites.push(suite);
          }
        };

        if (this.wctContext.options.suites.length > 0) {
          if (this.firstRun) {
            await steps.setupOverrides(this.wctContext);
            await steps.loadPlugins(this.wctContext);
            await steps.configure(this.wctContext);
            await steps.prepare(this.wctContext);
            this.firstRun = false;
          }
          await steps.runTests(this.wctContext);
        }
      } catch (e) {
        compilation.errors.push(e);
      } finally {
        if (this.options.clean) {
          await this.cleanOutputFolder();
        }
        if (!compiler.options.watch) {
          await cleankill.close();
        }
      }
      cb(null);
    });
  }

  /**
   *
   * @return {Promise}
   * @memberof UnitTestingPlugin
   */
  cleanOutputFolder() {
    return new Promise((resolve, reject) => {
      rimraf(this.options.output, (err) => {
        if (err) {
          return reject(err);
        } else {
          setTimeout(() => {
            return resolve();
          }, 2000);
        }
      });
    });
  }

  /**
   *
   *
   * @return {Promise}
   * @memberof UnitTestingPlugin
   */
  createOutputFolder() {
    return new Promise((resolve, reject) => {
      mkdirp(this.options.output, (err) => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }

  /**
   *
   *
   * @return {Array}
   * @memberof UnitTestingPlugin
   */
  getInputSuitePaths() {
    let suites = glob.sync(this.options.include, {
      cwd: process.env.PWD,
      ignore: this.options.exclude
    });
    return suites;
  }

  /**
   *
   * @param {String} filePath
   * @param {Object} compiler
   * @param {Object} compilation
   * @return {String}
   * @memberof UnitTestingPlugin
   */
  async getHtmlSuite(filePath, compiler, compilation) {
    const context = this.options.output;
    const suiteData = this.parseHtmlSuite(filePath);
    const fileName = suiteData.relativePath.replace(/\//g, '~~');
    const jsOutputPath = path.resolve(context, fileName.replace(/\.(?!.*\.).*$/, Date.now() + '.js'));
    const finalOutputPath = path.resolve(this.options.output, fileName);
    const compiledAssets = await this.copyJsToOutput(jsOutputPath, suiteData.js, compiler, compilation);

    let template = fs.readFileSync(path.resolve(__dirname, 'templates', 'sample.html'), 'utf-8');

    let scripts = '';
    for (let key in compiledAssets) {
      if (!compiledAssets.hasOwnProperty(key)) continue;
      scripts += `<script>${compiledAssets[key].source()}</script>`;
    }

    template = template
    .replace('aoflUnitTesting:wct-browser-legacy', path.relative(this.options.output, path.resolve(process.env.PWD, 'node_modules/wct-browser-legacy/browser.js')))
    .replace('aoflUnitTesting:html', suiteData.html);

    template = this.replaceTemplatePart(template, 'aoflUnitTesting:js', scripts);

    rimraf.sync(jsOutputPath);
    fs.writeFileSync(finalOutputPath, template, {encoding: 'utf-8'});

    return path.relative(process.env.PWD, finalOutputPath);
  }
  /**
   *
   *
   * @param {*} template
   * @param {*} match
   * @param {*} replace
   * @return {String}
   * @memberof UnitTestingPlugin
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
   * @param {*} _filePath
   * @return {Object}
   * @memberof UnitTestingPlugin
   */
  parseHtmlSuite(_filePath) {
    const filePath = path.resolve(_filePath);
    const suite = {
      path: filePath,
      relativePath: path.relative(process.env.PWD, filePath)
    };

    const content = fs.readFileSync(filePath, 'utf-8');
    const scriptRegex = /<script[^>]*>((?:.|\s)*?)<\/script>/;
    const scriptMatches = scriptRegex.exec(content);

    if (scriptMatches !== null) {
      suite.html = content.substring(0, scriptMatches.index);
      suite.js = this.jsToRelativeImport(scriptMatches[1], filePath);
    }

    return suite;
  }


  /**
   *
   *
   * @param {*} _filePath
   * @param {*} compiler
   * @param {*} compilation
   * @return {String}
   * @memberof UnitTestingPlugin
   */
  async getJsSuite(_filePath, compiler, compilation) {
    const context = this.options.output;
    const filePath = path.resolve(_filePath);
    const relativePath = path.relative(process.env.PWD, filePath);
    const fileName = relativePath.replace(/\//g, '~~');
    const jsOutputPath = path.resolve(context, fileName.replace(/\.(?!.*\.).*$/, Date.now() + '.js'));
    const finalOutputPath = path.resolve(this.options.output, fileName);
    const jsContent = fs.readFileSync(filePath, 'utf-8');
    const jsContentRelativePaths = this.jsToRelativeImport(jsContent, filePath);
    fs.writeFileSync(jsOutputPath, jsContentRelativePaths, {encoding: 'utf-8'});

    const compiledAssets = await this.compileJs(compiler, compilation, jsOutputPath, context);

    let content = '';
    for (let key in compiledAssets) {
      if (!compiledAssets.hasOwnProperty(key)) continue;
      content += `${compiledAssets[key].source()}`;
    }

    fs.writeFileSync(finalOutputPath, content, {encoding: 'utf-8'});

    return path.relative(process.env.PWD, finalOutputPath);
  }

  /**
   *
   *
   * @param {*} _content
   * @param {*} filePath
   * @return {String}
   * @memberof UnitTestingPlugin
   */
  jsToRelativeImport(_content, filePath) {
    let imports = parseImports(_content);
    let content = _content;
    for (let i = 0; i < imports.length; i++) {
      if (imports[i].fromModule.charAt(0) !== '.') continue;
      content = content.replace(new RegExp(imports[i].fromModule, 'g'), path.relative(this.options.output, path.resolve(path.dirname(filePath), imports[i].fromModule)));
    }
    return content;
  }


  /**
   *
   * @param {*} outputPath
   * @param {*} content
   * @param {*} compiler
   * @param {*} compilation
   * @return {Array}
   * @memberof UnitTestingPlugin
   */
  async copyJsToOutput(outputPath, content, compiler, compilation) {
    const context = this.options.output;
    fs.writeFileSync(outputPath, content, {encoding: 'utf-8'});
    return await this.compileJs(compiler, compilation, outputPath, context);
  }
  /**
   * @param {*} compiler
   * @param {*} compilation
   * @param {*} filename
   * @param {*} context
   * @return {Promise}
   * @memberof UnitTestingPlugin
   */
  compileJs(compiler, compilation, filename, context) {
    const outputOptions = {
      ...compiler.options.output,
      filename: '[name].js'
    };
    const compilerName = UnitTestingPlugin.name + 'Compiler' + ' for ' + filename;
    const childCompiler = compilation.createChildCompiler(compilerName, outputOptions);
    childCompiler.context = context;
    const cachedAssets = Object.assign({}, compilation.assets);
    new JsonpTemplatePlugin().apply(childCompiler);
    // new LibraryTemplatePlugin('AOFL_UNIT_PLUGIN_RESULT', 'umd2').apply(childCompiler);
    new SingleEntryPlugin(childCompiler.context, filename).apply(childCompiler);
    new LoaderTargetPlugin('web').apply(childCompiler);

    childCompiler.hooks.compilation.tap(UnitTestingPlugin.name, (childCompilation) => {
      if (childCompilation.cache) {
        childCompilation.cache[compilerName];
        if (!childCompilation.cache[compilerName]) {
          childCompilation.cache[compilerName] = {};
        }
        childCompilation.cache = childCompilation.cache[compilerName];
      }
    });

    return new Promise((resolve, reject) => {
      childCompiler.runAsChild((err, entries, childCompilation) => {
        let compiledAssets = childCompilation.assets;
        for (let key in childCompilation.assets) {
          if (!childCompilation.assets.hasOwnProperty(key)) continue;
          if (typeof cachedAssets[key] === 'undefined') {
            delete compilation.assets[key];
          }
        }

        if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
          const errorDetails = childCompilation.errors.map((error) => error.message + (error.error ? ':\n' + error.error : '')).join('\n');
          reject(new Error('Child compilation failed:\n' + errorDetails));
        } else if (err) {
          reject(err);
        } else {
            return resolve(compiledAssets);
        }
      });
    });
  }
}

module.exports = UnitTestingPlugin;
