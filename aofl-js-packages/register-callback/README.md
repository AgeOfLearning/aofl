# @aofl/register-callback

It allows callback functions to be registered and called in series when registerCallbackInstance.next or registerCallbackInstance.error are called.

[Api Documentation](https://ageoflearning.github.io/aofl/v4.x/api-docs/modules/_aofl_register_callback.html)

## Installation
```bash
npm i -S @aofl/register-callback
```

---
## Usage
```javascript
import {RegisterCallback} from '@aofl/register-callback';

const rc = new RegisterCallback();

const unsubscribeHello = rc.register(() => console.log('hello'));
const unsubscribeWorld = rc.register(() => console.log('world'), (e) => console.log);

// invoke next
rc.next(); // expected results: hello \n world

// invoke error
rc.error(new Error('uh oh')); // expected results: error function of "world" is invoked printing 'uh oh' to console

// unsubscribe a callback
unsubscribeHello();
rc.next(); // expected results: world
```
