# Changelog - AofL JS
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## unreleased

### [Added]
- Much faster dev builds
- @aofl/cli - serve added reporter option
- @aofl/cli - made webpack mode available in .ejs context
- @aofl/cli - server supports hot and hot only options
- @aofl/cli - generate -  Added i18n template
- @aofl/cli - added cache-loader to webpack config
- @aofl/cli-lib - webpack config support stand-alone and project modes
- @aofl/cli-lib - webpack config allows replace and append for include, exclude objects
- @aofl/cli-lib - git - added archive
- @aofl/cli-lib - git - added getNameFromUrl
- @aofl/i18n - extracted core i18n functionality from the mixin
- @aofl/i18n-mixin - added support for aoflDevtools.showI18nIds to display tt-tags over strings.
- @aofl/web-components/aofl-element - added property decorator to support binding to store when declaring class properties
- @aofl/hmr-loader
- @aofl/web-components/aofl-element - store and state options to properties decorator
- @aofl/templating-plugin - routes-config-loader supports hmr
- @aofl/store - added purge
- @aofl/api-request - added purge
- @aofl/store - store v3
- @aofl/api-request - added support for different expire times for each cache namespace
- @aofl/element - as a standalone package
- @aofl/picture - as a standalone package
- @aofl/select - as a standalone package
- @aofl/drawer - as a standalone package
- all packages ship with built file
- upgrade config for v3.0.0

### [Changed]
- @aofl/cli - webpack config will not generate sourcemaps in dev by default
- @aofl/cli - webpack config replace imagemin-mozjpeg with imagemin-jpegtran
- @aofl/cli - webpack config updated to reflect webcomponent-css-loader options
- replaced purifyCss with purgeCss
- @aofl/middleware - use() returns unsubscribe function
- @aofl/router - hooks can unsubscribe
- @aofl/webcomponent-css-loader - No longer imports global css into components and doesn't prune css in dev
- @aofl/web-components - all components check customElements registry before calling define. This is done so hmr doesn't throw already defined error
- @aofl/cli - updated babel config
- @aofl/cli - a bunch of webpack optimization
- @aofl/unit-testing-plugin - major rewrite and optimization
- @aofl/cli - test command updated to work with new unit-testing-plugin
- @aofl/store - Store move to modules/legacy
- @aofl/form-validate - form.observed is set to true when any property is observed

### [Deprecated]
- @aofl/store/legacy
- @aofl/web-components

### [Removed]
- style-loader
- postcss
- cssnano
- autoprefixer
- @aofl/cli - .aofl.js config - removed cssLoader and postCssLoader config
- @aofl/cli - hard-source-webpack-plugin
- @aofl/cli - friendly-errors-webpack-plugin

### [Fixed]
- @aofl/cli - build/server/test will exit with error when .aofl.js config contains errors instead of falling back on the default configs
- @aofl/cli - i18n ignores _r & _c keys when validating the manifest
- @aofl/cli - excluded @webcomponents from webpack config ignore
- @aofl/router - fixed matching dynamic routes without trailing slash
- @aofl/web-components/aofl-select-list - Prevent dispatching change event while initializing
- @aofl/cli - i18n PathHelper reference typo
- possible variable overrides

### [Security]

---
## [2.0.8] - 2019-07-09
### [Added]
### [Changed]
### [Deprecated]
### [Removed]
### [Fixed]
- @aofl/cli - i18n enabled tolerant config for esprima
### [Security]

---
## [2.0.7] - 2019-06-27
### [Added]
### [Changed]
### [Deprecated]
### [Removed]
### [Fixed]
- @aofl/cli - build and test stopping when compiling with warnings
### [Security]

---
## [2.0.6] - 2019-06-20
### [Added]
### [Changed]
### [Deprecated]
### [Removed]
### [Fixed]
- @aofl/cli - replaced export with module.exports
### [Security]

---
## [2.0.5] - 2019-06-20
### [Added]
- @aofl/cli - debug reporter

### [Changed]
### [Deprecated]
### [Removed]
### [Fixed]
- @aofl/cli - exits with error code when compiler reports an error
### [Security]

---
## [2.0.4] - 2019-06-18
### [Added]
- @aofl/cli - reporter option for build and test

### [Changed]
- @aofl/templating-plugin - updated puppeteer and added --no-sandbox

### [Deprecated]
### [Removed]
### [Fixed]
- @aofl/cli - Serve only opens 2 browser tab

### [Security]
---

## [2.0.3] - 2019-06-12
### [Added]
### [Changed]
### [Deprecated]
### [Removed]
### [Fixed]
- @aofl/rotations - updated rotation logic so that pages with the same qualifying ID get the same version
### [Security]

---
## [2.0.2] - 2019-05-22
### [Added]
### [Changed]
- @aofl/cli - test command will set webpack mode to production when NODE_ENV is test

### [Deprecated]
### [Removed]
### [Fixed]
### [Security]

----
## [2.0.1] - 2019-05-20
### [Added]
### [Changed]
### [Deprecated]
### [Removed]
### [Fixed]
- @aofl/webcomponents/aofl-drawer - fixed issue with child elements transitions causing drawer to flicker
### [Security]

---
## [2.0.0] - 2019-04-30
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
- @aofl/webcomponents/aofl-element - export render from lit-html
- @aofl/templating-plugin - added prerender options
- docsify for v2
- benchmark results

### [Changed]
- Updated lit-element to 2.1.0
- Updated lit-html to 1.0.0
- Replaced babel-instrumenter-loader with babel-plugin-istanbul.
- @aofl/router - match-route-middleware caches the response after matching the route instead of the route.
- @aofl/web-components/aofl-element export an object containing AoflElement and all lit-element exports
- @aofl/web-components/aofl-element uses css`` to render styles
- Updated all references to AoflElement to reflect updated module export
- babel settings
- @aofl/cli - generate component template updated to use decorators

### [Deprecated]
### [Removed]
- @aofl/templating-plugin - prerenderTimeout

### [Fixed]
- Fixed bugs introduced by refactoring and linting
- @aofl/router - fixed request from link
- @aofl/web-components/aofl-img - Delay checkInViewport by a microtask to fix issue with images not loading when aofl-img is a child of another custom component.
- @aofl/cache-manager - getCollection updates storedKeys before returning the collection in case it changed within the context of another document.
- @aofl/cache-manager - limit expire to max 32bit signed integer
- @aofl/cli - Npm.installDependency force option fixed.
- @aofl/templating - fixed issue with meta tags getting injected into body due to invalid aoflTemplate string in head. The plugin will accept template replace keys wrapped in template tags.
- @aofl/rotations - changed window.aofljsConfig.__prerender__ reference
- @aofl/cli/build - uses watchOptions in webpack config

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
- @aofl/rotations
  - Complete refactor

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


[2.0.8]:https://github.com/AgeOfLearning/aofl/compare/v2.0.7...v2.0.8
[2.0.7]:https://github.com/AgeOfLearning/aofl/compare/v2.0.6...v2.0.7
[2.0.6]:https://github.com/AgeOfLearning/aofl/compare/v2.0.5...v2.0.6
[2.0.5]:https://github.com/AgeOfLearning/aofl/compare/v2.0.4...v2.0.5
[2.0.4]:https://github.com/AgeOfLearning/aofl/compare/v2.0.3...v2.0.4
[2.0.3]:https://github.com/AgeOfLearning/aofl/compare/v2.0.2...v2.0.3
[2.0.2]:https://github.com/AgeOfLearning/aofl/compare/v2.0.1...v2.0.2
[2.0.1]:https://github.com/AgeOfLearning/aofl/compare/v2.0.0...v2.0.1
[2.0.0]:https://github.com/AgeOfLearning/aofl/compare/v1.4.2...v2.0.0
[1.4.2]:https://github.com/AgeOfLearning/aofl/compare/v1.4.1...v1.4.2
[1.4.1]:https://github.com/AgeOfLearning/aofl/compare/v1.4.0...v1.4.1
[1.4.0]:https://github.com/AgeOfLearning/aofl/compare/v1.3.0...v1.4.0
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
