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
        // {
        //   ...sharedSettings,
        //   name: 'iPhone (Xr, XsMax, Xs, X, 8+, 8, 7+, 7, SE, 6s+, 6s, 6+, 6, 5s)',
        //   browserName: 'Safari',
        //   appiumVersion: '1.9.1',
        //   deviceName: 'iPhone X Simulator',
        //   platformVersion: '12.0',
        //   platformName: 'iOS',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'iPhone 4s',
        //   browserName: 'Safari',
        //   appiumVersion: '1.7.1',
        //   deviceName: 'iPhone 4s Simulator',
        //   deviceOrientation: 'portrait',
        //   platformVersion: '9.3',
        //   platformName: 'iOS',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'Android Nougat 7.1 - Chrome',
        //   appiumVersion: '1.9.1',
        //   deviceName: 'Android GoogleAPI Emulator',
        //   deviceOrientation: 'portrait',
        //   browserName: 'Chrome',
        //   platformVersion: '7.1',
        //   platformName: 'Android',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'Android KitKat 4.4 - Browser',
        //   appiumVersion: '1.9.1',
        //   deviceName: 'Android GoogleAPI Emulator',
        //   deviceOrientation: 'portrait',
        //   browserName: 'Browser',
        //   platformVersion: '4.4',
        //   platformName: 'Android',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'Windows 10 - chrome',
        //   browserName: 'chrome',
        //   platform: 'Windows 10',
        //   version: 'latest',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'Windows 10 - firefox',
        //   browserName: 'firefox',
        //   platform: 'Windows 10',
        //   version: 'latest',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'Windows 10 - Edge',
        //   browserName: 'MicrosoftEdge',
        //   platform: 'Windows 10',
        //   version: 'latest',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'Windows 10 - ie11',
        //   browserName: 'internet explorer',
        //   platform: 'Windows 10',
        //   version: 'latest',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'Windows 7 - ie11',
        //   browserName: 'internet explorer',
        //   platform: 'Windows 7',
        //   version: 'latest',
        // },
        // {
        //   ...sharedSettings,
        //   name: 'macOS High Sierra - safari',
        //   browserName: 'safari',
        //   platform: 'macOS 10.13',
        //   version: 'latest',
        // },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "12.0",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.3",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.2",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.1",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.0",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "10.3",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.8.0",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "10.2",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.8.0",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "10.0",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.7.1",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: "9.3",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "12.0",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.3",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.2",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.1",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "11.0",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.9.1",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "10.3",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.8.0",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "10.2",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.8.0",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "10.0",
          platformName: "iOS"
        },
        {
          ...sharedSettings,
          browserName: "Safari",
          appiumVersion: "1.7.1",
          deviceName: "iPad Simulator",
          deviceOrientation: "portrait",
          platformVersion: "9.3",
          platformName: "iOS"
        },

        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Android GoogleAPI Emulator",
          deviceOrientation: "portrait",
          browserName: "Chrome",
          platformVersion: "7.1",
          platformName: "Android"
        },
        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Android GoogleAPI Emulator",
          deviceOrientation: "portrait",
          browserName: "Chrome",
          platformVersion: "7.0",
          platformName: "Android"
        },
        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Android GoogleAPI Emulator",
          deviceOrientation: "portrait",
          browserName: "Chrome",
          platformVersion: "6.0",
          platformName: "Android"
        },
        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Android GoogleAPI Emulator",
          deviceOrientation: "portrait",
          browserName: "Browser",
          platformVersion: "5.1",
          platformName: "Android"
        },
        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Android GoogleAPI Emulator",
          deviceOrientation: "portrait",
          browserName: "Browser",
          platformVersion: "5.0",
          platformName: "Android"
        },
        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Android GoogleAPI Emulator",
          deviceOrientation: "portrait",
          browserName: "Browser",
          platformVersion: "4.4",
          platformName: "Android"
        },
        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Samsung Galaxy S4 Emulator",
          deviceOrientation: "portrait",
          browserName: "Browser",
          platformVersion: "4.4",
          platformName: "Android"
        },
        {
          ...sharedSettings,
          appiumVersion: "1.9.1",
          deviceName: "Samsung Galaxy S6 GoogleAPI Emulator",
          deviceOrientation: "portrait",
          browserName: "Chrome",
          platformVersion: "7.1",
          platformName: "Android"
        },

        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 10",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 10",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 8.1",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 8.1",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 8",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 8",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 7",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "Windows 7",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 10",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 10",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 8.1",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 8.1",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 8",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 8",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 7",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "Windows 7",
          version: "latest-1"
        },

        {
          ...sharedSettings,
          browserName: "internet explorer",
          platform: "Windows 10",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "internet explorer",
          platform: "Windows 8.1",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "internet explorer",
          platform: "Windows 7",
          version: "latest"
        },

        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "macOS 10.13",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "macOS 10.13",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "macOS 10.12",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "macOS 10.12",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "OS X 10.11",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "chrome",
          platform: "OS X 10.11",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "macOS 10.13",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "macOS 10.13",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "macOS 10.12",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "macOS 10.12",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "OS X 10.11",
          version: "latest"
        },
        {
          ...sharedSettings,
          browserName: "firefox",
          platform: "OS X 10.11",
          version: "latest-1"
        },
        {
          ...sharedSettings,
          browserName: "safari",
          platform: "macOS 10.13",
          version: "latest"
        }
      ]
    }
  }
};

module.exports = config;
