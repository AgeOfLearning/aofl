const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const chalk = require('chalk');
const {loadConfig, environments, DebugReporter, resources, htmlWebpackConfig} = require('@aofl/cli-lib');
const glob = require('fast-glob');
const md5 = require('tiny-js-md5');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const jsStringEscape = require('js-string-escape');
const findCacheDir = require('find-cache-dir');
const UnitTestingPlugin = require('@aofl/unit-testing-plugin');
const mkdirp = require('mkdirp');

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
  constructor(config = '.aofl.js', watch = false, stats = false, profile = false, debug = false, reporter = 'fancy') {
    this.configPath = path.resolve(config);
    this.watch = watch;
    this.stats = stats;
    this.profile = profile;
    this.debug = debug;
    this.reporter = reporter;

    if (debug) {
      this.reporter = new DebugReporter();
    }

    if (typeof process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = environments.TEST;
    }

    const reporters = [this.reporter];
    this.profile && reporters.push('profile');
    this.stats && reporters.push('stats');

    this.config = loadConfig(this.configPath);
    if (typeof this.config.unitTesting.polyfill !== 'undefined') {
      const polyfillPath = this.config.unitTesting.polyfill;
      this.config.webpack.module.rules.unshift({
        test: defaultEntries['test-vendors'],
        include: path.dirname(defaultEntries['test-vendors']),
        use: {
          loader: path.join(__dirname, 'loader.js'),
          options: {
            polyfillPath
          }
        }
      });
    }

    const entries = {
      ...TestProject.getEntries(this.config),
      ...this.getCoverAllFiles()
    };

    this.config.build.entry = {...entries, ...defaultEntries};
    this.config.webpack.entry = {...entries, ...defaultEntries};
    if (this.watch) {
      this.config.webpack.devtool = 'none';
    }
    this.config.webpack.output.path = path.join(this.config.root, this.config.unitTesting.output);
    this.config.webpack.output.publicPath = '';
    this.config.webpack.performance = {hints: false};

    this.addHtmlWebpackPlugin(entries);


    this.config.webpack.plugins.push(new UnitTestingPlugin({
      root: this.config.root,
      config: this.config.unitTesting.config,
      include: this.config.unitTesting.include,
      exclude: this.config.unitTesting.exclude,
      output: this.config.unitTesting.output,
      entries: Object.keys(entries),
      watch: this.watch
    }));

    this.config.webpack.plugins.push(new WebpackBar({
      name: this.config.name,
      profile: true,
      color: '#1e90ff',
      reporters
    }));
  }

  static getEntries(config) {
    const entries = glob.sync(config.unitTesting.include, {
      ignore: config.unitTesting.exclude,
      cwd: config.root
    });

    return entries.reduce((acc, item) => {
      acc[md5(item)] = path.join(config.root, item);
      return acc;
    }, {});
  }

  addHtmlWebpackPlugin(entries) {
    const defaultConfig = htmlWebpackConfig(environments.TEST);

    for (const key in entries) {
      if (!entries.hasOwnProperty(key)) continue;
      this.config.webpack.plugins.push(new HtmlWebpackPlugin({
        ...defaultConfig,
        filename: key + '.html',
        template: path.join(__dirname, 'test-vendors', 'template.ejs'),
        chunks: [...Object.keys(defaultEntries), key],
        templateParameters(compilation, assets, options) {
          const assetsMap = {};
          for (const chunkKey in compilation.chunks) {
            if (!compilation.chunks.hasOwnProperty(chunkKey)) continue;
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

  getCoverAllFiles() {
    if (this.watch) return;
    const files = glob.sync(['**/*.js'], {
      ignore: [
        ...this.config.unitTesting.exclude,
        '**/' + this.config.unitTesting.output,
        '**/*.spec.js'
      ],
      cwd: this.config.root
    });

    const cacheDir = findCacheDir({name: UnitTestingPlugin.name});
    const entryName = md5('cover-all');
    const jsOutputPath = path.join(cacheDir, entryName + '.spec.js');
    const content = files.reduce((acc, item) => {
      acc += `import './${path.relative(path.dirname(jsOutputPath), path.join(this.config.root, item))}';\n`;
      return acc;
    }, '');

    mkdirp.sync(cacheDir);
    fs.writeFileSync(jsOutputPath, content, {encoding: 'utf-8'});

    return {
      [entryName]: jsOutputPath
    };
  }

  /**
   *
   */
  init() {
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
