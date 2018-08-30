# @aofl/object-utils

A small collection of Object utility functions designed to have a small footprint (20b gz) and be performant.

---
## Why?
Libraries like Lodash have a high overhead and come with more functionality than most projects need. Also, with es6 features fewer of these "utility" functions are needed.

In Lodash's case, even if you only import the needed features you still get the 4kb gzipped Core build + additional functionality.

---
## Installation

```bash
npm i -S @aofl/object-utils
```

---
## Usage
```javascript
import {deepAssign} from '@aofl/object-utils';

deepAssign(leftSource, 'nested.path.to.assign', rightSource);
```

---
## Methods

### deepAssign
Recursively calls Object.assign along the specified path.

#### Arguments
| Name        | Type   | Description    |
|-------------|--------|----------------|
| leftSource  | Object | Left source    |
| path        | String | Path to target |
| rightSource | Object | Right source   |

#### Example
```javascript
const user = {
  name: 'Alan',
  account: {
    active: true,
    products: {
      1: true,
      2: true,
      3: true
    }
  },
  preferences: {
   locale: 'en-US'
 }
};

const user2 = deepAssign(user, 'account.products', {
  2: false
});

// { // new ref
//   name: 'Alan',
//   account: { // new ref
//     active: true,
//     products: { // new ref
//       1: true,
//       2: false, // updated value
//       3: true
//     }
//   },
//   preferences: { // same ref
//     locale: 'en-US'
//   }
// };

console.log(user2 === user); // expected result: false
console.log(user2.account === user.account); // expected result: false
console.log(user2.preferences === user.preferences); // expected result: true
```

---
### deepFreeze
Recursively calls Object.freeze on objects properties.

*Note: this method should only be used in development environments and disabled in production*

#### Arguments
| Name    | Type   | Description    |
|---------|--------|----------------|
| source  | Object | Source Object  |


#### Example
```javascript
let user = deepFreeze({
  name: 'Alan',
  account: {
    active: true,
    products: {
      1: true,
      2: true,
      3: true
    }
  },
  preferences: {
   locale: 'en-US'
 }
});

user.account.active = false; // Throws an error in strict mode
console.log(user.account.active); // expected output: true
```
---
