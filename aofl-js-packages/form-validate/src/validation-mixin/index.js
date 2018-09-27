import ValidationProperty from '../validation-property';

export default ((superClass) => {
  /**
   *
   * @extends superClass
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
