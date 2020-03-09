/* eslint no-invalid-this: "off", require-jsdoc: "off" */
import {isEqual} from '../modules/is-equal';
import {validationMixin} from '../modules/validation-mixin';
import {expect} from 'chai';

describe('@aofl/aofl-validate/is-equal', function() {
  before(function() {
    class ValidationTest extends validationMixin(function() {}) {
      constructor() {
        super();
        this.password = '';
        this.verifyPassword = '';
        this.validators = {
          verifyPassword: {
            isEqual: isEqual('password')
          },
          verifyPasswordAgainstUndefined: {
            isEqual: isEqual('password-missing-field')
          }
        };
      }

      requestUpdate() {}
    }
    this.ValidationTest = ValidationTest;
  });

  beforeEach(function() {
    this.testForm = new this.ValidationTest();
  });

  it('should be true when values match', async function() {
    try {
      this.testForm.password = 'password';
      this.testForm.verifyPassword = 'password';
      this.testForm.form.validate();
      await this.testForm.form.validateComplete;

      expect(this.testForm.form.verifyPassword).to.have.property('valid', true);
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should be false when values do not match', async function() {
    try {
      this.testForm.password = 'password2';
      this.testForm.form.validate();
      await this.testForm.form.validateComplete;

      expect(this.testForm.form.verifyPassword).to.have.property('valid', false);
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should be false when validating against missing field', async function() {
    try {
      this.testForm.form.validate();
      await this.testForm.form.validateComplete;

      expect(this.testForm.form.verifyPasswordAgainstUndefined).to.have.property('valid', false);
    } catch (e) {
      return Promise.reject(e);
    }
  });
});
