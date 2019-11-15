const npmPkg = require('./package.json');

const jobName = process.env.TRAVIS_REPO_SLUG || 'AgeOfLearning/aofl';

const sharedSettings = {
  "recordLogs": false,
  "recordVideo": false,
  "recordScreenshots": false,
  "timeout": 300,
  "avoidProxy": true,
  "idleTimeout": 1000,
  "commandTimeout": 600,
  "webdriverRemoteQuietExceptions": false,
  "videoUploadOnPass": false
};

const config = {
  verbose: false,
  plugins: {
    sauce: {
      jobName,
      tunnelOptions: {
        noSslBumpDomains: 'all',
        noProxyCaching: true
      },
      browsers: [
        {
          "browserName": "chrome",
          "platform": "macOS 10.13",
          "version": "latest",
          "sauce:options": {
            ...sharedSettings
          }
        },
        {
          "browserName": "firefox",
          "version": "latest",
          "platform": "macOS 10.13",
          "sauce:options": {
            ...sharedSettings
          }
        },
        {
          "browserName": "safari",
          "version": "latest",
          "platform": "macOS 10.13",
          "sauce:options": {
            ...sharedSettings
          }
        }
      ]
    }
  }
};

module.exports = config;
