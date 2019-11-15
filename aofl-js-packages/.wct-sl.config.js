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
          ...sharedSettings,
          "browserName": "Safari",
          "appiumVersion": "1.15.0",
          "deviceName": "iPhone X Simulator",
          "platformVersion": "13.0",
          "platformName": "iOS",
        },
        {
          ...sharedSettings,
          "appiumVersion": "1.9.1",
          "deviceName": "Google Pixel GoogleAPI Emulator",
          "deviceOrientation": "portrait",
          "browserName": "Chrome",
          "platformVersion": '8.1',
          "platformName": "Android",
        },
        {
          ...sharedSettings,
          "appiumVersion": "1.9.1",
          "deviceName": "Android GoogleAPI Emulator",
          "deviceOrientation": "portrait",
          "browserName": "Chrome",
          "platformVersion": "6.0",
          "platformName": "Android",
        },
        {
          "browserName": "MicrosoftEdge",
          "platform": "Windows 10",
          "version": "latest",
          "sauce:options": {
            ...sharedSettings,
            "priority": 0
          }
        },
        {
          "browserName": "internet explorer",
          "platform": "Windows 7",
          "version": "11.0",
          "sauce:options": {
            ...sharedSettings,
            "priority": 0
          }
        }
      ]
    }
  }
};

module.exports = config;
