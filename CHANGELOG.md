# Changelog - AofL JS
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## unreleased
### [Added]
- @aofl/cli - source will remove the added submodule if an error occurs.
- @aofl/templating-plugin - added support for @linkTag
- @aofl/cli - build command
- @aofl/cli - test command
- @aofl/cli - serve command
- @aofl/cli - source --list option added
- @aofl/templating-plugin - eslint-disable routes-config-loader
- @aofl/webcomponent-css-loader - added cache option
- @aofl/webcomponent-css-loader - added whitelist option
- @aofl/store - auto generates setter mutations based on init() mutation
- @aofl/dom-scope - added README.md
- @aofl/dom-scope - added cache option
- @aofl/dom-scope - added schema utils validation
- @aofl/i18n-loader - added cache option
- @aofl/i18n-auto-id-loader - added cache option
- @aofl/component-utils - traverseParents() takes a callback function and traverses ancestors of the provided node.
- @aofl/component-utils - findParentByAttribute() utilizes traverseParents and looks for a specific parent containing a set of attributes.
- eslint-config-aofl
- @aofl/router - Added an additional parameter "meta" to `router.navigate()` method that gets added to the request object.
- @aofl/cli - upgrade command

### [Changed]
- Updated LitElement to 2.0.1
- Updated lit-html to 1.0.0
- Replaced babel-instrumenter-loader with babel-plugin-istanbul.
- @aofl/router - match-route-middleware caches the response after matching the route instead of the route.
- @aofl/web-components/aofl-element export an object containing AoflElement and all lit-element exports
- Updated all references to AoflElement to reflect updated module export

### [Deprecated]
### [Removed]
### [Fixed]
- Fixed bugs introduced by refactoring and linting
- @aofl/router - fixed request from link
- @aofl/web-components/aofl-img - Delay checkInViewport by a microtask to fix issue with images not loading when aofl-img is a child of another custom component.
- @aofl/cache-manager - getCollection updates storedKeys before returning the collection in case it changed within the context of another document.
- @aofl/cli - Npm.installDependency force option fixed.
- @aofl/templating - fixed issue with meta tags getting injected into body due to invalid aoflTemplate string in head. The plugin will accept template replace keys wrapped in template tags.

### [Security]

---
## [1.4.2] - 2019-01-08

### [Added]
- webpack-packages/webcomponent-css-loader - Set cacheable to false

### [Changed]
- webpack-packages/templating-plugin - Changed str.replace algorithm when prerendering to deal with large strings.

### [Deprecated]
### [Removed]
### [Fixed]
- webpack-packages/unit-testing - fixed issue with istanbul coverage not working

### [Security]

---

## [1.4.1] - 2019-01-07

### [Added]
- lerna setup
- pr template
- aofl-js-packages/resource-enumerate - added a new property ready that is a promise that resolves when init() is done fetching config files. get() awaits this promise.

### [Changed]
- issue template
- cli-tools/cli - generate c changed context to ctx in template.js

### [Deprecated]
### [Removed]
### [Fixed]
- cli-tools/cli fixed `aofl init new/directory`
- Add chrome and firefox addons in travis config for pull requests coming from forked repos

### [Security]

----

## [1.4.0] - 2018-12-27

### [Added]
- webpack-packages/html-webpack-purify-internal-css-plugin added
- webpack-packages/webcomponent-css-loader
  - added force option

### [Changed]
- Updated @polymer/lit-element to 0.6.5
- Updated lit-html to 1.0.0-rc.1
- Updated web-components-tester to 6.9.2
- Changelog.md follows keep a changlog guidelines
- Updated eslint rules to be more lenient
- lint cli and webpack-packages
- fixed typo in documentation
- aofljs-packages
  - store
    - Push store instances to window.aoflDevtools.storeInstances, when window.aoflDevtools exists or the app runs in development mode, instead of exposing a global variable window.storeInstance.

### [Deprecated]

### [Removed]

### [Fixed]
- cli
  - Fixed issue with child_process.spawn on windows by using cross-spawn. (https://stackoverflow.com/questions/37459717/error-spawn-enoent-on-windows) #11 #12
  - init project ignores .git directory

### [Security]

---

## [1.3.0] - 2018-12-06

### [Added]
- ci pipeline setup
- aofljs-packages/aofl-multiselect-list
- aofljs-packages/aofl-list-option
  - added keyboard interactions
- aofljs-packages/aofl-select-list
    - added keyboard interactions

### [Changed]
- switched to travis
- updated README.md
- upgrade to lit-element@0.6.4
- upgrade to lit-html@0.14.0
- moved issue-templates to .github
- webpack-packages/unit-testing-plugin
    - upgraded web-component-tester to 6.9.0
- aofljs-packages/aofl-list-option
  - updated to be compatible with aofl-multiselect-list
  - changed string attributes to boolean
- aofl-js-packages/router
  - update url state is triggered after all 'after' middleware callbacks run successfully
- cli
  - renamed all bin files to aofl-\*
  - generate component adds "-element" if the component name doesn't include a (-)
- aofljs-packages/aofl-select-list
  - changed string attributes to boolean

### [Deprecated]

### [Removed]
- node container to run automation
- jenkins file added

### [Fixed]
### [Security]

---

## [1.2.3] - 2018-11-20

### [Added]

### [Changed]
- cli
  - renamed all bin files to aofl-cli-\*

### [Deprecated]

### [Removed]

### [Fixed]
- Build tools compatible with Windows & Ubuntu
- cli
  - fixed temp directory path
- webpack-packages/templating-plugin
    - path.sep fixes to be windows & Ubuntu compatible
- webpack-packages/webcomponents-css-loader
    - path.sep fixes to be windows & Ubuntu compatible

### [Security]

---

## [1.2.1] - 2018-11-18

### [Added]
- gh-pages docs created
- webpack-packages/unit-testing-plugin
  - accepts .wtcrc.js file
- aofl-js-packages/map-state-properties-mixin
  - calls mapStateProperties function on connectedCallback automatically

### [Changed]
- decreased SauceLabs browsers to 10

### [Deprecated]

### [Removed]

### [Fixed]
- webpack-packages/i18n-loader
  - Set cacheable to false

### [Security]

---

## [1.2.0] - 2018-11-06

### [Added]
- Added CODE_OF_CONDUCT.md
- 100% coverage
- node container to run automation
- jenkins file added
- cli-tools/cli
  - Added icons template
- webpack-packages/webcomponent-css-loader
  - Add @import paths the modules dependencies.
  - skip pruning on dev
- webpack-packages/templating-plugin
  - added support for variable webpackConfig.output.publicPath
  - Skip index.js files that do not contain a valid route doc block

### [Changed]
- Updated node packages
- Adjusted eslint config for indentation
- Moved babel config out of webpack config
- Updated saucelabs config
- cli-tools/cli
  - Updated generate component to match v1.1.0 standards
- aofl-js-packages
  - Replaced babel-plugin-istanbul with istanbul-instrumenter-loader
  - SauceLabs webpack config does not instrument and .wctrc-ls.json does not include istunbul plugin.
  - Moved wct-istunbul plugin config to .wctrc.json
- webpack-packages/unit-testing-plugin
  - Replaced web-components-tester-istanbul with wct-instanbul
  - Bundle all tests into 1 suite
- webpack-packages/templating-plugin
  - complete refactor
  - added getTestContainer()

### [Deprecated]

### [Removed]
- RegisterCallback
  - Removed error functions. Next expect an error object or null as the first argument.
- webpack-packages/unit-testing-plugin
  - removed istanbul plugin from default list
  - moved coverage report assignment to WCT to the top of the test file to fix fatal WCT error when a tests throws a fatal error.
- webpack-packages/webcomponent-css-loader
  - removed logs

### [Fixed]
- Fixed linting issues
- web-components/aofl-drawer
  - refactored and added transition-count attribute. Instead of trying to detect multiple transitions.
- webpack-packages/webcomponent-css-loader
  - Fixed hard crashes
- webpack-packages/templating-plugin
  - Fixed double build issue
  - Fixed issue with new routes or changes to route docBlock required 2 builds

### [Security]

---

## [1.1.0] - 2018-10-17

### [Added]
- aofl-js-packages
  - ready for saucelabs integration
- aofl-js-packages/polyfill-service
  - config object accepts a {test, load} object to do custom checking
- aofl-js-packages/i18n-mixin
  - Support for multi plural sentences
- aofl-js-packages/router
  - Router holds reference to matchedRoute
- webpack-packages/i18n-auto-id-loader
- webpack-packages/webcomponent-css-loader
- webpack-packages/templating-plugin
  - added support for baseurl and webpack output dir
- aofl-js-packages/rotations
  - Adds several more unit tests covering all methods, w/minor refactoring

### [Changed]
- aofl-js-packages
  - upgraded lit-element to 0.6.2
  - moved tests to root of each module
  - transferred documentation examples to stackblitz and removed documentation projects
  - Updated jsdoc comments and new jsdoc theme
- aofl-js-packages/i18n-mixin
  - Refactored to cover all requirements from the translators
- aofl-js-packages/rotations
  - Allows qualify functions to return primitive values or promises, adds unit test for qualify order
- webpack-packages/i18n-loader
  - Refactored to work with the updated system
- cli/cli-tools
  - Refactored i18n. Now uses lexical analysis to find translation strings

### [Deprecated]

### [Removed]
- aofl-js-packages/resource-enumerate
  - Config object no longer supports local/stageRegex. Instead environment is passed to constructor.

### [Fixed]
- aofl-js-packages
  - fix and updated unit tests for all browsers
- aofl-js-packages/rotations
  - Fixes bug causing erratic weighted rotations
- webpack-packages/templating-plugin
  - Fixed prod builds

### [Security]


---

## [1.0.0-beta.28] - 2018-09-27

### [Added]
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
- cli
  - readme.md
  - license

### [Changed]
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

### [Deprecated]

### [Removed]
- parent-dep-mixin
- cli/sw

### [Fixed]
- cli
  - dom-scope
    - fixed pattern bug
- api-request
  - getCacheManager() fix issue with returning new cacheManager
  - changed cache argument to fromCache.
  - Replaced static class property with a static getter.
- router
  - Fixes reject case in navigate method
  - router.navigate resolve after redirects
- unit-testing-plugin
  - run initial unit test once when watch mode enabled
  - clean coverage report between runs

### [Security]


---

## [1.0.0-beta.27] - 2018-09-11

### [Added]
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
  - added and refactored webcomponents-loader for dynamic import
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

### [Changed]

### [Deprecated]

### [Removed]

### [Fixed]
- cache-manager
  - fixed issue with expired keys
  - fixed issues with json.parse when storage is not memoryStorage
- register-callback
  - unsubscribe can only be called once
  - check index exists in removeCb
- router
  - Fixes typo for removing popState listener

### [Security]

---

## [1.0.0-beta.26] - 2018-8-27

### [Added]
- License and github repo
- Store
  - commit takes variadic arguments

### [Changed]

### [Deprecated]

### [Removed]

### [Fixed]

### [Security]

---

## [1.0.0-beta.25] - 2018-08-23

### [Added]
- cli
  - added aofl init command

### [Changed]
### [Deprecated]
### [Removed]
### [Fixed]
- aofl-list-option
  - changed selected from boolean to string
  - fixed checking selected attribute value to match selected|selected=true|selected=false
### [Security]


---

## [1.0.0-beta.24] - 2018-08-22

### [Added]
- cli
  - added -f to npm commands

### [Changed]
- unit-testing-plugin
  - refactor unit-testing (removed childcompiler)

### [Deprecated]

### [Removed]
- templating-plugin
  - removed child compiler from templating plugin
- unit-testing-plugin
  - removed hard coded browser options

### [Fixed]
- rotation
  - compatibility with unit-testing
- AoflElement
  - fixed css rendering for firefox

### [Security]


---

## [1.0.0-beta.23] - 2018-08-16

### [Added]

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

### [Fixed]

- unit-testing-plugin
  - replaces istanbul plugin with wct-istanbul

---

## [1.0.0-beta.22] - 2018-08-10

### [Added]
- cli added sw command
- rotations
- templating plugin
  - added locale, meta and refactored router doc block parser
- polyfill-service
  - added object-assign-polyfill
- unit-testing-plugin
- i18n-mixin
- i18n-loader
- map-state-properties-mixin
- cli
  - Adds i18n cli for pot generation
### [Changed]
- cache-manager
  - renamed MemoryStorage.length to size due to Function.length not being configurable on all browsers
### [Deprecated]
### [Removed]
### [Fixed]
- cli
  - fixed conclude and renamed aofl-source.json to aofl.json
### [Security]

---


[1.4.1]:https://github.com/AgeOfLearning/aofl/compare/v1.4.1...1.4.2
[1.4.1]:https://github.com/AgeOfLearning/aofl/compare/v1.4.0...1.4.1
[1.4.0]:https://github.com/AgeOfLearning/aofl/compare/v1.3.0...1.4.0
[1.3.0]:https://github.com/AgeOfLearning/aofl/compare/v1.2.3...v1.3.0
[1.2.3]:https://github.com/AgeOfLearning/aofl/compare/v1.2.1...v1.2.3
[1.2.1]:https://github.com/AgeOfLearning/aofl/compare/v1.2.0...v1.2.1
[1.2.0]:https://github.com/AgeOfLearning/aofl/compare/v1.1.0...v1.2.0
[1.1.0]:https://github.com/AgeOfLearning/aofl/compare/v1.0.0-beta.28...v1.1.0
[1.0.0-beta.28]:https://github.com/AgeOfLearning/aofl/compare/v1.0.0-beta.27...v1.0.0-beta.28
[1.0.0-beta.27]:https://github.com/AgeOfLearning/aofl/compare/v1.0.0-beta.26...v1.0.0-beta.27
[1.0.0-beta.26]:https://github.com/AgeOfLearning/aofl/compare/v1.0.0-beta.25...v1.0.0-beta.26
[1.0.0-beta.25]:https://github.com/AgeOfLearning/aofl/compare/v1.0.0-beta.24...v1.0.0-beta.25
[1.0.0-beta.24]:https://github.com/AgeOfLearning/aofl/compare/v1.0.0-beta.23...v1.0.0-beta.24
[1.0.0-beta.23]:https://github.com/AgeOfLearning/aofl/compare/v1.0.0-beta.22...v1.0.0-beta.23
[1.0.0-beta.22]:https://github.com/AgeOfLearning/aofl/compare/c5321f0...v1.0.0-beta.22
