const npmPkg = require('./package.json');

const build = `v${npmPkg.version}`;

const sharedSettings = {
  avoidProxy: true,
  idleTimeout: 1000,
  commandTimeout: 600,
  recordScreenshots: false,
  recordLogs: false,
  webdriverRemoteQuietExceptions: false,
  videoUploadOnPass: false
};

const config = {
  verbose: false,
  testTimeout: 210000,
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
          browserName: 'Safari',
          appiumVersion: '1.9.1',
          deviceName: 'iPhone 5 Simulator',
          deviceOrientation: 'portrait',
          platformVersion: '10.3',
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
          platformVersion: '5.1',
          platformName: 'Android',
        },
        {
          ...sharedSettings,
          browserName: 'chrome',
          platform: 'Windows 10',
          version: 'latest',
        },
        {
          ...sharedSettings,
          browserName: 'firefox',
          platform: 'Windows 10',
          version: 'latest',
        },
        {
          ...sharedSettings,
          browserName: 'MicrosoftEdge',
          platform: 'Windows 10',
          version: 'latest',
        },
        {
          ...sharedSettings,
          browserName: 'internet explorer',
          platform: 'Windows 10',
          version: 'latest',
        },
        {
          ...sharedSettings,
          browserName: 'safari',
          platform: 'macOS 10.13',
          version: 'latest',
        }
      ]
    }
  }
};

module.exports = config;
