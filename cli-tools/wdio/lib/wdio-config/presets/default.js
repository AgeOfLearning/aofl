const chai = require('chai');

exports.config = {
  //
  // ====================
  // Default Runner Configuration
  // ====================
  runner: 'local',
  path: '/wd/hub',
  specs: ['wdio-tests/**/*.spec.js'],
  exclude: [],
  suites: {},
  specFileRetries: 0,
  maxInstances: 10,
  capabilities: null,
  logLevel: 'error',
  bail: 0,
  baseUrl: null,
  waitforTimeout: 300000,
  waitforInterval: 500,
  connectionRetryCount: 3,
  outputDir: 'logs/wdio',
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
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before(capabilities, specs) {
    // Using Chai
    global.expect = chai.expect;
    chai.config.includeStack = true;
    chai.should();
  }
};
