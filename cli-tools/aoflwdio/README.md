# @aofl/wdio
@aofl/wdio is an end to end testing framework that serves as a wrapper for WebDriverIO's test framework. Our package is application agnostic, but additional commands for interacting and testing Web Components have been added to reflect the bulk of testing we do here. Setup is easy and you can start writing tests for your application within minutes of installing this package.

## Installation
1) Run the following command in your application.
```bash
npm i -D @aofl/wdio
```
2) {Placeholder for running the aoflwdio init command}
3) In the `.aoflwdio.js` file created by the `aoflwdio init` command, setup your applications config options
   - This file serves as your configuration file for defining your test runner options. 
   - Configurations such as device capabilities, logging, and others are defined in this file
   - Refer to https://webdriver.io/docs/options.html for a breakdown of options for this file.
4) Your all set! Start writing your tests!

## Usage
Once your `.aoflwdio.js` has been updated with your applications config options, and your test specs have been written, simply run:
```bash
aoflwdio run-test
```

## Help
You can use the help command at program level and at command level.
### program level
`$ aoflwdio --help`
```bash
#  Usage: aoflwdio [options]
#
#  Options:
#
#    -V, --version          output the version number
#    -h, --help             output usage information
#
#  Commands:
#
#    init                Initializes an aoflwdio project
#    run-test <options>  Download an npm module into your project
#    help [cmd]          Display help for [cmd]
#
#  Examples:
#
#    aoflwdio --help
#    aoflwdio run-test

```
### Command level
`$ aoflwdio help g`
```bash
#  Usage: aoflwdio run-test [options]
#
#  Options:
#
#    -h, --help             output usage information
#    -w, --watch            Watches for filesystem changes
#    --suite [suiteName]    Run specific test suites
#    --spec [path]          Run specific test spec files
#    --debug                Sets logging to verbose globally
#    --config [path]        Specify the path to the config file.
#
#  Examples:
#
#    aoflwdio help
#    aoflwdio run-test --suite login
#    aoflwdio run-test
```

## Addtional Information
WebDriver.io has a great ecosystem of plug-ins and services that extend the functionality of the WebDriver.io test runner. For our purposes, we provide support for only a subset of those services. The following services are supported by `@aofl/wdio`:

##### [Appium Service](https://webdriver.io/docs/appium-service.html) (Tentative)
##### [Selenium Service](https://webdriver.io/docs/selenium-standalone-service.html)
##### [Intercept Service](https://webdriver.io/docs/wdio-intercept-service.html)
##### [Applitools Service](https://webdriver.io/docs/applitools-service.html) (Tentative)
##### [Crossbrowsertesting Service](https://webdriver.io/docs/crossbrowsertesting-service.html) (Tentative)
##### [Browserstack Service](https://webdriver.io/docs/browserstack-service.html) (Tentative)
##### [Sauce Service](https://webdriver.io/docs/sauce-service.html) (Tentative)


### WebDriver's Documentation

##### [WebDriver.io Guide](https://webdriver.io/docs/gettingstarted.html)
##### [WebDriver.io API Documentation](https://webdriver.io/docs/api.html)
