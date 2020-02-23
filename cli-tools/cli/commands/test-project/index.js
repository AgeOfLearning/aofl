const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const chalk = require('chalk');
const {environments, DebugReporter, resources, htmlWebpackConfig} = require('@aofl/cli-lib');
const glob = require('fast-glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const jsStringEscape = require('js-string-escape');
const findCacheDir = require('find-cache-dir');
const UnitTestingPlugin = require('@aofl/unit-testing-plugin');
const {loadConfig} = require('../../lib/webpack-config');

const defaultEntries = {
  'custom-elements-es5-adapter': resources.CUSTOM_ELEMENTS_ES5_ADAPTER,
  'test-vendors': path.join(__dirname, 'test-vendors', 'index.js'),
  'mocha': path.join(__dirname, 'test-vendors', 'mocha.js')
};
/**
 *
 *
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
class TestProject {
  /**
   * Creates an instance of TestProject.
   *
   * @param {String} config
   * @param {Boolean} watch
   * @param {Boolean} stats
   * @param {Boolean} profile
   * @param {Boolean} debug
   */
  constructor(config = '.aofl.js', watch = false, stats = false, profile = false, debug = false, reporter = 'fancy', skipAll = false, specs = [], suites = []) {
    if (typeof process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = environments.TEST;
    }

    this.configPath = path.resolve(config);
    this.watch = watch;
    this.stats = stats;
    this.profile = profile;
    this.debug = debug;
    this.reporter = reporter;
    this.skipAll = skipAll;
    this.config = loadConfig(this.configPath);
    this.setSuites(specs, suites);


    if (debug) {
      this.reporter = new DebugReporter();
    }


    const reporters = [this.reporter];
    this.profile && reporters.push('profile');
    this.stats && reporters.push('stats');

    if (typeof this.config.unitTesting.polyfill !== 'undefined') {
      const polyfillPath = this.config.unitTesting.polyfill;
      this.config.webpack.module.rules.unshift({
        test: defaultEntries['test-vendors'],
        include: path.dirname(defaultEntries['test-vendors']),
        use: {
          loader: path.join(__dirname, 'polyfills-loader.js'),
          options: {
            polyfillPath
          }
        }
      });
    }

    if (typeof this.config.unitTesting.mocha !== 'undefined') {
      this.config.webpack.module.rules.unshift({
        test: defaultEntries['test-vendors'],
        include: path.dirname(defaultEntries['test-vendors']),
        use: {
          loader: path.join(__dirname, 'mocha-loader.js'),
          options: {
            mocha: this.config.unitTesting.mocha
          }
        }
      });
    }

    const entries = {
      ...this.getEntries()
    };

    this.config.build.entry = {...entries, ...defaultEntries};
    this.config.webpack.entry = {...entries, ...defaultEntries};
    if (this.watch) {
      this.config.webpack.devtool = 'none';
    }

    this.config.webpack.performance = {hints: false};
    this.addHtmlWebpackPlugin(entries);

    this.config.webpack.plugins.push(new UnitTestingPlugin({
      root: this.config.root,
      config: this.config.unitTesting.config,
      exclude: this.config.unitTesting.exclude,
      output: this.config.unitTesting.output,
      host: this.config.unitTesting.host,
      port: this.config.unitTesting.port,
      entries: Object.keys(entries),
      watch: this.watch,
      nycArgs: this.config.unitTesting.nycArgs,
      debug: this.debug
    }));

    this.config.webpack.plugins.push(new WebpackBar({
      name: this.config.name,
      profile: true,
      color: '#1e90ff',
      reporters
    }));

    this.config.webpack.optimization = {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendors: false,
          default: false
        }
      }
    };

    // fix mocha import
    this.config.webpack.module.exprContextCritical = false;
    this.config.webpack.node = this.config.webpack.node || {};
    this.config.webpack.node.fs = 'empty';
  }

  setSuites(specs = [], suites = []) {
    this.suites = {};
    if (suites.length > 0) {
      const patterns = [];

      for (let i = 0; i < suites.length; i++) {
        patterns.push(...this.config.unitTesting.suites[suites[i]]);
        this.suites[suites[i]] = glob.sync(patterns, {
          ignore: this.config.unitTesting.exclude,
          cwd: this.config.unitTesting.root
        });
      }
    } else if (specs.length === 0) {
      this.suites['default_suite'] = glob.sync(this.config.unitTesting.specs, { // eslint-disable-line
        ignore: this.config.unitTesting.exclude,
        cwd: this.config.unitTesting.root
      });
    } else {
      this.suites['default_suite'] = specs; // eslint-disable-line
    }

    if (!this.skipAll) {
      this.suites['total_coverage_suite'] = this.getCoverAllFiles(); // eslint-disable-line
    }
  }

  getEntries(config, specs = []) {
    const cacheDir = findCacheDir({name: '@aofl/cli-test', create: true});
    const entries = {};

    for (const suite in this.suites) {
      if (!Object.prototype.hasOwnProperty.call(this.suites, suite)) continue;
      const suiteFileName = suite + '.spec.js';
      const specPath = path.join(cacheDir, suiteFileName);
      let spec = this.suites[suite].reduce((acc, item) => {
        acc += `import './${path.relative(path.dirname(specPath), path.join(this.config.unitTesting.root, item))}';\n`;
        return acc;
      }, '');

      if (suite === 'total_coverage_suite') {
        spec += `import {expect} from 'chai';

describe('Total Coverage Suite', function() {
  it('Should generate total coverage report', function() {
    expect(true).to.be.true;
  });
});
`;
      }
      fs.writeFileSync(specPath, spec, {encoding: 'utf-8'});
      entries[suiteFileName] = specPath;
    }

    return entries;
  }

  getCoverAllFiles() {
    if (this.watch || this.skipAll) return [];
    const files = glob.sync('**/*.js', {
      ignore: [
        ...this.config.unitTesting.exclude,
        '**/' + this.config.unitTesting.output,
        '**/*.spec.js'
      ],
      cwd: this.config.unitTesting.root
    });

    return files;
  }

  addHtmlWebpackPlugin(entries) {
    const defaultConfig = htmlWebpackConfig(environments.TEST);

    for (const key in entries) {
      if (!Object.hasOwnProperty.call(entries, key)) continue;
      this.config.webpack.plugins.push(new HtmlWebpackPlugin({
        ...defaultConfig,
        filename: key + '.html',
        template: path.join(__dirname, 'test-vendors', 'template.ejs'),
        chunks: [...Object.keys(defaultEntries), key],
        templateParameters(compilation, assets, options) {
          const assetsMap = {};
          for (const chunkKey in compilation.chunks) {
            if (!Object.hasOwnProperty.call(compilation.chunks, chunkKey)) continue;
            const chunk = compilation.chunks[chunkKey];
            if (typeof chunk.name === 'string' && chunk.name.length > 0) {
              const url = assets.publicPath + chunk.files[0];
              const source = compilation.assets[chunk.files[0].replace(/\?.*/, '')].source();
              const sourceStr = jsStringEscape(source);

              let chunkName = chunk.name;
              if (chunk.name === key) {
                chunkName = 'test-suite';
              }
              assetsMap[chunkName] = {
                url,
                source,
                sourceStr
              };
            }
          }

          return {
            compilation,
            webpack: compilation.getStats().toJson(),
            webpackConfig: compilation.options,
            htmlWebpackPlugin: {
              files: assets,
              options
            },
            assetsMap,
            mode: compilation.compiler.options.mode
          };
        }
      }));
    }
  }
  /**
   *
   */
  async init() {
    await new Promise((resolve) => { // wait for mac to update cache file :`(
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    let compiler = null;
    try {
      compiler = webpack(this.config.webpack);
    } catch (err) {
      if (err.name === 'WebpackOptionsValidationError') {
        process.stdout.write(chalk.red(err.message + '\n'));
        process.exit(1);
      }

      throw err;
    }

    const errorHandler = (err, stats) => {
      if (!this.watch || err) {
        // Do not keep cache anymore
        compiler.purgeInputFileSystem();
      }
      if (err) {
        process.stdout.write((err.stack || err) + '\n');
        if (err.details) {
          process.stdout.write(err.details + '\n');
        }
        !this.watch && process.exit(1);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        process.stdout.write(info.errors + '\n');
        !this.watch && process.exit(2);
      }

      if (stats.hasWarnings()) {
        process.stdout.write(info.warnings + '\n');
        !this.watch && process.exit(0);
      }
    };

    if (this.watch) {
      compiler.watch({
        aggregateTimeout: 300,
        poll: void(0),
        ...this.config.webpack.watchOptions
      }, errorHandler);
    } else {
      compiler.run((err, stats) => {
        if (compiler.close) {
          compiler.close((err2) => {
            errorHandler(err || err2, stats);
          });
        } else {
          errorHandler(err, stats);
        }
      });
    }
  }
}

module.exports = TestProject;
