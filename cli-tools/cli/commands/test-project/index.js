const path = require('path');
const {loadConfig} = require('../../lib/webpack-config');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const environmentEnumerate = require('../../lib/environment-enumerate');

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
  constructor(config = '.aofl.js', watch = false, stats = false, profile = false, debug = false) {
    this.configPath = path.resolve(config);
    this.watch = watch;
    this.stats = stats;
    this.profile = profile;
    this.debug = debug;

    if (typeof process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = environmentEnumerate.TEST;
    }

    const reporters = ['fancy'];
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
    const compiler = webpack(this.config.webpack);
    const errorHandler = (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    };

    if (this.watch) {
      compiler.watch({
        aggregateTimeout: 300,
        poll: void(0)
      }, this.debug? errorHandler: () => {});
    } else {
      compiler.run(this.debug? errorHandler: () => {});
    }
  }
}

module.exports = TestProject;
