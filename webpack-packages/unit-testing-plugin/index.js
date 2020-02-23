const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const {defaultsDeep, WdioPrepareConfig} = require('@aofl/cli-lib');
const {LocalServer} = require('./modules/local-server');
const findCacheDir = require('find-cache-dir');
const Launcher = require('@wdio/cli').default;
const {configMap} = require('./modules/wdio-config/wdio-presets');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const titleCase = require('title-case');

class UnitTestingPlugin {
  static get name() {
    return 'AoflUnitTestingPlugin';
  }

  static get cacheDir() {
    return findCacheDir({name: UnitTestingPlugin.name, create: true});
  }

  static get nycOutputDir() {
    return path.join(UnitTestingPlugin.cacheDir, '.nyc_output');
  }

  constructor(options = {}) {
    this.options = defaultsDeep(options, {
      root: process.cwd(),
      output: '__build_tests',
      host: 'localhost',
      port: 3035,
      config: this.getConfigPath(),
      watch: false,
      debug: false,
      nycArgs: [
        'report',
        '--reporter=lcov',
        '--reporter=text-summary',
        '--report-dir=./logs/coverage'
      ]
    });

    this.server = null;
    rimraf.sync(UnitTestingPlugin.cacheDir);
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync(UnitTestingPlugin.name, async (stats, cb) => {
      try {
        const suites = [];
        for (let i = 0; i < this.options.entries.length; i++) {
          const entry = this.options.entries[i];
          if (stats.compilation.entrypoints.has(entry)) {
            suites.push({
              html: path.join(entry + '.html'),
              path: entry
            });
          }
        }

        if (this.server === null) {
          this.server = new LocalServer(
            path.resolve(this.options.output), this.options.host, this.options.port, this.options.debug
          );
          this.server.listen();
        }

        const wdioSuites = this.createSuites(suites);
        const wdioConfig = new WdioPrepareConfig(configMap, this.options.config, UnitTestingPlugin.name + '_config', this.options.debug);
        const wdioConfigPath = wdioConfig.generateConfig();

        const wdio = new Launcher(wdioConfigPath, {
          specs: wdioSuites,
          baseUrl: `http://${this.server.host}:${this.server.port}`
        });

        let code = await wdio.run();
        if (!this.options.watch) {
          this.server.close();
          if (this.options.nycArgs && code === 0) {
            code = await this.runNyc();
          }
        }
        if (code !== 0) {
          return cb(code);
        }
      } catch (e) {
        process.stdout.write(chalk.red('Launcher failed to start the test' + '\n'));
        return cb(e);
      }
      return cb(null);
    });
  }

  runNyc() {
    return new Promise((resolve, reject) => {
      const nyc = spawn('nyc', [
        ...this.options.nycArgs,
        `--temp-dir=${UnitTestingPlugin.nycOutputDir}`,
        '--clean'
      ], {
        stdio: 'pipe',
        env: {
          ...process.env,
          FORCE_COLOR: 1
        }
      });

      if (nyc.stdout !== null) {
        nyc.stdout.on('data', (data) => {
          process.stdout.write(data);
        });
      }
      nyc.on('close', (code, ...args) => {
        if (code === 0) {
          resolve(null);
        } else {
          reject(code);
        }
      });
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
      } catch (e) {
        // process.stdout.write('caught', e + '\n');
      }
    }
  }

  createSuites(suites) {
    const wdioSuites = [];
    for (let i = 0; i < suites.length; i++) {
      const suite = suites[i];
      const suiteName = titleCase(suite.path.replace(/\.spec\.js$/, ''));
      const target = path.join(UnitTestingPlugin.cacheDir, suite.path);
      const suiteContent = `const {expect} = require('chai');
const logger =  require('@wdio/logger').default;
const chalk = require('chalk');

const symbols = {
  ok: '✓',
  err: '✖',
  dot: '․',
  comma: ',',
  bang: '!'
};

const log = logger('@aofl/unit-testing-plugin');
const getEnvironmentCombo = (caps) => {
  const device = caps.deviceName;
  const browser = (caps.browserName || caps.browser);
  const version = caps.version || caps.platformVersion || caps.browser_version;
  const platform = caps.os ? (caps.os + ' ' + caps.os_version) : (caps.platform || caps.platformName)

  // Mobile capabilities
  if (device) {
      const program = (caps.app || '').replace('sauce-storage:', '') || caps.browserName
      const executing = program ? 'executing ' + program : ''

      return ('device on ' + platform + ' ' + version + ' ' + executing).trim()
  }

  return browser + (version ? ' (v' + version + ')' : '') + (platform ? ' on ' + platform : '')
}

describe('${suiteName}', () => {
  before(function() {
    if (driver.isMobile === false) {
      try {
        browser.maximizeWindow();
      } catch (e) {}
    }
  });

  it('Running Tests /${suite.html}', function() {
    browser.url('/${suite.html}');
    browser.waitUntil(() => {
      const ready = browser.execute('return !(typeof window.aofljsConfig === "undefined" || typeof window.aofljsConfig.unitTesting === "undefined" || window.aofljsConfig.unitTesting.ready === false)');
      return ready === true;
    }, browser.config.waitforTimeout, 'expected tests to be ready in timeout period', browser.config.waitforInterval);

    let report = null;
    browser.waitUntil(() => {
      const r = browser.execute(function() {
        var report = {
          status: 'init',
          pass: true,
          stream: []
        };

        if (typeof aofljsConfig !== 'undefined' && typeof aofljsConfig.report !== 'undefined' && typeof aofljsConfig.report.status !== 'undefined' && typeof aofljsConfig.report.pass !== 'undefined' && typeof aofljsConfig.report.stream !== 'undefined') {
          var report = {
            status: aofljsConfig.report.status,
            pass: aofljsConfig.report.pass,
            stream: aofljsConfig.report.stream
          };
          aofljsConfig.report.stream = [];
        }
        return report;
      });
      if (typeof r === 'undefined') return false;
      if (report === null) {
        report = r;
      } else {
        report = {
          ...r,
          stream: report.stream.concat(r.stream)
        }
      }

      for (let i = 0; i < r.stream.length; i++) {
        const test = r.stream[i];
        const result = test[0];
        const testInfo = test[1];
        if (result === 'pass') {
          if (['warn', 'error', 'silent'].indexOf(browser.config.logLevel) === -1) {
            let out = '\\t' + chalk.green(symbols.ok) + ' ' + getEnvironmentCombo(browser.capabilities) + ' >> ' + testInfo.fullTitle + ' (' + testInfo.duration + 'ms)';
            if (testInfo.currentRetry > 0) {
              out += ' (Retry: ' + testInfo.currentRetry + ')';
            }
            process.stdout.write(out + '\\n');
          }
          log.info('pass - ' + testInfo.fullTitle);
        } else {
          if (browser.config.logLevel !== 'silent') {
            let out = '\t' + chalk.red(symbols.err) + ' ' + getEnvironmentCombo(browser.capabilities) + ' >> ' + testInfo.fullTitle + ' (' + testInfo.duration + 'ms)';
            if (testInfo.currentRetry > 0) {
              out += ' (Retry: ' + testInfo.currentRetry + ')';
            }
            process.stdout.write(out + '\\n');
            process.stdout.write('\\n\\t\\t' + chalk.red(testInfo.stack) + '\\n\\n');
          }
          log.error('fail - ' + testInfo.fullTitle + ' - error: ' + testInfo.err);
          log.error(testInfo.stack);
        }
      }

      return report.status === 'done';
    }, browser.config.waitforTimeout, 'expected tests to run within timeout period.', browser.config.waitforInterval);

    let coverage = {};
    let coverageIndex = 0;
    browser.waitUntil(() => {
      const c = browser.execute(function(index) {
        var min = index * 5;
        var max = (index + 1) * 5;
        var curr = 0;
        var data = [];
        for (var key in aofljsConfig.report.coverage) {
          if (curr >= min && curr < max) {
            data.push({
              key: key,
              value: aofljsConfig.report.coverage[key]
            });
          }
          curr++;
        }
        return {
          data: data,
          done: max > (Object.keys(aofljsConfig.report.coverage).length - 1)
        }
      }, coverageIndex++);

      for (let i = 0; i < c.data.length; i++) {
        coverage[c.data[i].key] = c.data[i].value;
      }

      return c.done;
    }, browser.config.waitforTimeout, 'Failed te retrieve coverage data.', 100);
    global.aoflUnitTesting.coverage.push(coverage);
    expect(report.pass).to.be.true;
  });
});
`;
      fs.mkdirSync(path.dirname(target), {recursive: true});
      fs.writeFileSync(target, suiteContent, {encoding: 'utf-8'});
      wdioSuites.push(target);
    }
    return wdioSuites;
  }
}

module.exports = UnitTestingPlugin;
