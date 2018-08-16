# aofl-os changelog

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
