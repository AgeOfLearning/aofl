/* eslint no-invalid-this: "off", require-jsdoc: "off" */
import {validationMixin, isEqual} from '../';

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

      requestRender() {}
    };
    this.ValidationTest = ValidationTest;
  });

  beforeEach(function() {
    this.testForm = new this.ValidationTest();
  });

  it('should be true when values match', async function() {
    this.testForm.password = 'password';
    this.testForm.verifyPassword = 'password';
    this.testForm.form.validate();
    await this.testForm.form.validateComplete;

    expect(this.testForm.form.verifyPassword).to.have.property('valid', true);
  });

  it('should be false when values match', async function() {
    this.testForm.password = 'password';
    this.testForm.form.validate();
    await this.testForm.form.validateComplete;

    expect(this.testForm.form.verifyPassword).to.have.property('valid', false);
  });

  it('should be false when validating against missing field', async function() {
    this.testForm.form.validate();
    await this.testForm.form.validateComplete;

    expect(this.testForm.form.verifyPasswordAgainstUndefined).to.have.property('valid', false);
  });
});
