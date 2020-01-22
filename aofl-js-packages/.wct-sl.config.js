const sharedSettings = {
  recordLogs: true,
  recordVideo: true,
  recordScreenshots: false,
  timeout: 300,
  idleTimeout: 1000,
  commandTimeout: 600,
  webdriverRemoteQuietExceptions: false,
  videoUploadOnPass: false,
  tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || null
};

const config = {
  preset: 'sauce',
  specFileRetries: 1,
  capabilities: [
    {
      ...sharedSettings,
      "browserName": "Safari",
      "appiumVersion": "1.15.0",
      "deviceName": "iPhone X Simulator",
      "platformVersion": "13.0",
      "platformName": "iOS"
    },
    {
      'browserName': 'internet explorer',
      'browserVersion': 'latest',
      'platformName': 'Windows 7',
      'sauce:options': {
        ...sharedSettings
      }
    },
    {
      'browserName': 'MicrosoftEdge',
      'browserVersion': 'latest',
      'platformName': 'Windows 10',
      'sauce:options': {
        ...sharedSettings
      }
    },
    {
      "browserName": 'chrome',
      "browserVersion": 'latest',
      "platformName": 'Windows 10',
      "sauce:options": {
        ...sharedSettings
      }
    },
    {
      "browserName": 'firefox',
      "browserVersion": 'latest',
      "platformName": 'Windows 10',
      "sauce:options": {
        ...sharedSettings
      }
    },
    {
      'browserName': 'chrome',
      'browserVersion': 'latest',
      'platformName': 'macOS 10.15',
      "sauce:options": {
        ...sharedSettings
      }
    },
    {
      'browserName': 'firefox',
      'browserVersion': 'latest',
      'platformName': 'macOS 10.15',
      "sauce:options": {
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
    },
    {
      ...sharedSettings,
      "appiumVersion": "1.9.1",
      "deviceName": "Android GoogleAPI Emulator",
      "deviceOrientation": "portrait",
      "browserName": "Chrome",
      "platformVersion": '10.0',
      "platformName": "Android"
    },
    {
      ...sharedSettings,
      "appiumVersion": "1.9.1",
      "deviceName": "Android GoogleAPI Emulator",
      "deviceOrientation": "portrait",
      "browserName": "Chrome",
      "platformVersion": '9.0',
      "platformName": "Android"
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
    }
  ]
};

exports.config = config
