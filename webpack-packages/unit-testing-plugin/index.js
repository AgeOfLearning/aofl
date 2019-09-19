const path = require('path');
const fs = require('fs');
const {defaultsDeep} = require('lodash');
const WctContext = require('./wct/context');
const {CliReporter} = require('./wct/clireporter');
const cleankill = require('cleankill');
const steps = require('./wct/steps');
const chalk = require('chalk');
const {PathHelper} = require('@aofl/cli-lib');

class UnitTestingPlugin {
  static get name() {
    return 'AoflUnitTestingPlugin';
  }

  constructor(options = {}) {
    this.options = defaultsDeep(options, {
      root: process.cwd(),
      include: '**/*.js',
      exclude: ['**/node_modules/**'],
      output: '__build_tests',
      config: this.getConfigPath(),
      watch: false
    });

    let wctConfig = {};

    wctConfig = require(path.resolve(this.options.config));
    this.wctConfig = defaultsDeep(wctConfig, {
      npm: true,
      moduleResolution: 'node',
      compile: 'never',
      persistent: this.options.watch,
      root: this.options.root
    });

    this.wctContext = new WctContext(this.wctConfig);
    this.wctContext.options.suites = [];
    this.runCount = 0;
    if (this.wctContext.options.output) {
      this.CliReporter = new CliReporter(this.wctContext, this.wctContext.options.output, this.wctContext.options);
    }
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync(UnitTestingPlugin.name, async (stats, cb) => {
      const suites = [];
      for (let i = 0; i < this.options.entries.length; i++) {
        const entry = this.options.entries[i];
        if (stats.compilation.entrypoints.has(entry)) {
          suites.push('./' + path.join(PathHelper.stripEndSlashes(this.options.output), entry + '.html'));
        }
      }
      this.wctContext.options.suites = suites;

      try {
        if (this.wctContext.options.suites.length > 0) {
          if (this.runCount === 0) {
            await steps.setupOverrides(this.wctContext);
            await steps.loadPlugins(this.wctContext);
            await steps.configure(this.wctContext);
            await steps.prepare(this.wctContext);
            await steps.runTests(this.wctContext);
          } else {
            await steps.refreshTests(this.wctContext);
            process.stdout.write(chalk.green('Tests ran successfully') + '\n');
          }
        } else {
          process.stdout.write(chalk.red('no tests were supplied to wct') + '\n');
        }
      } catch (e) {
        if (e instanceof Error) {
          stats.compilation.errors.push(e);
        } else if (typeof e === 'object') {
          stats.compilation.errors.push(new Error('UnitTestingError: ' + JSON.stringify(e)));
        }
      } finally {
        if (!this.options.watch) {
          await cleankill.close();
        }
      }

      this.runCount++;

      cb(null);
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
}

module.exports = UnitTestingPlugin;
