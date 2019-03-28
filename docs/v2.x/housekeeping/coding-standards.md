# AofL JS Coding Standards, Conventions & Best-Practices

The purpose of this document is to declare a set of standards and conventions for developers using the AofL JS framework. The intention of such document is to enforce authoring code in a consistent manner. Consistency across many projects and libraries written for the framework will reduce the amount of time it takes to understand the codebase, debug and add new features.

## Prerequisites

- Environment: browser
- Transpiler: babel
  - Preset: env (use browserlist)
- Bundler: Webpack
- Linter: eslint
  - Preset: eslint-config-aofl

## Standards & Conventions

AofL JS extends Google JavaScript Style Guide which can be found [here](https://google.github.io/styleguide/jsguide.html), and [here](https://google.github.io/styleguide/cppguide.html#Formatting) (from the section titled "Formatting" to the bottom of the page). Make sure to read these documents before continuing. This document highlights important conventions and introduces a few changes to the Google JavaScript Style Guide.

## eslint Config
AofL JS comes configured with [`eslint-config-aofl`](https://github.com/AgeOfLearning/eslint-config-aofl).
