const config = {
  capabilities: [
    {
      "maxInstances": 5,
      "browserName": 'chrome',
      'goog:chromeOptions': {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        args: ['--headless', '--disable-gpu', '--no-sandbox'],
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

exports.config = config
