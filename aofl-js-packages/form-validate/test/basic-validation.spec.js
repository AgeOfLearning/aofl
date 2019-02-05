/* eslint no-invalid-this: "off", require-jsdoc: "off" */
import {validationMixin, isRequired, minLength} from '../';

describe('@aofl/aofl-validate/validationMixin', function() {
  before(function() {
    class ValidationTest extends validationMixin(function() {}) {
      constructor() {
        super();
        this.firstname = '';
        this.lastname = '';
        this.password = '';
        this.validators = {
          firstname: {
            isRequired,
            min: minLength(3)
          },
          lastname: {
            isRequired
          },
          password: {
            isRequired
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

  it('should have a property \'form\'', function() {
    expect(this.testForm).to.have.property('form');
  });

  it('should not allow validators to be reassigned', function() {
    const cachedValidators = this.testForm.validators;
    this.testForm.validators = {};

    expect(this.testForm.validators).to.be.equal(cachedValidators);
  });

  it('should have a property \'form\' with valid',
    function() {
      expect(this.testForm.form).to.have.property('valid', true);
    });

  it('should have a property \'form\' with pending',
    function() {
      expect(this.testForm.form).to.have.property('pending', false);
    });

  it('should have a property \'form\' with observed',
    function() {
      expect(this.testForm.form).to.have.property('observed', false);
    });

  it('should have a property \'form\' with firstname',
    function() {
      expect(this.testForm.form).to.have.property('firstname');
    });

  it('should have a property \'form\' with firstname with isRequired',
    function() {
      expect(this.testForm.form.firstname).to.have.property('isRequired');
    });

  it('should have a property \'form\' with firstname with isRequired width valid',
    function() {
      expect(this.testForm.form.firstname.isRequired).to.have.property('valid', true);
    });

  it('should have a property \'form\' with firstname with isRequired width pending',
    function() {
      expect(this.testForm.form.firstname.isRequired).to.have.property('pending', false);
    });

  it('should have a property \'form\' with firstname with isRequired width observed',
    function() {
      expect(this.testForm.form.firstname.isRequired).to.have.property('observed', false);
    });

  it('should have a property \'form\' with lastname',
    function() {
      expect(this.testForm.form).to.have.property('lastname');
    });

  it('should have a property \'form\' with password',
    function() {
      expect(this.testForm.form).to.have.property('password');
    });


  context('invoke validate on form', function() {
    it('should have property form.valid = false', async function() {
      try {
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.valid = false', async function() {
      try {
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.isRequired.valid = false', async function() {
      try {
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.isRequired).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.isRequired.valid = true', async function() {
      try {
        this.testForm.firstname = 'A';
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.isRequired).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.min.valid = false', async function() {
      try {
        this.testForm.firstname = 'A';
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.min).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });


    it('should have property form.firstname.min.valid = true', async function() {
      try {
        this.testForm.firstname = 'AAA';
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.valid = true', async function() {
      try {
        this.testForm.firstname = 'AAA';
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.valid = true', async function() {
      try {
        this.testForm.firstname = 'AAA';
        this.testForm.lastname = 'AAA';
        this.testForm.password = 'AAA';
        this.testForm.form.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    // observe
    it('should have property form.firstname.isrequired.observe = true',
      async function() {
        try {
          this.testForm.form.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form.firstname.isRequired).to.have.property('observed', true);
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should have property form.firstname.observe = true',
      async function() {
        try {
          this.testForm.form.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form.firstname).to.have.property('observed', true);
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should have property form.observe = true',
      async function() {
        try {
          this.testForm.form.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form).to.have.property('observed', true);
        } catch (e) {
          return Promise.reject(e);
        }
      });
  });

  context('invoke validate on form.firstname', function() {
    it('should have property form.valid = false', async function() {
      try {
        this.testForm.form.firstname.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.valid = false', async function() {
      try {
        this.testForm.form.firstname.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.isRequired.valid = false', async function() {
      try {
        this.testForm.form.firstname.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.isRequired).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.isRequired.valid = true', async function() {
      try {
        this.testForm.firstname = 'A';
        this.testForm.form.firstname.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.isRequired).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.min.valid = false', async function() {
      try {
        this.testForm.firstname = 'A';
        this.testForm.form.firstname.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.min).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });


    it('should have property form.firstname.min.valid = true', async function() {
      try {
        this.testForm.firstname = 'AAA';
        this.testForm.form.firstname.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.valid = true', async function() {
      try {
        this.testForm.firstname = 'AAA';
        this.testForm.form.firstname.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    // observe
    it('should have property form.firstname.isrequired.observe = true',
      async function() {
        try {
          this.testForm.form.firstname.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form.firstname.isRequired).to.have.property('observed', true);
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should have property form.firstname.observe = true',
      async function() {
        try {
          this.testForm.form.firstname.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form.firstname).to.have.property('observed', true);
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should have property form.observe = false',
      async function() {
        try {
          this.testForm.form.firstname.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form).to.have.property('observed', false);
        } catch (e) {
          return Promise.reject(e);
        }
      });
  });

  context('invoke validate on form.firstname.isRequired', function() {
    it('should have property form.valid = false', async function() {
      try {
        this.testForm.form.firstname.isRequired.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.valid = false', async function() {
      try {
        this.testForm.form.firstname.isRequired.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.isRequired.valid = false', async function() {
      try {
        this.testForm.form.firstname.isRequired.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.isRequired).to.have.property('valid', false);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.isRequired.valid = true', async function() {
      try {
        this.testForm.firstname = 'A';
        this.testForm.form.firstname.isRequired.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname.isRequired).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    it('should have property form.firstname.valid = true', async function() {
      try {
        this.testForm.firstname = 'AAA';
        this.testForm.form.firstname.isRequired.validate();
        await this.testForm.form.validateComplete;
        expect(this.testForm.form.firstname).to.have.property('valid', true);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    // observe
    it('should have property form.firstname.isrequired.observe = true',
      async function() {
        try {
          this.testForm.form.firstname.isRequired.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form.firstname.isRequired).to.have.property('observed', true);
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should have property form.firstname.observe = false',
      async function() {
        try {
          this.testForm.form.firstname.isRequired.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form.firstname).to.have.property('observed', false);
        } catch (e) {
          return Promise.reject(e);
        }
      });

    it('should have property form.observe = false',
      async function() {
        try {
          this.testForm.form.firstname.isRequired.validate();
          await this.testForm.form.validateComplete;
          expect(this.testForm.form).to.have.property('observed', false);
        } catch (e) {
          return Promise.reject(e);
        }
      });
  });
});
