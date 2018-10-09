# AofL JS Coding Standards, Conventions & Best-Practices

The purpose of this document is to declare a set of standards and conventions for developers using the AofL JS framework. The intention of such document is to enforce authoring code in a consistent manner. Consistency across many projects and libraries written for the framework will reduce the amount of time it takes to understand the codebase, debug and add new features.

## Prerequisites
* Environment: browser
* Transpiler: babel
  * Preset: env (use browserlist)
* Bundler: Webpack
* Linter: eslint
  * Preset: eslint-config-aofl

## Standards & Conventions
AofL JS extends Google JavaScript Style Guide which can be found [here](https://google.github.io/styleguide/jsguide.html), and [here](https://google.github.io/styleguide/cppguide.html#Formatting) (from the section titled "Formatting" to the bottom of the page). Make sure to read these documents before continuing. This document highlights important conventions and introduces a few changes to the Google JavaScript Style Guide.

The keywords **MUST**, **MUST NOT**, **SHOULD** **SHOULD NOT** in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119)

> 1. **MUST** This word, or the terms "REQUIRED" or "SHALL", mean that the
>   definition is an absolute requirement of the specification.
>1. **MUST NOT** This phrase, or the phrase "SHALL NOT", mean that the
>   definition is an absolute prohibition of the specification.
>1. **SHOULD** This word, or the adjective "RECOMMENDED", mean that there
>   may exist valid reasons in particular circumstances to ignore a
>   particular item, but the full implications must be understood and
>   carefully weighed before choosing a different course.
>1. **SHOULD NOT** This phrase, or the phrase "NOT RECOMMENDED" mean that
>   there may exist valid reasons in particular circumstances when the
>   particular behavior is acceptable or even useful, but the full
>   implications should be understood and the case carefully weighed
>   before implementing any behavior described with this label.


### Use Strict
Strict mode **MUST** be used. However, it **SHOULD** be inserted at build time.

*Use strict enforces a number of rules including exposing silent failures and implicit global variable creation as errors in the console that would have otherwise gone unnoticed.*
*Webpack automatically adds `'use strict';` at build time*


## Directory Structure
Files are name-spaced via the directory structure, not the file names. The directory structure also indicates how we create chunked bundles.

```bash
# starter-app directory structure
~project_root
├── __config # Project Config (mostly build)
│   ├── ...
│   └── webpack.common.js
├── modules # main bundle includes shared code between all routes and templates
│   ├── __config # Application level config)
│   ├── app
│   ├── router-view-element
│   ├── link-to-element
│   ├── router-instance
│   └── index.js # entry point to the app
├── routes # routes folder
│   ├── home
│   │   ├── modules # route specific components
│   │   │   ├── home-footer-element
│   │   │   ├── home-header-element
│   │   │   └── home-page-sdo
│   │   ├── index.js
│   │   ├── template.css
│   │   └── template.js
│   └── login
│       └── ...
├── templates # templates folder
│   └── main
│       ├── css
│       ├── modules # template specific components
│       └── template.ejs
└── ... # other config files
```


### Naming Conventions
* Use descriptive names, do not use abbreviations. The choice of a variable name should be mnemonic — that is, designed to indicate to the casual observer the intent of its use. One-character variable names should be avoided except for temporary "throwaway" variables. Common names for temporary variables are i, j, k, m, and n for integers; c, d, and e for characters.
* **MUST** Use _this as the Safe Context Keyword
  * You **SHOULD** prioritize using arrow functions. *Refer to [functions section of this document](#Functions)*
  * Use `_this = this;` over `.bind(this)` if absolutly necessary


#### Directory Names
Directory names **SHOULD** be all lowercase and include dashes (-) and as a general rule append the function of the directory to the name.

e.g.
```bash
my-mixin/index.js
my-plugin/index.js
my-polyfill/index.js
home-page-sdo/index.js # State Definition Object - refer to @aofl/store documentation
```


For the following cases use the specified naming convention.

**JavaScript Modules**

Objects (append `-service` to the file name)

```javascript
// object-utils-service/index.js
const deepAssign = () => {};
export {
  deepAssign
}
```


Classes

```javascript
// router/index.js
class Router {
  ...
}
export default Router;
```


Singleton (append `-instance` to the file name)

```javascript
// store-instance/index.js
import {Store} from '@aofl/store';
const store = new Store({options});
export default store;
```


Mixins (append `-mixin` to the file name)

```javascript
// map-state-properties-mixin/index.js
const mapStatePropertiesMixin (superClass) => {
...
}

export default mapStatePropertiesMixin;
```


Components (append `-element` to the file name)

```javascript
// aofl-view-element/index.js
class AoflView extends AoflElement {

}

export default AoflView;
```


#### Casing
camelCase **MUST** be used for all identifiers except for functions with constructors(es6 class), magic constants and enumerates.


```javascript
const myVar = '';
const myFunc = () => {};
const CACHE_NAMESPACE = 'resource_enumerate';
const serverEnvironments = {
  DEVELOPMENT: 1,
  STAGE_SERVER: 2,
  PRODUCTION: 3
}

class MyClass {
  ...
}
```


## Comments

*For documentation standards refer to <a href="/#/housekeeping/documentation-standards">Documentation Standards</a>*

* Slashes **MUST** be used for both single line and multi-line inline comments.
* Write comments that explain higher-level mechanisms and business rules or clarify difficult segments of your code.
* If a comment is no longer accurate due to refactor or change in logic, update it.

**Note: DocBlocks are parsed by documentation generators and SHOULD be reserved for this purpose only. Using slashes for comments, whether single or multi-line, would ensure separation of concerns between API documentation and code level comments.**

## Formatting
* **MUST** use UNIX-style newline (\n) and a newline character as the last character of a file. Never use Windows-style (\r\n).
* **MUST** place `else`, `while` and `catch` on the same line as closing brackets.
* Spaces **MUST** be used between infix operators


```javascript
// Discouraged
const a=b+c;

// Preferred
const a = b + c;
```


* Spaces **MUST not** be used after the leading `{` or `[` and before the closing `}` or `]` in a single line array or object literal. Spaces **MUST** not be used before `:` and 1 space **MUST** be used after `:` in object literal notation.

```javascript
const arr = [1, 2];
const obj = {a: 1};
```


* 1 space **MUST** be placed before an opening `(` except for function declaration


```javascript
// Discouraged
if(condition) {
  ...
}
const myFunc = function name () {
  ...
};

// Preferred
if (condition) {
  ...
}
const myFunc = function name() {

};
```

* 1 space **MUST** be used a leading brace `{`


```javascript
// Discouraged
if (condition){
  ...
}
// Preferred
if (conditon) {
  ...
}
```


* **MUST** use a line break when method chaining. It is not necessary to indent method calls unless the result is assigned to a variable


```javascript
// Discouraged
promise.then((...) => {
  ...
  }).catch((...) => {
    ...
  });

promise.then((...) => {
  ...
  })
  .catch((...) => {
    ...
  });

const res = promise
.then((...) => {
  ...
})
.catch((...) => {
  ...
});

// Preferred
promise
.then((...) => {
  ...
})
.catch((...) => {
  ...
});

const res = promise
  .then((...) => {
    ...
  })
  .catch((...) => {
    ...
  });
```

* When defining generators spaces **MUST NOT** be used between `function` keyword and `*` and 1 space **MUST** be used between `*` and generator name.

```javascript
// Discouraged
function *gen() {
  ...
}

// Preferred
function* gen() {
  ...
}
```

* When defining generators as properties of an object spaces **MUST Not** be used between `*` and generator name.

```javascript
// Discouraged
const gens = {
  * gen() {
    ...
  }
};

// Preferred
const gens = {
  *gen() {
    ...
  }
};
```







## Conditionals
* Use of ternary evaluations is discouraged. If you must use them, they are only allowed in "simple" 1 liners. Nesting ternaries is not allowed.
* Always use the === or !== operator. The triple equality operator checks type and value. Read the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) on Comparison operators

```javascript
3 === 3   // true
3 === '3' // false
3 == '3' // true
```

* Use descriptive names for conditions and Regexes

```javascript
// regex
// Preferred
const submoduleLineRegex = /\^(.*)\[submodule/;
const newSubmoduleLine = line.match(submoduleLineRegex);
if (newSubmoduleLine) {
  ...
}

// Discouraged
if (line.match(/\^(.*)[submodule/)) {
  ...
}
```



```javascript
// conditional
// Preferred
var withinVisibleArea = (pos.left <= window.X && pos.left + offsetWidth > window.X) || (pos.left >= window.x && pos.left <= window.x + window.width)) && ((pos.top <= window.y && pos.top + offsetHeight > window.y) || (pos.top  >= window. && pos.top  <= window.y + window.height));

if (withinVisibleArea) {
  ...
}

// Discouraged
if((pos.left <= window.X && pos.left + offsetWidth > window.X) || (pos.left >= window.x && pos.left <= window.x + window.width)) && ((pos.top <= window.y && pos.top + offsetHeight > window.y) || (pos.top  >= window. && pos.top  <= window.y + window.height))) {
  ...
}
```

* Use `typeof variable === 'undefined` Checking existence of objects/variables:

```javascript
if (typeof object !== 'undefined') {
  ...
}
if (typeof object.key !== 'undefined') {
  ...
}
```


## Global Variables
* Only library exports should be created as global variables (*[See webpack config](https://webpack.js.org/configuration/output/#output-library)*). These variables should be treated as read-only and must not be modified in the consuming code.
* Except in extreme cases, there should be NO reason to use global variables in your code. These are problematic and there is no way to guarantee that they will not be clobbered by another variable of the same name located in another script. Avoid these at all costs.

## Local Variables
* Use `const` when possible. Use `let` if it's absolutely necessary
* Never use `var`
* One variable declaration per line
* Variables should be declared at the top of the function body

## Objects/Arrays
* Object and Arrays **MUST** be created using respective literal syntax.

```javascript
// Discouraged
const obj = new Object();
conts arr = new Array();

// Preferred
const obj = {};
const arr = [];
```

* **MUST** skip trailing commas
* **SHOULD** quote all keys or none of them when possible. Keep it consistent
* **SHOULD** put short declarations on a single line.
* Object literal keys **MUST** be `camelCased` with the exception of data obtained from external sources (3rd party library, api calls, ...)

## Functions
* **SHOULD** prefer arrow  functions (`() => {}`) over anonymous functions
* Parentheses **MUST** be used for arrow function parameters, even if there is only 1 parameter.
* Functions **SHOULD** be defined using Function Expressions, i.e. the function is assigned to a variable as a left hand assignment.

```javascript
const eventHandler = (e) => {
  ...
};
```

* **SHOULD** keep your functions short. A good function fits on a slide that the people in the last row of a big room can comfortably read. So don't count on them having perfect vision and limit yourself to ~15 statement per function.
* **SHOULD** avoid deep nesting of conditionals/loops. Return early from functions and make sure functions do specific operations. Try to avoid nesting more than 3 levels deep.
* **MUST NOT** use Anonymous functions for callbacks. Always use named functions for callbacks to produce identifiers in the stack trace for easier debugging.
* **MUST** name your closures - they will produce stack traces, heap and CPU profiles and you'll know what it does by the name.





## Misc
* Never use `Object.freeze`, `Object.preventExtensions`, `Object.seal` in production code
* Getters and Setters - Do not use setters. Feel free to use getters that are free from [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science)), like providing a length property for a collection class.
* Always choose built-in functions over ones provided by a utility library ([Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) vs [lodash](https://lodash.com/).)
* No `console.*` & `debugger` should be present in production code
* No empty blocks are allowed with the exception of catch statements

## .eslintrc
```javascript
const config = {
  extends: 'eslint-config-google',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    exmaFeatures: {
      experimentalObjectRestSpread: true
    },
    env: {
      es6: true
    }
  },
  rules: {
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', {
      code: 120,
      tabWidth: 2,
      ignoreComments: true,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }],
    'space-in-parens': ['error', 'never']
  }
};

module.exports = config;
```

