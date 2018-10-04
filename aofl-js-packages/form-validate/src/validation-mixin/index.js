import ValidationProperty from '../validation-property';

/**
 * @summary validation mixin
 * @version 1.0.0
 * @requires module:aofl-js/form-validate-package/src/validation-property
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @param {Object} superClass
 * @memberof module:aofl-js/form-validate-package
 * @return {ValidationMixin}
 */
export default ((superClass) => {
  /**
   *
   */
  class ValidationMixin extends superClass {
    /**
     * Creates an instance of ValidationMixin.
     */
    constructor(...args) {
      super(...args);
      let validators = void 0;

      Object.defineProperties(this, {
        validators: {
          get() {
            return validators;
          },
          set(value) {
            if (typeof validators === 'undefined') {
              validators = value;
              this.form = new ValidationProperty(this, value);
            }
          }
        },
        form: {
          writable: true,
          enumerable: true
        }
      });
    }
  }

  return ValidationMixin;
});
