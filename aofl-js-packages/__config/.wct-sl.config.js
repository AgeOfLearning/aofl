const npmPkg = require("../package.json");

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
        noSslBumpDomains: "all",
        noProxyCaching: true
      },
      browsers: [
        {
          ...sharedSettings,
          browserName: 'Safari',
          appiumVersion: '1.9.1',
          deviceName: 'iPhone X Simulator',
          platformVersion: '12.0',
          platformName: 'iOS',
        },
        {
          ...sharedSettings,
          browserName: 'Safari',
          appiumVersion: '1.7.1',
          deviceName: 'iPhone 4s Simulator',
          deviceOrientation: 'portrait',
          platformVersion: '9.3',
          platformName: 'iOS',
        },
        {
          ...sharedSettings,
          appiumVersion: '1.9.1',
          deviceName: 'Android GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          browserName: 'Chrome',
          platformVersion: '7.1',
          platformName: 'Android',
        },
        {
          ...sharedSettings,
          appiumVersion: '1.9.1',
          deviceName: 'Android GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          browserName: 'Browser',
          platformVersion: '4.4',
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
          browserName: 'internet explorer',
          platform: 'Windows 7',
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
