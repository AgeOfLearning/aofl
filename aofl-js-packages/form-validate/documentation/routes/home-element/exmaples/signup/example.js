/* eslint-disable */

const validators = {
  username: {
    required: isRequired,
    isAvailable(value) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let taken = ['micah', 'micahblu', 'mblu'];
          resolve(!taken.includes(value));
        }, 500);
      });
    },
    validName(value) {
      return /^[\w|\d]{8,12}$/.test(value);
    }
  },
  email: {
    required: isRequired,
    isValidEmail(value) {
      return /^[\w\d.!#$%&’*+/=?^_`{|}~-]+@[\w\d-]+\.[\w\d-]{2,63}$/.test(value);
    }
  },
  ageRange: {
    required: isRequired
  },
  password: {
    required: isRequired,
    isValid(value) {
      return /^[\w|\d|%!#]+$/.test(value)
    },
    ofLength(value) {
      const min = 10;
      const max = 15;
      return value.length >= min && value.length <= max;
    }
  }
};

class SignupForm extends validationMixin(AoflElement) {
  constructor() {
    super();
    this.validators = validators;
  }
  static get is() {
    return 'signup-form';
  }

  static get properties() {
    return {
      username: String,
      email: String,
      ageRange: Number,
      password: String,
      isValid: Boolean
    }
  }

  updateValue(prop, value) {
    this[prop] = value;
    this.form[prop].validate();
  }

  submitForm(e) {
    e.preventDefault();
    if (this.form.valid) {
      alert('Thanks for signing up!');
    }
  }

  _render() {
    const ageRanges = ["18-35", "36-55", "56-72", "73+"];
    return super._render((context, html) => html`
      <div style="display: flex">
        <form on-submit="${(e) => context.submitForm(e)}" style="width: 50%;">
          <label>Username <small>try (micah, micahblu, mblu)</small></label>
          <input type="text" autocomplete="off" name="username" value="${context.username}" on-input="${(e) => context.updateValue('username', e.target.value) }" />
          ${context.form.username.pending ? html`<p class="green">Checking name availability...</p>` : ''}
          ${!context.form.username.required.valid? html`<p class="error">*Username is a required field.</p>`: ''}
          ${!context.form.username.isAvailable.valid? html`<p class="error">That username is taken.</p>`: ''}
          ${!context.form.username.validName.valid? html`<p class="error">Username must be between 8-12 alphanumeric characters.</p>`: ''}

          <label>Email</label>
          <input type="text" autocomplete="off" name="email" value="${context.email}" on-input="${(e) => context.updateValue('email', e.target.value) }" />
          ${!context.form.email.required.valid ? html`<p class="error">*Email is a required field.</p>` : ''}
          ${!context.form.email.isValidEmail.valid ? html`<p class="error">Please enter a valid email.</p>` : ''}

          <label>Age range</label>
          <select name="age-list" on-change="${(e) => context.updateValue('ageRange', e.target.value) }">
            <option value="">Select an age range</option>
            ${ageRanges.map((range) => {
              return html`<option value="${range}" selected="${context.ageRange === range}">${range}</option>`;
            })}
          </select>
          ${!context.form.ageRange.required.valid ? html`<p class="error">*Age range is a required field.</p>` : ''}

          <label>Password</label>
          <input type="password" name="password" on-input="${(e) => context.updateValue('password', e.target.value) }" />
          ${!context.form.password.required.valid ? html`<p class="error">*Password is a required field.</p>` : ''}
          ${!context.form.password.ofLength.valid ? html`<p class="error">Password should be between 10 and 15 characters</p>` : ''}
          ${!context.form.password.isValid.valid ? html`<p class="error">Password can only contain numbers, letters and %!# characters</p>` : ''}

          <input type="submit" value="Submit" disabled="${!context.form.valid || context.form.pending}">
        </form>

        <pre>${JSON.stringify(context.form, ['valid', 'pending', 'observed', 'username', 'email', 'ageRanges', 'password'], 2)}</pre>
      </div>

      `, [`label {
        display: block;
        margin: 0 0 1rem 0;
      }

      .error {
        color: #e0520b;
        font-weight: 700;
      }

      .green {
        color: lightgreen;
        font-weight: 700;
      }

      form: {
        width: 50%;
        box-sizing: border-box;
      }

      input,
      button,
      select {
        font-size: 1.25em;
        padding: .5em;
        margin: 0 0 1em 0;
        width: 100%;
        box-sizing: border-box;
      }

      select {
        border: 1px solid #ccc;
        box-shadow: none;
      }

      input[type=submit] {
        border: 1px solid gold;
        background: gold;
      }

      select:focus {
        outline: none;
      }

      [disabled] {
        opacity: .35;
      }`]);
  }
}

customElements.define(SignupForm.is, SignupForm);
