const defaults = require('./default').config;
const {CrossBrowserTestingService} = require('../services/crossbrowsertesting');

const user = process.env.CBT_USERNAME;
const key = process.env.CBT_AUTHKEY;

const service = new CrossBrowserTestingService();

const config = {
  ...defaults,
  //
  // ====================
  // Default Runner Configuration
  // ====================
  user,
  key,
  hostname: 'hub.crossbrowsertesting.com',
  port: 80,
  cbtTunnel: false,
  cbtTunnelOpts: {},
  capabilities: [
    {
      'browserName': 'Chrome',
      'platform': 'Windows 10',
      'screenResolution': '1366x768',
      'record_video': 'true'
    }
  ],
  services: ['crossbrowsertesting'],
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  beforeSession(config, capabilities, specs) {
    return service.beforeSession(config, capabilities, specs);
  },
  // /**
  //  * Hook that gets executed before the suite starts
  //  * @param {Object} suite suite details
  //  */
  // beforeSuite(suite) {
  //   return service.beforeSuite(suite);
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   * @param {*} test
   * @param {*} context
   */
  beforeTest(test, context) {
    return service.beforeTest(test, context);
  },
  // /**
  //      * Function to be executed after a test (in Mocha/Jasmine)
  //      */
  // afterTest(test, context, {error, result, duration, passed, retries}) {
  //   return service.afterTest(test, context, {error, result, duration, passed, retries});
  // },
  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  afterSuite(suite) {
    return service.afterSuite(suite);
  },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  after(result, capabilities, specs) {
    return service.after(result, capabilities, specs);
  },
  // /**
  //  * Gets executed when a refresh happens.
  //  * @param {String} oldSessionId session ID of the old session
  //  * @param {String} newSessionId session ID of the new session
  //  */
  // onReload(oldSessionId, newSessionId) {
  //   return service.onReload(oldSessionId, newSessionId);
  // },
  // /**
  //  * Cucumber-specific hooks
  //  */
  // beforeFeature(uri, feature, scenarios) {
  //   return service.beforeFeature(uri, feature, scenarios);
  // },
  // afterScenario(uri, feature, scenario, result, sourceLocation) {
  //   return service.afterScenario(uri, feature, scenario, result, sourceLocation);
  // }
};

exports.config = config;
