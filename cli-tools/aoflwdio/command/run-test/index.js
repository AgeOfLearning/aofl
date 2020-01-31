const path = require('path');
const fs = require('fs');
const findCacheDir = require('find-cache-dir');
const Launcher = require('@wdio/cli').default;

const CACHE_DIR = 'aoflwdio';

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
    this.defaultConfigPath = path.join(__dirname, '..', '..', 'lib', 'wdio-config', 'default.js');
    this.mergeConfigPath = path.join(__dirname, '..', '..', 'lib', 'wdio-config', 'mergeConfig.js');

    this.watch = watch;
    this.spec = spec;
    this.suite = suite;
    this.debug = debug;
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
      console.error('Launcher failed to start the test', e.stacktrace);
      process.exit(1);
    }
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

module.exports.config = config;
    `;

    fs.writeFileSync(outputPath, content, {encoding: 'utf-8'});
    return outputPath;
  }
}

module.exports = RunTest;
