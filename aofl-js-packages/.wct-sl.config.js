const npmPkg = require('./package.json');

const sharedSettings = {
  avoidProxy: true,
  idleTimeout: 1000,
  commandTimeout: 600,
  recordScreenshots: false,
  recordLogs: false,
  webdriverRemoteQuietExceptions: false,
  videoUploadOnPass: false,
};

const config = {
  verbose: false,
  testTimeout: 600000,
  plugins: {
    sauce: {
      tunnelOptions: {
        noSslBumpDomains: 'all',
        noProxyCaching: true
      },
      browsers: [
        {
          ...sharedSettings,
          browserName: 'Safari',
          appiumVersion: '1.13.0',
          deviceName: 'iPhone X Simulator',
          platformVersion: '12.2',
          platformName: 'iOS',
        },
        {
          ...sharedSettings,
          appiumVersion: '1.9.1',
          deviceName: 'Google Pixel GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          browserName: 'Chrome',
          platformVersion: '8.1',
          platformName: 'Android',
        },
        {
          ...sharedSettings,
          appiumVersion: '1.9.1',
          deviceName: 'Android GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          browserName: 'Browser',
          platformVersion: '6.0',
          platformName: 'Android',
        },
        {
          ...sharedSettings,
          browserName: 'chrome',
          platform: 'Windows 10',
          version: 'latest',
          "sauce:options": {
            "recordVideo": false,
            "recordScreenshots": false,
            "screenResolution": '800x600',
          }
        },
        {
          ...sharedSettings,
          browserName: 'firefox',
          platform: 'Windows 10',
          version: 'latest',
          "sauce:options": {
            "recordVideo": false,
            "recordScreenshots": false,
            "screenResolution": '800x600',
          }
        },
        {
          ...sharedSettings,
          browserName: 'MicrosoftEdge',
          platform: 'Windows 10',
          version: 'latest',
          "sauce:options": {
            recordVideo: false,
            recordScreenshots: false,
            screenResolution: '800x600',
          }
        },
        {
          ...sharedSettings,
          browserName: 'internet explorer',
          platform: 'Windows 7',
          version: '11.0',
          "sauce:options": {
            "recordVideo": false,
            "recordScreenshots": false,
            "screenResolution": '800x600',
          }
        },
        {
          ...sharedSettings,
          browserName: 'safari',
          platform: 'macOS 10.13',
          version: 'latest',
          "sauce:options": {
            "recordVideo": false,
            "recordScreenshots": false,
            "screenResolution": '1024x768',
          }
        }
      ]
    }
  }
};

module.exports = config;
