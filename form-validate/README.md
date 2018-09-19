# @aofl/aofl-validate

@aofl/aofl-validate comes with a handful of form validation functions and an aofl-element mixin to simplify form validation for webcomponents. It even bundles some basic validators.


## Installation
```bash
npm i -S @aofl/aofl-validate
```

## Usage
```javascript
...
import {validationMixin, isRequired, minLength} from '@aofl/aofl-validate';

class Login extends validationMixin(AoflElement) {
  get validators() {
        return {
      username: {
        isRequired
      },
      password: {
        isRequired,
        min: minLength(8)
      }
    };
  }
}
// results in

login-form: {
  form: {
    valid: true,
    pending: false,
    observed: false,
    username: {
      valid: true,
      pending: false,
      observed: false,
      isRequired: {
        valid: true,
        pending: false,
        observed: false,
      }
    },
    password: {
      valid: true,
      pending: false,
      observed: false,
      isRequired: {
        valid: true,
        pending: false,
        observed: false,
      },
      min: {
        valid: true,
        pending: false,
        observed: false,
      }
    }
  }
}
```

## Methods
All properties of `element.form` are instances of the same interface and therefore all properties and methods are available on each level.

```javascript
this.form.validate();
this.form.username.validate();
this.form.username.inRequired.validate();

// and respectively
this.form.valid;
this.form.username.valid;
this.form.username.isRequired.valid;
```

### `reset()`
Reset the form validation object to it's initial state.

### `validate()`
When validate is invoked it call validate on it's properties resulting in the preperties' validation functions to be invoked.

```javascript
this.form.validate(); // validates every property

this.form.username.validate(); // validates username
```

## Properties
### `valid`
Checks the `.valid` property of it's properties and return false if any of them are invalid.

```javascript
this.form.valid; // return the validity of the entire form

this.form.username.valid; // return the validity of username
```

### `pending`
Checks the `.pending` property of it's properties and return true if any of them are pending.

```javascript
this.form.pending; // return true if any property is pending

this.form.username.pending; // returns true if username is pending
```

### `observed`
Boolean property that signifies if a form proprety was validated.

```javascript
this.form.observed; // return true if all properties have been observed

this.form.username.pending; // returns true if username has been observed
```

### `validateComplete`
Returns a promise that resolves when the latest async operation has completed.



---
## Bundled Validators

### isRequired
Test whether value is empty or not.

```javascript
import {isRequired} from '@aofl/aofl-validate';

class MyElement extends validationMixin(AoflElement) {
...
  get validators() {
    return {
      password:  {
        isRequired
      },
      ...
    };
  }
...
}
```

### isEqual
Test whether the values of two fields are equal. E.g. password & verify password fields.

```javascript
import {isEqual} from '@aofl/aofl-validate';

class MyElement extends validationMixin(AoflElement) {
...
  get validators() {
    return {
      password: {
        ...
      },
      verifyPassword:  {
        isEqual: isEqual('password')
      }
    };
  }
...
}
```

### minLength
Test whether the value meets a minimum length requirement.

```javascript
import {minLength} from '@aofl/aofl-validate';

class MyElement extends validationMixin(AoflElement) {
...
  get validators() {
    return {
      password: {
        minLength: minLength(8)
      },
      ...
    };
  }
...
}
```

### maxLength
Test whether the value meets a maximum length requirement.

```javascript
import {maxLength} from '@aofl/aofl-validate';

class MyElement extends validationMixin(AoflElement) {
...
  get validators() {
    return {
      password: {
        maxLength: maxLength(8)
      },
      ...
    };
  }
...
}
```
### isAllDigits
Test whether the value consists of only digits.

```javascript
import {isAllDigits} from '@aofl/aofl-validate';

class MyElement extends validationMixin(AoflElement) {
...
  get validators() {
    return {
      password: {
        isAllDigits
      },
      ...
    };
  }
...
}
```
