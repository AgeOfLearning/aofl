import template from './template';
import styles from './styles';
import {validationMixin, isRequired, minLength} from '@aofl/form-validate';
import {AoflElement} from '@aofl/element';

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
      username: {type: String},
      password: {type: String},
    };
  }

  usernameChanged(e) {
    this.username = e.target.value;
    this.form.username.validate();
  }

  passwordChanged(e) {
    this.password = e.target.value;
    this.form.password.validate();
  }

  async submit(e) {
    e.preventDefault();
    this.form.validate();
    await this.form.validateComplete;

    if (this.form.valid) {
      alert('Valid Login Form.'); // eslint-disable-line
    } else {
      alert('Invalid Login Form.'); // eslint-disable-line
    }
  }

  render() {
    return super.render(template, [styles]);
  }
}

customElements.define(LoginForm.is, LoginForm);
