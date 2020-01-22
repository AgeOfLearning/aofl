const chai = require('chai');

exports.config = {
  //
  // ====================
  // Default Runner Configuration
  // ====================
  runner: 'local',
  path: '/wd/hub',
  specs: ['wdio-tests/specs/**/*.spec.js'],
  exclude: [],
  suites: {},
  specFileRetries: 0,
  maxInstances: 10,
  capabilities: null,
  logLevel: 'error',
  bail: 0,
  baseUrl: null,
  waitforTimeout: 120000,
  waitforInterval: 500,
  connectionRetryCount: 10,
  services: [''],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'mochawesome', {
        outputDir: 'wdio-tests/results',
        outputFileFormat: (opts) => {
          return `results-${opts.cid}.${opts.capabilities.browserName}.json`;
        }
      }
    ]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 600000
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
    chai.should();
  }
};
