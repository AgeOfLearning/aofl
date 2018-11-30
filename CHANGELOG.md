# aofl changelog

## unreleased

Features:

- ci pipeline setup

Bugfixes:

- cli
  - renamed all bin files to aofl-\*

---

## v1.2.3 (11-20-2018)

Features:

- Build tools compatible with Windows & Ubuntu

Bugfixes:

- cli

  - renamed all bin files to aofl-cli-\*
  - fixed temp directory path

- webpack-packages
  - templating-plugin
    - path.sep fixes to be windows & Ubuntu compatible
  - webcomponents-css-loader
    - path.sep fixes to be windows & Ubuntu compatible

---

## v1.2.1 (11-18-2018)

Features:

- gh-pages docs created
- decreased SauceLabs browsers to 10
- webpack-packages
  - unit-testing-plugin
    - accepts .wtcrc.js file
- aofl-js-packages
  - map-state-properties-mixin
    - calls mapStateProperties function on connectedCallback automatically

Bugfixes:

- webpack-packages
  - i18n-loader
    - Set cacheable to false

---

## v1.2.0 (11-06-2018)

Features:

- Updated node packages
- Adjusted eslint config for indentation
- Fixed linting issues
- Moved babel config out of webpack config
- Updated saucelabs config
- Added CODE_OF_CONDUCT.md
- 100% coverage
- node container to run automation
- jenkins file added
- cli-tools
  - cli
    - Updated generate component to match v1.1.0 standards
    - Added icons template
- aofl-js-packages
  - Replaced babel-plugin-istanbul with istanbul-instrumenter-loader
  - SauceLabs webpack config does not instrument and .wctrc-ls.json does not include istunbul plugin.
  - Moved wct-istunbul plugin config to .wctrc.json
  - web-components
    - aofl-drawer
      - refactored and added transition-count attribute. Instead of trying to detect multiple transitions.
  - RegisterCallback
    - Removed error functions. Next expect an error object or null as the first argument.
- webpack-packages
  - unit-testing-plugin
    - Replaced web-components-tester-istanbul with wct-instanbul
    - removed istanbul plugin from default list
    - Bundle all tests into 1 suite
  - templating-plugin
    - complete refactor
    - added getTestContainer()

Bugfixes:

- webpack-packages
  - webcomponent-css-loader
    - removed logs
    - Add @import paths the modules dependencies.
    - skip pruning on dev
    - Fixed hard crashes
  - templating-plugin
    - added support for variable webpackConfig.output.publicPath
    - Skip index.js files that do not contain a valid route doc block
    - Fixed double build issue
    - Fixed issue with new routes or changes to route docBlock required 2 builds
  - unit-testing-plugin
    - moved coverage report assignement to WCT to the top of the test file to fix fatal WCT error when a tests throws a fatal error.

---

## v1.1.0 (10-17-2019)

Features:

- aofl-js-packages

  - upgraded lit-element to 0.6.2
  - moved tests to root of each module
  - transfered documentation examples to stackblitz and removed documentation projects
  - Updated jsdoc comments and new jsdoc theme
  - fix and updated unit tests for all browsers
  - ready for saucelabs integration
  - resource-enumerate
    - moved tests to the root project
    - Config object no longer supports local/stageRegex. Instead environment is passed to constructor.
  - polyfill-service
    - moved tests to the root project
    - config object accepts a {test, load} object to do custom checking
  - i18n-mixin
    - Refactored to cover all requirements from the translators
    - Support for multi plural sentences
  - router
    - Router holds reference to matchedRoute
  - rotations
    - Allows qualify functions to return primitive values or promises, adds unit test for qualify order

- webpack-packages

  - templating-plugin
    - added support for baseurl and webpack output dir
  - i18n-loader
    - Refactored to work with the updated system
  - i18n-auto-id-loader
    - Added
  - webcomponent-css-loader
    - Added

- cli-tools
  - i18n
    - refactored. Now uses lexical analysis to find translation strings

Bugfixes:

- aofl-js-packages
  - rotations
    - Fixes bug causing erratic weighted rotations
    - Adds several more unit tests covering all methods, w/minor refactoring
- webpack-packages
  - templating-plugin
    - Fixed prod builds

---

## v1.0.0-beta.28 (09-27-2018)

Features:

- Refactord and seperated components
- added ISSUE_TEMPLATE.md
- api-request
  - documentation
  - unit testing
- resource-enumerate
  - documentation
  - unit testing
  - refactored to use api-request
- map-state-properties-mixin
  - documentation
  - unit testing
- router
  - improved unit testing coverage
  - navigate handles ?|# correctly
- web-components
  - aofl-element
    - documentation
    - unit testing
  - aofl-select-list
    - documentation
    - unit testing
    - extends AoflElement instead of LitElement
  - aofl-list-options
    - documentation
    - unit testing
    - extends AoflElement instead of LitElement
    - Replaced deprecated parentDepMixin with @aofl/component-utils/findParent
  - aofl-drawer
    - documentation
    - unit testing
    - extends AoflElement instead of LitElement
  - aofl-source
    - documentation
    - unit testing
    - extends AoflElement instead of LitElement
  - aofl-img
    - documentation
    - unit testing
    - extends AoflElement instead of LitElement
  - aofl-picture
    - documentation
    - unit testing
    - extends AoflElement instead of LitElement
- component-utils
  - documentation
  - unit testing
  - added is-in-viewport
  - added is-in-viewport-mixin
- parent-dep-mixin
  - removed
- cli
  - readme.md added
  - license added
  - dom-scope
    - fixed pattern bug
  - sw
    - removed
  - generate
    - changed aofl to c
    - removed lit
    - updated templates
- templating-plugin
  - README.md added
  - prerender injects \_\_prerender\_\_ before page load
  - template name is added to the routes config
- aofl-validate
  - documentation
  - unit testing
  - completely refactored
- unit-testing-plugin
  - documentation
  - default output directory changed to \_\_build_tests
  - supports .wtcrc.json and wtc-conf.json
  - adds fetch-mock to test suite automatically

Bugfixes:

- api-request
  - getCacheManager() fix issue with returning new cacheManager
  - changed cache argument to fromCache.
  - Replaced static class property with a static getter.
- router
  - Fixes reject case in navigate method
  - router.navigate resolve after redirects
- unit-testing-plugin
  - run inital unit test once when watch mode enabled
  - clean coverage report between runs

---

## v1.0.0-beta.27 (09-11-2018)

Features:

- Unit Testing
- uuid
  - documentation
  - unit testing
- object-utils
  - documentation
  - unit testing
- server-environment
  - documentation
  - unit testing
- polyfill-service
  - added and refactored webpcomponents loader for dynamic import
  - documentation
  - unit testing
  - Refactored to static class
- cache-manager
  - documentation
  - unit testing
- register-callback
  - documented
  - unit testing
- i18n-mixin
  - documentation
  - unit test
- i18n-loader
  - added README.md
- middleware
  - documentation
  - unit test
  - Updates constructor to take n string args for hook names
- rotations
  - documentation
  - unit test
- router
  - documentation
  - unit test
  - export routerInstance
- store
  - documentation
  - unit test
  - export storeInstance
  - expose storeInstance on window when debug true or aoflDevtools available
  - Support for pending status
- cli
  - added default init repo
- api-request
  - version up
- dom-scope-loader
  - version up
- form-validate
  - version up
- map-state-properties-mixin
  - version up
- parent-dep-mixin
  - version up
- resource-enumerate
  - version up
- templating-plugin
  - version up
- unit-testing-plugin
  - version up
- web-components
  - version up

Bugfixes:

- cache-manager
  - fixed issue with expired keys
  - fixed issues with json.parse when storage is not memoryStorage
- register-callback
  - unsubscribe can only be called once
  - check index exists in removeCb
- router
  - Fixes typo for removing popState listener

---

## v1.0.0-beta.26 (8-27-2018)

Features:

- License and github repo
- Store
  - commit takes variadic arguments

---

## v1.0.0-beta.25 (08-23-2018)

Features:

- cli
  - added aofl init command

Bugfix:

- aofl-list-option
  - changed selected from boolean to string
  - fixed checking selected attribute value to match selected|selected=true|selected=false

---

## v1.0.0-beta.24 (08-22-2018)

Features:

- cli
  - added -f to npm commands
- templating-plugin
  - removed child compiler from templating plugin
- unit-testing-plugin
  - removed hardcoded browser options
  - refactor unit-testing (removed childcompiler)

Bugfixes:

- rotation
  - compatiblility with unit-testing
- AoflElement
  - fixed css rendering for firefox

---

## v1.0.0-beta.23

Features:

- parent-dep-mixin
  - added
- web-components
  - aofl-element
    - added
  - aofl-select-list
    - removed _ prefix from functions
      _ aofl-list-options
    - removed findParent and moved it to a parent-dep-mixin
  - aofl-drawer
    - refactored

Bugfixes:

- unit-testing-plugin
  - replaces istanbul plugin with wct-istanbul

---

## v1.0.0-beta.22

Features:

- added sw command
- rotations
  - added
- templating plugin
  - added locale, meta and refactored router doc block parser
- polyfill-service
  - added object-assign-polyfill
- cache-manager
  - renamed MemoryStorage.length to size due to Function.length not being configurable on all browsers
- unit-testing-plugin
  - added
- i18n-mixin
  - added
- i18n-loader
  - added
- map-state-properties-mixin
  - added

Bugfixes:

- cli
  - fixed conclude and renamed aofl-source.json to aofl.json
  - Adds i18n cli for pot generation

---
