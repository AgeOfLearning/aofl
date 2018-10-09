# @aofl/polyfill-service

Implements a customized version of `@webcomponents/webcomponentsjs/webcomponents-loader.js` that uses dynamic imports to load polyfills. It also allows for lazy loading other polyfills based on a config file.


## How to use

### Installation
```
npm i -S @aofl/polyfill-service
```

### Config file
```javascript
// sample-config.js
export default {
  'Object.assign': () => import('@aofl/polyfill-service/src/object-assign-polyfill'),
  'fetch': () => import('isomorphic-fetch'),
  'Reflect': () => import('harmony-reflect'),
  'Array.prototype.find': () => import('array.prototype.find'),
  'html-imports': {
    test() {
      return !('import' in document.createElement('link'));
    },
    load: () => import('@webcomponents/webcomponentsjs/webcomponents-bundle')
  }
};
```


### Usage
```javascript
// init-polyfill-service.js
import {Polyfill} from '@aofl/polyfill-service';
import polyfills from './sample-config';

const ready = Polyfill.loadAll(polyfills); // promise

export default ready;
```

`polyfill.loadAll()` returns a promise. In addition to this `WebComponentsReady` is fired once all promises are loaded.


### Gotchas
If using webpack you will have to use `imports-loader` to fix the global variable in webcomponents polyfills.

```javascript
// webpack.config.js
...
  module: {
    rules: [
      {
        test: /@webcomponents/,
        loader: 'imports-loader?this=>window'
      },
    ]
  }
...
```
