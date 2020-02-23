const SauceLabs = require('saucelabs').default;
const defaults = require('./default').config;

const user = process.env.SAUCE_USERNAME;
const key = process.env.SAUCE_ACCESS_KEY;

const updateJob = (jobId, body) => {
  const sauceInstance = new SauceLabs({user, key});
  return sauceInstance.updateJob(process.env.SAUCE_USERNAME, jobId, body);
};

const sharedSettings = {
  recordLogs: true,
  recordVideo: true,
  recordScreenshots: false,
  timeout: 300,
  idleTimeout: 1000,
  commandTimeout: 600,
  webdriverRemoteQuietExceptions: false,
  videoUploadOnPass: false
};

const config = {
  ...defaults,
  //
  // ====================
  // Default Runner Configuration
  // ====================
  user,
  key,
  region: 'us',
  sauceConnect: false,
  sauceConnectOpts: {},
  capabilities: [
    {
      'browserName': 'chrome',
      'browserVersion': 'latest',
      'platformName': 'macOS 10.15',
      'sauce:options': {
        ...sharedSettings
      }
    },
    {
      'browserName': 'firefox',
      'browserVersion': 'latest',
      'platformName': 'macOS 10.15',
      'sauce:options': {
        ...sharedSettings
      }
    },
    {
      'browserName': 'safari',
      'browserVersion': 'latest',
      'platformName': 'macOS 10.15',
      'sauce:options': {
        ...sharedSettings
      }
    }
  ],
  services: ['sauce'],
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
  async before(capabilities, specs) {
    await Promise.resolve(defaults.before(capabilities, specs));

    if (typeof process.env.JOB_ID === 'undefined') return;
    updateJob(browser.sessionId, {
      build: process.env.JOB_ID,
    });
  },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   * @param {*} test
   * @param {*} context
   */
  beforeTest(test, context) {
    this.fullTitle = `${process.env.JOB_ID} - ${test.fullTitle}`;
    updateJob(browser.sessionId, {
      name: this.fullTitle,
    });
  },
  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  afterSuite(suite) {
    updateJob(browser.sessionId, {
      name: suite.fullTitle,
    });
  },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  after(result, capabilities, specs) {
    const testPassed = result === 0 ? true : false;
    updateJob(browser.sessionId, {
      passed: testPassed
    });
  },
};

exports.config = config;
