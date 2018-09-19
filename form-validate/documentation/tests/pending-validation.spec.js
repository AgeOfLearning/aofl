/* eslint no-invalid-this: "off", require-jsdoc: "off" */
import {validationMixin} from '../../';

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
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(value === 'hello');
                }, 200);
              });
            }
          },
          lastname: {
            isAvailable(value) {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(value === 'world');
                }, 400);
              });
            }
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


  it('should be pending validation', function() {
    this.testForm.firstname = 'A';
    this.testForm.form.validate();
    expect(this.testForm.form).to.have.property('pending', true);
  });

  it('should not be pending once validation complete', async function() {
    this.testForm.firstname = 'A';
    this.testForm.form.validate();
    await this.testForm.form.validateComplete;
    expect(this.testForm.form).to.have.property('pending', false);
  });

  it('should not change the validateComplete promise if there\'s a pending promise', async function() {
    this.testForm.firstname = 'A';
    this.testForm.form.validate();
    let validateCompleteCached = this.testForm.form.validateComplete;
    this.testForm.form.validate();
    expect(this.testForm.form.validateComplete).to.equal(validateCompleteCached);
  });

  it('should only resolve once with the status of the latest input(true)',
  async function() {
    this.testForm.firstname = 'A';
    this.testForm.form.validate();
    this.testForm.firstname = 'hello';
    this.testForm.form.validate();
    await this.testForm.form.validateComplete;
    expect(this.testForm.form.firstname.valid).to.be.true;
  });

  it('should only resolve once with the status of the latest input(false)',
  async function() {
    this.testForm.firstname = 'hello';
    this.testForm.form.validate();
    this.testForm.firstname = 'A';
    this.testForm.form.validate();
    await this.testForm.form.validateComplete;
    expect(this.testForm.form.firstname.valid).to.be.false;
  });

  it('should only resolve once with the status of the latest input even when a different field changes',
  function(done) {
    this.testForm.firstname = 'hello';
    this.testForm.form.firstname.validate();
    this.testForm.form.validateComplete;
    setTimeout(() => {
      this.testForm.lastname = 'world';
      this.testForm.form.lastname.validate();
      this.testForm.form.validateComplete
      .then(() => {
        expect(this.testForm.form.observed).to.be.true;
        done();
      });
    }, 50);
  });

  it('should create a new promise if previous validateComplete was resolved',
  async function() {
    this.testForm.firstname = 'hello';
    this.testForm.form.validate();
    const cachedValidateComplete = this.testForm.form.validateComplete;
    await cachedValidateComplete;
    this.testForm.lastname = 'world';
    this.testForm.form.validate();
    expect(this.testForm.form.validateComplete).to.not.equal(cachedValidateComplete);
  });
});
