# @aofl/cache-manager

Provides a unified class for storing objects in Storage-like Objects. You can choose from localStorage, sessionStorage and memoryStorage.

[Api Documentation](https://ageoflearning.github.io/aofl/v3.x/api-docs/module-@aofl_cache-manager.html)

## Examples
* [Basic Example](https://codesandbox.io/s/github/AgeOfLearning/aofl/tree/v3.0.0/aofl-js-packages/cache-manager/examples/simple)


## Installation
```bash
npm i -S @aofl/cache-manager
```

## Usage
```javascript
import {CacheManager, cacheTypeEnumerate} from '@aofl/cache-manager';

const cacheManager = new CacheManager('exampleNamespace', cacheTypeEnumerate.LOCAL)
cacheManager.setItem('hello', 'world');

console.log(cacheManager.getItem('hello')); // expected result: 'world'
```
