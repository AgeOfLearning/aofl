# Form Validation

This will be a brief overview of how AofLjs handles form validation. We will build a simple login form containing
a username and password.

---
## Installation

**NPM**
```bash
npm i -S @aofl/form-validate
```

## How to use it
To use form-validate follow these steps:
1. Import `validationMixin` and any desired validators

```javascript
...
import {validationMixin, isRequired} from '@aofl/form-validate';

class LoginForm extends validationMixin(AoflElement) {
  ...
}
```

2. Define a validators object inside your constructor. The keys in this object will be properties of your class.
   Their corresponding value will be an object containing all validators that should be applied.

```javascript
...
constructor() {
  super();

  this.username = '';
  this.password = '';
  this.validators = {
    username: {
      isRequired
    },
    password: {
      isRequired
    }
  };
}
...
```

3. Call validate whenever you want to check the validity of your properties. You can check the validity of specific properties
   or the entire form.

```javascript
...
/**
 * Update username and check for validity
 *
 * @param {Event} e
 */
onUsernameUpdate(e) {
  this.username = e.target.value;
  this.form.username.validate();
}

/**
 * Update password and check for validity
 *
 * @param {Event} e
 */
onPasswordUpdate(e) {
  this.username = e.target.value;
  this.form.password.validate();
}

/**
 * Submit form if valid
 *
 * @ param {Event} e
 */
async submitForm(e) {
  e.preventDefault();

  this.form.validate();
  await this.form.validateComplete;

  if (this.form.valid) {
    // Handle form submission logic
    ...
  }
}
```

4. Finally we update our template file to display an error if our form is invalid.

```javascript
export default (context, html) => html`
  <form @submit="${e => context.submitForm(e)}">
    <input
      name="username"
      @input="${e => context.onUsernameUpdate(e)}"
      .value="${context.username}"
      type="text"
    />
    <input
      name="username"
      @input="${e => context.onPasswordUpdate(e)}"
      .value="${context.password}"
      type="password"
    />
    <button type="submit" ?disabled="${!context.form.valid}">Submit</button>
    ${
      context.form.valid
        ? ""
        : html`<p>Please enter all required fields</p>`
    }
  </form>
`;
```
