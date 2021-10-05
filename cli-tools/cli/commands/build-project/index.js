const path = require('path');
const {DebugReporter} = require('@aofl/cli-lib');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const chalk = require('chalk');
const {loadConfig} = require('../../lib/webpack-config');

/**
 *
 *
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
class BuildProject {
  /**
   * Creates an instance of BuildProject.
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

    const reporters = [this.reporter];

    this.profile && reporters.push('profile');
    this.stats && reporters.push('stats');
    this.config = loadConfig(this.configPath);
    this.config.webpack.plugins.push(new WebpackBar({
      name: this.config.name,
      profile: true,
      color: '#FFFF00',
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
        !this.watch && process.exit(1);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        process.stdout.write(JSON.stringify(info.errors, null, 2) + '\n');
        !this.watch && process.exit(2);
      }

      if (stats.hasWarnings()) {
        process.stdout.write(JSON.stringify(info.warnings, null, 2) + '\n');
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
            if (err || err2) {
              errorHandler(err || err2, stats);
            } else {
              process.stdout.write(stats.toString({
                // Add console colors
                colors: true,
              }) + '\n');
            }
          });
        } else if (err) {
          errorHandler(err, stats);
        }
      });
    }
  }
}

module.exports = BuildProject;
