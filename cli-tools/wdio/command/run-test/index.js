const {WdioPrepareConfig} = require('@aofl/cli-lib');
const {configMap} = require('../../lib/wdio-config/wdio-presets');
const Launcher = require('@wdio/cli').default;
const findCacheDir = require('find-cache-dir');
const chalk = require('chalk');


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
    const wdioConfig = new WdioPrepareConfig(configMap, config, RunTest.cacheNamespace, debug);

    this.wdioConfigPath = wdioConfig.generateConfig();
    this.wdioOptions = {
      watch,
      suite,
      spec
    };
  }

  static get cacheNamespace() {
    return '@aofl/wdio';
  }

  static get cacheDir() {
    return findCacheDir({name: RunTest.cacheNamespace, create: true});
  }
  /**
   * Initializes the test runner
   */
  async init() {
    const wdio = new Launcher(this.wdioConfigPath, this.wdioOptions);
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

module.exports.RunTest = RunTest;
