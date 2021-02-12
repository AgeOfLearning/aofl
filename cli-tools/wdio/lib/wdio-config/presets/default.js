const chai = require('chai');

exports.config = {
  //
  // ====================
  // Default Runner Configuration
  // ====================
  runner: 'local',
  path: '/',
  specs: ['wdio-tests/**/*.spec.js'],
  exclude: [],
  suites: {},
  specFileRetries: 0,
  maxInstances: 10,
  maxInstancesPerCapability: 10,
  capabilities: null,
  logLevel: 'error',
  bail: 0,
  execArgv: [],
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
  // =====
  // Hooks
  // =====
  before(capabilities, specs, browser) {
    // Using Chai
    global.expect = chai.expect;
    chai.config.includeStack = true;
    chai.should();
  }
};
