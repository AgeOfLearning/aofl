/**
 *
 * @class MergeConfig
 */
class MergeConfig {
  /**
   *
   * @param {String} key
   * @param {Object} defaultConfig
   * @param {Object} userConfig
   * @return {Mixed}
   */
  static replaceKey(key, defaultConfig, userConfig) {
    if (typeof userConfig[key] !== 'undefined') {
      return userConfig[key];
    }

    return defaultConfig[key];
  }
  /**
   *
   * @param {Object} defaultConfig
   * @param {Object} userConfig
   * @return {Function}
   */
  static applicationSpecificKeys(defaultConfig, userConfig) {
    const applicationKeys = {...defaultConfig};

    for (const key in userConfig) {
      if (!Object.prototype.hasOwnProperty.call(userConfig, key)) continue;
      if (typeof userConfig[key] !== 'function') {
        applicationKeys[key] = userConfig[key];
      }
    }

    return applicationKeys;
  }
  /**
   *
   * @param {Boolean} debug
   * @param {Object} defaultConfig
   * @param {Object} userConfig
   * @return {Object}
   */
  static getLogLevels(debug, defaultConfig, userConfig) {
    const isKeyValid = typeof userConfig.logLevels === 'object';
    if (debug && isKeyValid) {
      for (const key in userConfig.logLevels) {
        if (!Object.prototype.hasOwnProperty.call(userConfig.logLevels, key)) continue;
        userConfig.logLevels[key] = 'debug';
      }
    }

    return isKeyValid ? userConfig.logLevels : {};
  }

  /**
   *
   * @param {String} hook
   * @param {Object} defaultConfig
   * @param {Object} userConfig
   * @param  {...any} args
   */
  static async applyHook(hook, defaultConfig, userConfig, ...args) {
    if (typeof defaultConfig[hook] === 'function') {
      await Promise.resolve(defaultConfig[hook](...args));
    }
    if (typeof userConfig[hook] === 'function') {
      await Promise.resolve(userConfig[hook](...args));
    }
  }

  /**
   *
   * @param {Object} defaultConfig
   * @param {Object} userConfig
   * @return {Object} The merged config passed to the WebDriverIO service
   */
  static init(defaultConfig, userConfig, debug = false) {
    return {
      //
      // ====================
      // Runner Configuration
      // ====================
      //
      // Below are application specific keys that should only be present if they are present in the userConfig
      // Examples are this are keys for 'user', 'key', which are only valid if cloud services are passed
      // in the 'services' key.
      ...MergeConfig.applicationSpecificKeys(defaultConfig, userConfig),
      //
      // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
      // on a remote machine).
      runner: MergeConfig.replaceKey('runner', defaultConfig, userConfig),
      //
      // Override default path ('/wd/hub') for chromedriver service.
      path: MergeConfig.replaceKey('path', defaultConfig, userConfig),
      //
      // ==================
      // Specify Test Files
      // ==================
      // Define which test specs should run. The pattern is relative to the directory
      // from which `wdio` was called. Notice that, if you are calling `wdio` from an
      // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
      // directory is where your package.json resides, so `wdio` will be called from there.
      //
      specs: MergeConfig.replaceKey('specs', defaultConfig, userConfig),
      //
      // Patterns to exclude.
      exclude: MergeConfig.replaceKey('exclude', defaultConfig, userConfig),
      //
      // Application level defined test suites
      suites: MergeConfig.replaceKey('suites', defaultConfig, userConfig),
      //
      // The number of times to retry the entire specfile when it fails as a whole
      specFileRetries: MergeConfig.replaceKey('specFileRetries', defaultConfig, userConfig),
      //
      // ============
      // Capabilities
      // ============
      // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
      // time. Depending on the number of capabilities, WebdriverIO launches several test
      // sessions. Within your capabilities you can overwrite the spec and exclude options in
      // order to group specific specs to a specific capability.
      //
      // First, you can define how many instances should be started at the same time. Let's
      // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
      // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
      // files and you set maxInstances to 10, all spec files will get tested at the same time
      // and 30 processes will get spawned. The property handles how many capabilities
      // from the same test should run tests.
      //
      maxInstances: MergeConfig.replaceKey('maxInstances', defaultConfig, userConfig),
      //
      // If you have trouble getting all important capabilities together, check out the
      // Sauce Labs platform configurator - a great tool to configure your capabilities:
      // https://docs.saucelabs.com/reference/platforms-configurator
      //
      capabilities: MergeConfig.replaceKey('capabilities', defaultConfig, userConfig),
      //
      // Default request retries count
      connectionRetryCount: MergeConfig.replaceKey('connectionRetryCount', defaultConfig, userConfig),
      //
      // Test runner services
      // Services take over a specific job you don't want to take care of. They enhance
      // your test setup with almost no effort. Unlike plugins, they don't add new
      // commands. Instead, they hook themselves up into the test process.
      services: MergeConfig.replaceKey('services', defaultConfig, userConfig),
      //
      // Level of logging verbosity: trace | debug | info | warn | error | silent
      logLevel: debug ? 'debug' : MergeConfig.replaceKey('logLevel', defaultConfig, userConfig),
      logLevels: MergeConfig.getLogLevels(debug, defaultConfig, userConfig),
      //
      // If you only want to run your tests until a specific amount of tests have failed use
      // bail (default is 0 - don't bail, run all tests).
      bail: MergeConfig.replaceKey('bail', defaultConfig, userConfig),
      //
      // Set a base URL in order to shorten url command calls. If your `url` parameter starts
      // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
      // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
      // gets prepended directly.
      baseUrl: MergeConfig.replaceKey('baseUrl', defaultConfig, userConfig),
      //
      // Default timeout for all waitFor* commands.
      waitforTimeout: MergeConfig.replaceKey('waitforTimeout', defaultConfig, userConfig),
      //
      // Default interval for all waitFor* commands.
      waitforInterval: MergeConfig.replaceKey('waitforInterval', defaultConfig, userConfig),
      // Framework you want to run your specs with.
      // The following are supported: Mocha, Jasmine, and Cucumber
      // see also: https://webdriver.io/docs/frameworks.html
      //
      // Make sure you have the wdio adapter package for the specific framework installed
      // before running any tests.
      framework: defaultConfig.framework,
      //
      // The number of times to retry the entire specfile when it fails as a whole
      // specFileRetries: 1,
      //
      // Test reporter for stdout.
      // The only one supported by default is 'dot'
      // see also: https://webdriver.io/docs/dot-reporter.html
      reporters: MergeConfig.replaceKey('reporters', defaultConfig, userConfig),
      //
      // Options to be passed to Mocha.
      // See the full list at http://mochajs.org/
      mochaOpts: MergeConfig.replaceKey('mochaOpts', defaultConfig, userConfig),
      //
      // =====
      // Hooks
      // =====
      // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
      // it and to build services around it. You can either apply a single function or an array of
      // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
      // resolved to continue.
      /**
       * Gets executed once before all workers get launched.
       * @param {Object} config wdio configuration object
       * @param {Array.<Object>} capabilities list of capabilities details
       */
      onPrepare(config, capabilities) {
        return MergeConfig.applyHook('onPrepare', defaultConfig, userConfig, config, capabilities);
      },
      /**
       * Gets executed just before initialising the webdriver session and test framework. It allows you
       * to manipulate configurations depending on the capability or spec.
       * @param {Object} config wdio configuration object
       * @param {Array.<Object>} capabilities list of capabilities details
       * @param {Array.<String>} specs List of spec file paths that are to be run
       */
      beforeSession(config, capabilities, specs) {
        return MergeConfig.applyHook('beforeSession', defaultConfig, userConfig, config, capabilities, specs);
      },
      /**
       * Gets executed before test execution begins. At this point you can access to all global
       * variables like `browser`. It is the perfect place to define custom commands.
       * @param {Array.<Object>} capabilities list of capabilities details
       * @param {Array.<String>} specs List of spec file paths that are to be run
       */
      before(capabilities, specs) {
        return MergeConfig.applyHook('before', defaultConfig, userConfig, capabilities, specs);
      },
      /**
       * Hook that gets executed before the suite starts
       * @param {Object} suite suite details
       */
      beforeSuite(suite) {
        return MergeConfig.applyHook('beforeSuite', defaultConfig, userConfig, suite);
      },
      /**
       * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
       * beforeEach in Mocha)
       * @param {*} test
       * @param {*} context
       */
      beforeHook(test, context) {
        return MergeConfig.applyHook('beforeHook', defaultConfig, userConfig, test, context);
      },
      /**
       * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
       * afterEach in Mocha)
       * @param {*} test
       * @param {*} context
       * @param {Object} stepData
       * @param {Object} stepData.error
       * @param {Object} stepData.result
       * @param {Number} stepData.duration
       * @param {Boolean} stepData.passed
       * @param {Number} stepData.retries
       * @param {Object} world
       */
      afterHook(test, context, stepData, world) {
        return MergeConfig.applyHook('afterHook', defaultConfig, userConfig, test, context, stepData, world);
      },
      /**
       * Function to be executed before a test (in Mocha/Jasmine) starts.
       * @param {*} test
       * @param {*} context
       */
      beforeTest(test, context) {
        return MergeConfig.applyHook('beforeTest', defaultConfig, userConfig, test, context);
      },
      /**
       * Runs before a WebdriverIO command gets executed.
       * @param {String} commandName hook command name
       * @param {Array} args arguments that command would receive
       */
      beforeCommand(commandName, args) {
        return MergeConfig.applyHook('beforeCommand', defaultConfig, userConfig, commandName, args);
      },
      /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object, if any
     */
      afterCommand(commandName, args, result, error) {
        return MergeConfig.applyHook('afterCommand', defaultConfig, userConfig, commandName, args, result, error);
      },
      /**
       * Function to be executed after a test (in Mocha/Jasmine)
       */
      afterTest(test, context, {error, result, duration, passed, retries}) {
        return MergeConfig.applyHook('afterTest', defaultConfig, userConfig, test, context, {error, result, duration, passed, retries});
      },
      /**
       * Hook that gets executed after the suite has ended
       * @param {Object} suite suite details
       */
      afterSuite(suite) {
        return MergeConfig.applyHook('afterSuite', defaultConfig, userConfig, suite);
      },
      /**
       * Gets executed after all tests are done. You still have access to all global variables from
       * the test.
       * @param {Number} result 0 - test pass, 1 - test fail
       * @param {Array.<Object>} capabilities list of capabilities details
       * @param {Array.<String>} specs List of spec file paths that ran
       */
      after(result, capabilities, specs) {
        return MergeConfig.applyHook('after', defaultConfig, userConfig, result, capabilities, specs);
      },
      /**
       * Gets executed right after terminating the webdriver session.
       * @param {Object} config wdio configuration object
       * @param {Array.<Object>} capabilities list of capabilities details
       * @param {Array.<String>} specs List of spec file paths that ran
       */
      afterSession(config, capabilities, specs) {
        return MergeConfig.applyHook('afterSession', defaultConfig, userConfig, config, capabilities, specs);
      },
      /**
       * Gets executed after all workers got shut down and the process is about to exit. An error
       * thrown in the onComplete hook will result in the test run failing.
       * @param {Object} exitCode 0 - success, 1 - fail
       * @param {Object} config wdio configuration object
       * @param {Array.<Object>} capabilities list of capabilities details
       * @param {<Object>} results object containing test results
       */
      onComplete(exitCode, config, capabilities, results) {
        return MergeConfig.applyHook('onComplete', defaultConfig, userConfig, exitCode, config, capabilities, results);
      },
      /**
      * Gets executed when a refresh happens.
      * @param {String} oldSessionId session ID of the old session
      * @param {String} newSessionId session ID of the new session
      */
      onReload(oldSessionId, newSessionId) {
        return MergeConfig.applyHook('onReload', defaultConfig, userConfig, oldSessionId, newSessionId);
      },
      /**
       * Cucumber-specific hooks
       */
      beforeFeature(uri, feature, scenarios) {
        return MergeConfig.applyHook('beforeFeature', defaultConfig, userConfig, uri, feature, scenarios);
      },
      beforeScenario(uri, feature, scenario, sourceLocation) {
        return MergeConfig.applyHook('beforeScenario', defaultConfig, userConfig, uri, feature, scenario, sourceLocation);
      },
      beforeStep(uri, feature, stepData, context) {
        return MergeConfig.applyHook('beforeStep', defaultConfig, userConfig, uri, feature, stepData, context);
      },
      afterStep(uri, feature, {error, result, duration, passed}, stepData, context) {
        return MergeConfig.applyHook('afterStep', defaultConfig, userConfig, uri, feature, {error, result, duration, passed}, stepData, context);
      },
      afterScenario(uri, feature, scenario, result, sourceLocation) {
        return MergeConfig.applyHook('afterScenario', defaultConfig, userConfig, uri, feature, scenario, result, sourceLocation);
      },
      afterFeature(uri, feature, scenarios) {
        return MergeConfig.applyHook('afterFeature', defaultConfig, userConfig, uri, feature, scenarios);
      }
    };
  }
}

module.exports = MergeConfig;
