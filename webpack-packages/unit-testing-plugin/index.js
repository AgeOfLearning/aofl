const glob = require('fast-glob');
const path = require('path');
const chalk = require('chalk');
const {spawn} = require('child_process');
const defaultsDeep = require('lodash.defaultsdeep');
const fs = require('fs');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const {steps} = require('web-component-tester');
const WctContext = require('web-component-tester/runner/context');
const {CliReporter} = require('web-component-tester/runner/clireporter');
const cleankill = require('cleankill');
const md5 = require('tiny-js-md5');
const {getChunksMap} = require('./assets-map');
const {Npm} = require('@aofl/cli-lib');
/**
 *
 */
class UnitTestingPlugin {
  /**
   *
   *
   * @readonly
   * @static
   */
  static get name() {
    return 'AoflUnitTestingPlugin';
  }

  /**
   * Creates an instance of UnitTestingPlugin.
   * @param {*} [options={}]
   */
  constructor(options = {}) {
    this.options = defaultsDeep(options, {
      include: '**/*.js',
      exclude: ['**/node_modules/**'],
      output: '__build_tests',
      config: this.getConfigPath(),
      clean: true,
      scripts: []
    });

    this.options.exclude.push(path.join('**', this.options.output, '**'));
    this.options.output = path.resolve(process.cwd(), this.options.output);

    let wctConfig = {};
    wctConfig = require(path.resolve(this.options.config));

    this.wctConfig = defaultsDeep(wctConfig, {
      npm: true,
      moduleResolution: 'node',
      compile: 'never'
    });

    this.wctContext = new WctContext(this.wctConfig);
    this.wctContext.options.suites = [];
    this.runCount = 0;
    this.wctRelPath = '';
    this.watchMode = false;
    this.createOutputFolder();
  }

  /**
   *
   *
   * @param {*} compiler
   */
  apply(compiler) {
    const files = glob.sync([
      '**/*.spec.js',
      '**/index.js'
    ], {
      ignore: this.options.exclude
    });

    const allJsEntryPath = this.getCoverAllEntryPath([path.join(__dirname, 'get-test-container', 'index.js'), ...files], 'all-tests');
    // let allJsEntryPath = this.getCoverAllEntryPath([path.join(__dirname, 'get-test-container', 'index.js'), ...files].filter((item) => item.indexOf('.spec.js') === -1), 'all-tests');

    const entryPoints = [allJsEntryPath];
    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i];
    //   if (file.indexOf('.spec.js') === -1) continue;
    //   entryPoints.push(this.getCoverAllEntryPath([path.join(__dirname, 'get-test-container', 'index.js'), file], file));
    // }

    entryPoints.forEach((item) => {
      const entryPath = path.resolve(item);
      const entryName = UnitTestingPlugin.name + '-' + md5(entryPath);
      new SingleEntryPlugin(compiler.context, entryPath, entryName).apply(compiler);
    });

    compiler.hooks.beforeRun.tapAsync(UnitTestingPlugin.name, (compilation, cb) => {
      // await this.cleanOutputFolder();
      // await this.createOutputFolder();
      cb(null);
    });

    compiler.hooks.watchRun.tapAsync(UnitTestingPlugin.name, (compilation, cb) => {
      this.watchMode = true;
      cb(null);
    });

    compiler.hooks.afterEmit.tapAsync(UnitTestingPlugin.name, async (compilation, cb) => {
      try {
        if (this.runCount === 0) {
          let wctInstalls = '';
          try {
            wctInstalls = await Npm.list('web-component-tester', false, '', true, false, {stdio: 'pipe'});
          } catch (e) {
            wctInstalls = e.res;
          }
          const wctArr = wctInstalls.split('\n');
          let wctPath = '';
          if (wctArr.length > 0) {
            [wctPath] = wctArr;
            this.wctRelPath = path.dirname(path.relative(path.join(process.env.PWD, 'node_modules'), wctPath));
          }
        }

        const chunksMap = getChunksMap(compilation);
        const additionalScripts = this.getAdditionalScripts(compilation, chunksMap);
        for (const key in chunksMap) {
          if (!chunksMap.hasOwnProperty(key) || key.indexOf(UnitTestingPlugin.name) !== 0) continue;
          const source = compilation.assets[chunksMap[key]].source();
          const suite = this.generateSuite(key, source, additionalScripts, this.wctRelPath);
          if (this.wctContext.options.suites.indexOf(suite) === -1) {
            this.wctContext.options.suites.push(suite);
          }
        }

        if (this.wctContext.options.suites.length > 0) {
          if (this.runCount === 0) {
            if (this.wctContext.options.output) {
              new CliReporter(this.wctContext, this.wctContext.options.output, this.wctContext.options);
            }
            await steps.setupOverrides(this.wctContext);
            await steps.loadPlugins(this.wctContext);
            await steps.configure(this.wctContext);
            await steps.prepare(this.wctContext);
          }

          if (!this.watchMode || (this.watchMode && this.runCount >= 1)) {
            await steps.runTests(this.wctContext);
          }
        } else {
          process.stdout.write(chalk.red('no tests were supplied to wct') + '\n');
        }
      } catch (e) {
        if (e instanceof Error) {
          compilation.errors.push(e);
        } else if (typeof e === 'object') {
          compilation.errors.push('UnitTestingError: ' + JSON.stringify(e));
        }
      } finally {
        if (!this.watchMode) {
          if (this.options.clean) {
            await this.cleanOutputFolder();
          }
          await cleankill.close();
        }
      }

      this.runCount++;
      return cb(null);
    });
  }

  /**
   * @return {String}
   */
  getConfigPath() {
    const paths = [
      '.wct.config.js',
      '.wctrc.json',
      'wct.conf.json'
    ];
    for (let i = 0; i < paths.length; i++) {
      try {
        const p = path.join(process.env.PWD, paths[i]);
        const stat = fs.statSync(p);
        if (stat.isFile()) {
          return p;
        }
      } catch (e) {}
    }
  }

  /**
   *
   * @return {Promise}
   */
  cleanOutputFolder() {
    return new Promise((resolve, reject) => {
      const rm = spawn('rm', [
        '-rf',
        this.options.output
      ]);

      rm.on('close', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   *
   *
   * @return {Promise}
   */
  createOutputFolder() {
    return new Promise((resolve, reject) => {
      const mkdir = spawn('mkdir', [
        '-p',
        '-m',
        777,
        this.options.output
      ]);

      mkdir.on('close', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @param {String[]} files
   * @param {String} filename
   *
   * @return {String}
   */
  getCoverAllEntryPath(files, filename) {
    const context = this.options.output;
    const jsOutputPath = path.resolve(context, md5(filename) + '.spec.js');

    const content = files.reduce((acc, item) => {
      acc += `import './${path.relative(path.dirname(jsOutputPath), path.resolve(item))}';\n`;
      return acc;
    }, '');

    fs.writeFileSync(jsOutputPath, content, {encoding: 'utf-8'});
    return jsOutputPath;
  }


  /**
   * @param {String} name
   * @param {String} content
   * @param {String} otherScripts
   * @param {String} relPath
   *
   * @return {String}
   */
  generateSuite(name, content, otherScripts) {
    const finalOutputPath = path.resolve(this.options.output, name + '.html');
    let template = fs.readFileSync(path.resolve(__dirname, 'templates', 'sample.html'), 'utf-8');


    template = this.replaceTemplatePart(template, 'aoflUnitTesting:additionalScripts', '<script>\n' + otherScripts + '\n</script>');
    template = this.replaceTemplatePart(template, 'aoflUnitTesting:js', '<script>\n' + content + '\n</script>');

    fs.writeFileSync(finalOutputPath, template, {encoding: 'utf-8'});

    return path.relative(process.cwd(), finalOutputPath);
  }


  /**
   *
   * @param {Object} compilation
   * @param {Object} chunksMap
   *
   * @return {String}
   */
  getAdditionalScripts(compilation, chunksMap) {
    let scripts = '';

    for (let i = 0; i < this.options.scripts.length; i++) {
      if (typeof chunksMap[this.options.scripts[i]] !== 'undefined' &&
      typeof compilation.assets[chunksMap[this.options.scripts[i]]] !== 'undefined') {
        scripts += compilation.assets[chunksMap[this.options.scripts[i]]].source() + '\n';
      }
    }
    return scripts;
  }

  /**
   *
   *
   * @param {*} template
   * @param {*} match
   * @param {*} replace
   *
   * @return {String}
   */
  replaceTemplatePart(template, match, replace) {
    let i = template.indexOf(match);
    while (i > -1) {
      template = template.substring(0, i) + replace + template.substring(i + match.length);
      i = template.indexOf(match, i + replace.length);
    }
    return template;
  }
}

module.exports = UnitTestingPlugin;
