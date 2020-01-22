/* eslint no-invalid-this: "off", require-jsdoc: "off" */
import {validationMixin} from '../modules/validation-mixin';
import {expect} from 'chai';

describe('@aofl/aofl-validate/validationMixin', function() {
  before(function() {
    class ValidationTest extends validationMixin(function() {}) {
      constructor() {
        super();
        this.firstname = '';
        this.lastname = '';
        this.validators = {
          firstname: {
            isAvailable(value) {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(value === 'hello');
                }, 50);
              });
            }
          },
          lastname: {
            isAvailable(value) {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(value === 'world');
                }, 100);
              });
            }
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


  it('should be pending validation', function() {
    this.testForm.firstname = 'A';
    this.testForm.form.validate();
    expect(this.testForm.form).to.have.property('pending', true);
  });

  it('should not be pending once validation complete', async function() {
    try {
      this.testForm.firstname = 'A';
      this.testForm.form.validate();
      await this.testForm.form.validateComplete;
      expect(this.testForm.form).to.have.property('pending', false);
    } catch (e) {
      return Promise.reject(e);
    }
  });

  it('should not change the validateComplete promise if there\'s a pending promise', function() {
    this.testForm.firstname = 'A';
    this.testForm.form.validate();
    const validateCompleteCached = this.testForm.form.validateComplete;
    this.testForm.form.validate();
    expect(this.testForm.form.validateComplete).to.equal(validateCompleteCached);
  });

  it('should only resolve once with the status of the latest input(true)',
    async function() {
      try {
        this.testForm.firstname = 'A';
        this.testForm.form.validate();
        this.testForm.firstname = 'hello';
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.valid).to.be.true;
      } catch (e) {
        return Promise.reject(e);
      }
    });

  it('should only resolve once with the status of the latest input(false)',
    async function() {
      try {
        this.testForm.firstname = 'hello';
        this.testForm.form.validate();
        this.testForm.firstname = 'A';
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.valid).to.be.false;
      } catch (e) {
        return Promise.reject(e);
      }
    });

  it('should only resolve once with the status of the latest input even when a different field changes',
    async function() {
      try {
        await new Promise((resolve) => {
          this.testForm.firstname = 'hello';
          this.testForm.form.firstname.validate();
          this.testForm.form.validateComplete
            .then(() => {
              expect(this.testForm.form.observed).to.be.true;
              resolve();
            });

          this.testForm.lastname = 'world';
          this.testForm.form.lastname.validate();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });

  it('should create a new promise if previous validateComplete was resolved',
    async function() {
      try {
        this.testForm.firstname = 'hello';
        this.testForm.form.validate();
        const cachedValidateComplete = this.testForm.form.validateComplete;
        await cachedValidateComplete;
        this.testForm.lastname = 'world';
        this.testForm.form.validate();
        expect(this.testForm.form.validateComplete).to.not.equal(cachedValidateComplete);
      } catch (e) {
        return Promise.reject(e);
      }
    });
});
