# @aofl/unit-testing-plugin

Aofl unit testing plugin uses [WebdriverIO](https://webdriver.io/) to run unit tests in the browser.

*Note: for automated browser testing refer to @aofl/wdio*


## Installation
```bash
npm i -D @aofl/unit-testing-plugin
```

If you plan on generating coverage report `babel-plugin-istanbul` is needed to instrument transpiled code. We recommend using [babel-plugin-istanbul](https://www.npmjs.com/package/babel-plugin-istanbul)

## Usage
```javascript
const UnitTesting = require('@aofl/unit-testing-plugin');

module.export = {
  entry: {
    'custom-elements-es5-adapter': 'path/to/custom-e...',
    'init-polyfill-service': 'path/to/...'
  }.
  plugins: [
    new UnitTesting({
      root: process.cwd(), // project root
      output: '__build_tests',  // output directory of compiled test files.
      host: 'localhost',
      port: 3035,
      config: path.join(root, '.wct.config.js'),
      debug: false,
      nycArgs: [ // cli arguments passed to nyc to generate coverage report
        'report',
        '--reporter=lcov',
        '--reporter=text-summary',
        '--report-dir=./logs/coverage'
      ]
    })
  ]
}
```


## WebdriverIO Configuration
For ease of use @aofl/unit-testing comes preconfigured with common WebdriverIO recipes. You can provide your own file based on https://webdriver.io/docs/configurationfile.html. However, in most cases you should only need to configure the capabilities field.


### Local

```js
// .wct.config.js
module.exports.config = {
  capabilities: [
    {
      "maxInstances": 5,
      "browserName": 'chrome',
      'goog:chromeOptions': {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        args: ['--headless', '--disable-gpu'],
      }
    },
    {
      "maxInstances": 5,
      "browserName": 'firefox',
      'moz:firefoxOptions': {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: ['-headless']
      },
    },
    // {
    //   "maxInstances": 10,
    //   "browserName": 'safari'
    // }
  ]
};
```

### SauceLabs
Set `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` as environment variables.

```js
// .wct-sauce.config.js
const sharedSettings = {
  recordLogs: true,
  recordVideo: true,
  recordScreenshots: false,
  timeout: 300,
  idleTimeout: 1000,
  commandTimeout: 600,
  webdriverRemoteQuietExceptions: false,
  videoUploadOnPass: false,
  tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || null // if using travis refer to https://docs.travis-ci.com/user/sauce-connect/
};

const config = {
  preset: 'sauce',
  specFileRetries: 1,
  sauceConnect: true,
  capabilities: [
    {
      ...sharedSettings,
      "browserName": "Safari",
      "appiumVersion": "1.15.0",
      "deviceName": "iPhone X Simulator",
      "platformVersion": "13.0",
      "platformName": "iOS"
    },
    ...
  ]
};
```