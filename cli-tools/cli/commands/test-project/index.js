const path = require('path');
const {loadConfig} = require('../../lib/webpack-config');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const environmentEnumerate = require('../../lib/environment-enumerate');
const DebugReporter = require('../../lib/webpackbar-debug-reporter');
const chalk = require('chalk');
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
      process.env.NODE_ENV = environmentEnumerate.TEST;
    }

    const reporters = [this.reporter];
    this.profile && reporters.push('profile');
    this.stats && reporters.push('stats');

    this.config = loadConfig(this.configPath);
    this.config.webpack.plugins.push(new WebpackBar({
      name: this.config.name,
      profile: true,
      color: '#1e90ff',
      reporters
    }));
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
        process.exit(1);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        process.stdout.write(info.errors + '\n');
        process.exit(2);
      }

      if (stats.hasWarnings()) {
        process.stdout.write(info.warnings + '\n');
        process.exit(0);
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
