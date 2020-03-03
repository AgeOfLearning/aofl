const request = require('request');
const logger = require('@wdio/logger').default;
const {titleCase} = require('title-case');

const log = logger('@aofl/wdio');

class CrossBrowserTestingService {
  constructor() {
    this.testCnt = 0;
    this.failures = 0;
    this.jobId = process.env.JOB_ID;
  }

  getRestUrl(sessionId) {
    return `https://crossbrowsertesting.com/api/v3/selenium/${sessionId}`;
  }

  setName(sessionId, name) {
    const result = {error: false, message: null};

    return new Promise((resolve, reject) => {
      if (browser.sessionId) {
        request({
          method: 'PUT',
          uri: this.getRestUrl(sessionId),
          body: {
            test: {
              name
            },
            name,
            description: name,
            action: 'set_description'
          },
          json: true
        },
        function(error, response, body) {
          // console.log('=============error');
          // console.log(error);
          // console.log('=============/error');
          // console.log('=============response');
          // console.log(response);
          // console.log('=============/response');
          // console.log('=============body');
          // console.log(body);
          // console.log('=============/body');
          if (error) {
            result.error = true;
            result.message = error;
            return reject(result);
          } else if (response.statusCode !== 200) {
            result.error = true;
            result.message = body;
            return reject(result);
          }

          result.error = false;
          result.message = 'success';

          return resolve(result);
        }).auth(this.config.user, this.config.key);
      } else {
        result.error = true;
        result.message = 'Session Id was not defined';
        return reject(result);
      }
    });
  }
  setScore(sessionId, score) {
    const result = {error: false, message: null};

    return new Promise((resolve, reject) => {
      if (browser.sessionId) {
        request({
          method: 'PUT',
          uri: this.getRestUrl(sessionId),
          body: {
            action: 'set_score',
            score
          },
          json: true
        },
        function(error, response, body) {
          if (error) {
            result.error = true;
            result.message = error;
            return reject(result);
          } else if (response.statusCode !== 200) {
            result.error = true;
            result.message = body;
            return reject(result);
          }

          result.error = false;
          result.message = 'success';

          return resolve(result);
        }).auth(this.config.user, this.config.key);
      } else {
        result.error = true;
        result.message = 'Session Id was not defined';
        return reject(result);
      }
    });
  }

  beforeSession(config, capabilities, specs) {
    this.config = config;
    this.capabilities = capabilities;
    this.config.user = config.user;
    this.config.key = config.key;
    this.cbtUsername = this.config.user;
    this.cbtAuthkey = this.config.key;
    this.isServiceEnabled = this.cbtUsername && this.cbtAuthkey;
    this.capabilities = capabilities;
    this.capabilities.build = this.jobId;
    this.capabilities.name = titleCase(
      specs[0]
        .replace('.spec.js', '')
        .split('/')
        .pop()
        .replace(/[._-]/g, ' ')
    );
    this.capabilities.max_duration = 180;
  }

  beforeTest(test, context) {
    this.fullTitle = `${this.jobId} - ${test.fullTitle}`;
    this.capabilities.name = this.fullTitle;
    return this.setName(global.browser.sessionId, this.fullTitle);
  }

  afterSuite(suite) {
    return this.setName(global.browser.sessionId, suite.fullTitle);
  }

  after(result, capabilities, specs) {
    if (!this.isServiceEnabled) {
      return;
    }

    capabilities.name = this.fullTitle;
    let failures = this.failures;

    if (global.browser.config.mochaOpts && global.browser.config.mochaOpts.bail && Boolean(result)) {
      failures = 1;
    }

    const status = 'status: ' + (failures > 0 ? 'failing' : 'passing');
    const score = failures > 0? 'fail': 'pass';

    if (!global.browser.isMultiremote) {
      log.info(`Update job with sessionId ${global.browser.sessionId}, ${status}`);
      return this.setScore(global.browser.sessionId, score);
    }

    return Promise.all(Object.keys(this.capabilities).map((browserName) => {
      log.info(`Update multiremote job for browser "${browserName}" and sessionId ${global.browser[browserName].sessionId}, ${status}`);
      return this.setScore(global.browser[browserName].sessionId, score);
    }));
  }
}

module.exports.CrossBrowserTestingService = CrossBrowserTestingService;
