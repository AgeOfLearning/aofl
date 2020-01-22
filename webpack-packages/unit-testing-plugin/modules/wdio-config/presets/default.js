const chai = require('chai');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const uuidv4 = require('uuid/v4');
const {nycOutputDir} = require('../../../');

module.exports.config = {
  //
  // ====================
  // Default Runner Configuration
  // ====================
  runner: 'local',
  path: '/wd/hub',
  specs: ['**/*.spec.js'],
  exclude: [],
  suites: {},
  specFileRetries: 0,
  maxInstances: 5,
  capabilities: null,
  logLevel: 'error',
  bail: 0,
  baseUrl: null,
  waitforTimeout: 300000,
  waitforInterval: 500,
  connectionRetryCount: 3,
  outputDir: 'logs/unit-test',
  mochaOutputRoot: 'logs/mocha',
  services: ['selenium-standalone'],
  seleniumLogs: './logs/seleniumLogs/',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000
  },
  //
  // =====
  // Hooks
  // =====
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare(config, capabilities) {
    const nycDir = path.join(nycOutputDir);
    rimraf.sync(nycDir);
  },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before(capabilities, specs) {
    // Using Chai
    global.aoflUnitTesting = {
      coverage: []
    };
    global.expect = chai.expect;
    chai.config.includeStack = true;
    chai.should();
  },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  after(result, capabilities, specs) {
    const nycDir = path.join(nycOutputDir);
    fs.mkdirSync(nycDir, {recursive: true});
    try {
      for (let i = 0; i < global.aoflUnitTesting.coverage.length; i++) {
        const f = path.join(nycDir, `${uuidv4()}.json`);
        const content = JSON.stringify(global.aoflUnitTesting.coverage[i]).replace(/:null/g, ':{}');
        fs.writeFileSync(f, content, {encoding: 'utf-8'});
      }
    } catch (e) {
      console.log(e);
    }
  }
};
