const path = require('path');
const fs = require('fs');
const findCacheDir = require('find-cache-dir');
const Launcher = require('@wdio/cli').default;
const chalk = require('chalk');

const CACHE_DIR = 'aoflwdio';
const DEFAULT_CONFIG_MAP = {
  'default': path.join(__dirname, '..', '..', 'lib', 'wdio-config', 'presets', 'default.js'),
  'sauce': path.join(__dirname, '..', '..', 'lib', 'wdio-config', 'presets', 'sauce.js')
};

class RunTest {
  /**
   * Creates an instance of RunTest.
   *
   * @param {String} config
   * @param {Boolean} watch
   * @param {Boolean} suite
   * @param {Boolean} spec
   * @param {Boolean} debug
   */
  constructor(config = '.aoflwdio.js', watch = false, suite, spec, debug = false) {
    this.userConfigPath = path.resolve(config);
    this.mergeConfigPath = path.join(__dirname, '..', '..', 'lib', 'wdio-config', 'mergeConfig.js');
    this.userConfig = require(this.userConfigPath).config;
    this.preset = 'default';
    if (typeof this.userConfig.preset !== 'undefined') {
      this.preset = this.userConfig.preset;
    }
    this.defaultConfigPath = DEFAULT_CONFIG_MAP[this.preset];
    this.watch = watch;
    this.spec = spec;
    this.suite = suite;
    this.debug = debug;
  }


  /**
   * Sets up the the directory in node modules cache, and creates the module that returns
   * the config that the wdio launcher uses to run tests
   *
   */
  setupCacheDirectory() {
    const cacheDir = findCacheDir({name: CACHE_DIR, create: true});
    const outputPath = path.join(cacheDir, 'wdio.config.js');
    const userConfigPath = path.relative(cacheDir, this.userConfigPath);
    const defaultConfigPath = path.relative(cacheDir, this.defaultConfigPath);
    const mergeConfigPath = path.relative(cacheDir, this.mergeConfigPath);

    const content = `const userConfig = require('${userConfigPath}');
const defaultConfig = require('${defaultConfigPath}');
const mergeConfig = require('${mergeConfigPath}');
const config =  mergeConfig.init(defaultConfig.config, userConfig.config, ${this.debug});

// console.log(config);
// process.exit(0);
module.exports.config = config;
    `;

    fs.writeFileSync(outputPath, content, {encoding: 'utf-8'});
    return outputPath;
  }

  /**
   * Initializes the test runner
   *
   */
  async init() {
    const {spec, suite, watch} = this;
    const outputPath = this.setupCacheDirectory();

    const wdio = new Launcher(outputPath, {spec, suite, watch});
    try {
      const code = await wdio.run();
      process.exit(code);
    } catch (e) {
      process.stdout.write(chalk.red('Launcher failed to start the test' + '\n'));
      process.stdout.write(e.stacktrace + '\n');
      process.exit(1);
    }
  }
}

module.exports = RunTest;
