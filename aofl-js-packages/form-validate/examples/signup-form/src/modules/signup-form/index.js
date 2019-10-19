import {AoflElement} from '@aofl/element';
import template from './template';
import styles from './styles';
import {validationMixin, isRequired} from '@aofl/form-validate';

const validators = {
  username: {
    required: isRequired,
    isAvailable(value) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const taken = ['micah', 'micahblu', 'mblu'];
          resolve(!taken.includes(value));
        }, 500);
      });
    },
    validName(value) {
      return new RegExp('^[\\w|\\d]{8,12}$').test(value);
    }
  },
  email: {
    required: isRequired,
    isValidEmail(value) {
      return new RegExp('^[\\w\\d.!#$%&’*+/=?^_`{|}~-]+@[\\w\\d-]+\\.[\\w\\d-]{2,63}$').test(value);
    }
  },
  ageRange: {
    required: isRequired
  },
  password: {
    required: isRequired,
    isValid(value) {
      return new RegExp('^[\\w|\\d|%!#]+$').test(value);
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
    this.username = '';
    this.email = '';
    this.ageRange = 0;
    this.password = '';
  }
  static get is() {
    return 'signup-form';
  }

  static get properties() {
    return {
      username: {type: String, attribute: false},
      email: {type: String, attribute: false},
      ageRange: {type: Number, attribute: false},
      password: {type: String, attribute: false}
    };
  }

  updateValue(prop, value) {
    this[prop] = value;
    this.form[prop].validate();
  }

  submitForm(e) {
    e.preventDefault();
    if (this.form.valid) {
      alert('Thanks for signing up!'); // eslint-disable-line
    }
  }

  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(SignupForm.is, SignupForm);
