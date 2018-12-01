const npmPkg = require('./package.json');

const build = `v${npmPkg.version}`;

const config = {
  verbose: true,
  plugins: {
    sauce: {
      tunnelOptions: {
        noSslBumpDomains: 'all',
        noProxyCaching: true
      },
      browsers: [
        {
          name: 'iPhone (Xr, XsMax, Xs, X, 8+, 8, 7+, 7, SE, 6s+, 6s, 6+, 6, 5s)',
          browserName: 'Safari',
          appiumVersion: '1.9.1',
          deviceName: 'iPhone XS Simulator',
          deviceOrientation: 'portrait',
          platformVersion: '12.0',
          platformName: 'iOS',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'iPhone 4s',
          browserName: 'Safari',
          appiumVersion: '1.7.1',
          deviceName: 'iPhone 4s Simulator',
          deviceOrientation: 'portrait',
          platformVersion: '9.3',
          platformName: 'iOS',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'Andriod Nougat 7.1 - Chrome',
          appiumVersion: '1.9.1',
          deviceName: 'Android GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          browserName: 'Chrome',
          platformVersion: '7.1',
          platformName: 'Android',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'Andriod KitKat 4.4 - Browser',
          appiumVersion: '1.9.1',
          deviceName: 'Android GoogleAPI Emulator',
          deviceOrientation: 'portrait',
          browserName: 'Browser',
          platformVersion: '4.4',
          platformName: 'Android',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'Windows 10 - chrome',
          browserName: 'chrome',
          platform: 'Windows 10',
          version: 'latest',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'Windows 10 - firefox',
          browserName: 'firefox',
          platform: 'Windows 10',
          version: 'latest',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'Windows 10 - Edge',
          browserName: 'MicrosoftEdge',
          platform: 'Windows 10',
          version: 'latest',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'Windows 10 - ie11',
          browserName: 'internet explorer',
          platform: 'Windows 10',
          version: 'latest',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'Windows 7 - ie11',
          browserName: 'internet explorer',
          platform: 'Windows 7',
          version: 'latest',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        },
        {
          name: 'macOS High Sierra - safari',
          browserName: 'safari',
          platform: 'macOS 10.13',
          version: 'latest',
          idleTimeout: 1000,
          commandTimeout: 600,
          videoUploadOnPass: false,
          build
        }
      ]
    }
  }
};

module.exports = config;
