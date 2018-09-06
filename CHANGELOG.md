# aofl-os changelog


## v1.0.0-beta.27 (date)

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

Bugfixes:
- cache-manager
  - fixed issue with expired keys
  - fixed issues with json.parse when storage is not memoryStorage
- register-callback
  - unsubscribe can only be called once
  - check index exists in removeCb

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
