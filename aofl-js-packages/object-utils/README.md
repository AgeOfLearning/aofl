# @aofl/object-utils

A small collection of Object utility functions designed to have a small footprint and be performant.

#

[Api Documentation](https://ageoflearning.github.io/aofl/v4.x/api-docs/modules/_aofl_object_utils.html#deepAssign)

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
