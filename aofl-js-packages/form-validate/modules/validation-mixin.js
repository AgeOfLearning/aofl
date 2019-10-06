/**
 * @summary validation-mixin
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import ValidationProperty from './validation-property';

/**
 * @memberof module:@aofl/form-validate
 *
 * @param {Object} superClass
 * @return {ValidationMixin}
 */
export default ((superClass) => {
  /**
   * Mixes the superClass with the form validatin functionality.
   *
   * @memberof module:@aofl/form-validate
   * @extends {superClass}
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
