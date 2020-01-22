const chai = require('chai');
const typeKeys = require('./custom_commands/typeKeys');
const click = require('./custom_commands/click');
const focus = require('./custom_commands/focus');
const waitForNavigation = require('./custom_commands/waitForNavigation');
const mergeResults = require('wdio-mochawesome-reporter/mergeResults');

exports.config = {
  //
  // ====================
  // Default Runner Configuration
  // ====================
  runner: 'local',
  path: '/wd/hub',
  spec: [],
  exclude: [],
  suites: {},
  specFileRetries: 0,
  maxInstances: 10,
  capabilities: null,
  logLevel: 'info',
  bail: 0,
  baseUrl: null,
  waitforTimeout: 10000,
  waitforInterval: 500,
  connectionRetryCount: 3,
  services: [''],
  framework: 'mocha',
  reporters: [
    'spec',
    ['mochawesome', {
      outputDir: './results',
      outputFileFormat: (opts) => { 
        return `results-${opts.cid}.${opts.capabilities.browserName}.json`
      }
    }]
  ],
  mochaOpts: {
      ui: 'bdd',
      timeout: 60000
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
  before: function (capabilities, specs) {
    // Using Chai
    global.expect = chai.expect
    chai.Should();
    
    // New Commands
    browser.addCommand('waitForNavigation', waitForNavigation);
    browser.addCommand('typeKeys', typeKeys);
    browser.addCommand('focus', focus, true);

    // Overrides
    browser.overwriteCommand('click', click, true);
  },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   * @param {String} mochaOutputRoot 
   */
  onComplete: function(exitCode, config, capabilities, results, mochaOutputRoot) {
    const outputPath = mochaOutputRoot ? `${mochaOutputRoot}/results` : './results'
    mergeResults(outputPath, 'results-*');
  },
}
