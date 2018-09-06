# @aofl/register-callback

It allows callback functions to be registered and called in series when registerCallbackInstance.next or registerCallbackInstance.error are called.

---
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
rc.error('uh oh'); // expected results: error function of "world" is invoked printing 'uh oh' to console

// usubscribe a callback
unsubscribeHello();
rc.next(); // expected results: world
```

---
## Methods

### `constructor()`
Creates an instance of RegisterCallback.

#### Arguments
none.

---
### `register(next, error)`
When register() is invoked, it adds next and error functions to the callbacks list.

#### Arguments
| Name  | Type     | Description                                                                           |
|-------|----------|---------------------------------------------------------------------------------------|
| next  | Function | The next callback function is invoked when `registerCallbackInstance.next()` is called.   |
| error | Function | The error callback function is invoked when `registerCallbackInstance.error()` is called. |


#### Return Value
`register()` returns a function that when invoked unregisters the callbacks.

---
### `next()`
When `next()` is invoked, it calls all functions in `callbacks.next` list and passes payload to each function.

#### Arguments
| Name    | Type | Description                                                        |
|---------|------|--------------------------------------------------------------------|
| payload | any  | This is the payload that is passed to each next callback function. |

---
### `error()`
When `error()` is invoked, it calls all functions in `callbacks.error` list and passes payload to each function.

#### Arguments
| Name    | Type | Description                                                        |
|---------|------|--------------------------------------------------------------------|
| payload | any  | This is the payload that is passed to each error callback function.|

---
