# @aofl/unit-testing-plugin

Aofl unit testing plugin makes it easy to setup [web-components-tester](https://www.npmjs.com/package/web-component-tester) with webpack configured with babel. It allows you to run webpack in watch mode and run your unit-tests run on each update. It also adds some additional functionality like auto-loading [fetch-mock](https://www.npmjs.com/package/fetch-mock).


## Installation
```bash
npm i -D @aofl/unit-testing-plugin
```

If you plan on generating coverage report `babel-plugin-istanbul` is needed to instrument transpiled code.

## Usage
```javascript
const UnitTesting = require('@aofl/unit-testing-plugin');

module.export = {
  ...
  plugins: [
    new UnitTesting({
      exclude: [
        '**/node_modules',
      ],
      scripts: [
        'runtime',
        'init-polyfill-service',
        'custom-elements-es5-adapter'
      ]
    })
  ]
}
```

For coverage report...
```javascript
// .babelrc
{
  "presets": [
    "@babel/preset-env"
  ],
  'env': {
    'test': {
      'plugins': [
        [
          'istanbul',
          {
            'include': [
              '**/*.js'
            ],
            'exclude': [
              '**/node_modules/*',
              '**/*.spec.*',
              '**/__build_tests/*'
            ]
          }
        ]
      ]
    }
  }
}
```
and run webpack `cross-env NODE_ENV=test webpack`

You will also need a `.wctrc.json` or `wct-conf.json` as explained in web-components-tester documentation.

```javascript
// sample .wctrc.json
{
  "verbose": true,
  "persistent": false,
  "clientOptions": {
    "environmentImports": []
  },
  "plugins": {
    "local": {
      "browsers": [
        "chrome"
      ],
      "browserOptions": {
        "chrome": [
          "headless"
        ]
      }
    }
  }
}
```


## Options
### include
Takes a glob pattern to include files for the coverage report.

defaults to **/*.js

### exclude
Takes an array of glob patterns to exclude files from the coverage report.

default ['**/node_modules/**'],


### output
Path to target directory to place transpiled test files.

defaults to '__build_tests'

### config
Path to web-components-tester config file.

defaults to '.wtcrc.json' or 'wtc-conf.json'

### clean
keep or delete the output folder after tests finish

defaults to true

### scripts
Array of webpack chunks you want to include in test suites. E.g. webcomponents-loader, custom-elements-es5-adapter

defaults to []
