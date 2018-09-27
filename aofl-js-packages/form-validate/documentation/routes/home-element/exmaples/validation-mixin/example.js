/* eslint-disable */

const validators = {
  username: {
    required: isRequired,
    minLength: minLength(4)
  },
  password: {
    required: isRequired,
    minLength: minLength(8),
    alpha(password) {
      return typeof password === 'string' && /\d/.test(password) && /[a-zA-z]/.test(password);
    }
  }
};

class LoginForm extends validationMixin(AoflElement) {
  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.validators = validators;
  }

  static get is() {
    return 'login-form';
  }
  static get properties() {
    return {
      username: String,
      password: String,
    }
  }

  usernameChanged(e) {
    this.username = e.target.value;
    this.form.username.validate();
  }

  passwordChanged(e) {
    this.password = e.target.value;
    this.form.password.validate();
  }

  submit(e) {
    e.preventDefault();
    this.form.validate();
    this.form.validateComplete
    .then(() => {
      if (this.form.valid) {
        alert('Valid Login Form.')
      } else {
        alert('Invalid Login Form.')
      }
    });
  }
  _render() {
    return super._render((context, html) => html`

      <div style="display: flex; ">
        <form on-submit="${(e) => context.submit(e)}" style="display: flex; flex-direction: column; flex: 1; padding: 0 2rem;">
          <label>username</label>
          <input value="${context.username}" on-input="${(e) => context.usernameChanged(e)}">

          ${!context.form.username.required.valid? html`<p style="color: red;">Username required.</p>`: ``}
          ${!context.form.username.minLength.valid? html`<p style="color: red;">Username must be 4 charachters.</p>`: ``}

          <label>password</label>
          <input value="${context.password}" on-input="${(e) => context.passwordChanged(e)}">
          ${context.form.password.observed && !context.form.password.required.valid? html`<p style="color: red;">password required.</p>`: ``}
          ${context.form.password.observed && !context.form.password.minLength.valid? html`<p style="color: red;">password must be 8 charachters.</p>`: ``}
          ${context.form.password.observed && !context.form.password.alpha.valid? html`<p style="color: red;">password must contain letters and numbers</p>`: ``}

          <input type="submit" value="Submit" disabled="${context.form.pending}"">
        </form>
        <pre style="flex: 1;">${JSON.stringify(context.form, ['valid', 'pending', 'observed', 'username', 'password'], 2)}</pre>
      </div>
    `);
  }
}

customElements.define(LoginForm.is, LoginForm);
