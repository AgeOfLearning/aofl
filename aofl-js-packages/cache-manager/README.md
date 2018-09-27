# @aofl/cache-manager

Provides a unified class for storing objects in Storage-like Objects. You can choose from localStorage, sessionStorage and memoryStorage.

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
