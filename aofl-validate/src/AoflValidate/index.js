export default (superClass) => {
  /**
   * @summary AoflValidate
   * @class AoflValidate
   * @extends {superClass}
   * @param {Object} superClass The class that is to be extended by this mixin.
   */
  class AoflValidate extends superClass {
    /**
     * Properties definition object for this mixin
     *
     * @readonly
     * @static
     */
    static get properties() {
      return {
        $v: {
          type: Object,
          value: () => {
            return {};
          }
        }
      };
    }

    /**
     * constructor
     */
    constructor() {
      super();
      this.skipArray = ['$valid', '$dirty', '$pending', '$touch', '$reset'];
    }

    /**
     * connectedCallback
     */
    connectedCallback() {
      super.connectedCallback();
      this.$v = this._createInitialValidationState();
    }

    /**
     * Retrives the value for the given associated property name and
     * runs _getValidationState.
     *
     * @param {String} propertyKey The property key to grab the value with
     */
    $touch(propertyKey) {
      // Clearing out validation values
      this._setDirty(propertyKey);
      // If calling $touch for a specific property.
      if (propertyKey) {
        let value = this[propertyKey];
        this._$touchProperty(propertyKey, value);
      // If calling $touch on the $v validation object.
      } else {
        for (let validatorKey in this.validators) {
          if (!this.validators.hasOwnProperty(validatorKey)) continue;
          this.$v[validatorKey].$touch();
        }
      }
      this._setPropertyValidity([propertyKey]);
      this._setGlobalValidity();
    }

    /**
     *
     * @param {String} propertyKey
     * @param {*} value
     */
    _$touchProperty(propertyKey, value) {
      for (let validatorKey in this.validators[propertyKey]) {
        if (!this.validators[propertyKey].hasOwnProperty(validatorKey)) continue;
        if (this.validators[propertyKey][validatorKey] instanceof Promise) {
          this._callPromiseValidation(propertyKey, validatorKey, value);
        } else {
          this.set(`$v.${propertyKey}.${validatorKey}`, this.validators[propertyKey][validatorKey].call(this, value, propertyKey));
        }
      }
    }
    /**
     * Resets the validation state for either a given property or the whole
     * validation state object, depending on the value of the property key.
     *
     * @param {String} propertyKey The property key to reset validation
     *                             state for.
     */
    $reset(propertyKey) {
      if (propertyKey) {
        for (let validatorKey in this.$v[propertyKey]) {
          if (!this.$v[propertyKey].hasOwnProperty(validatorKey)) continue;
          if (validatorKey === '$valid') {
            this.set(`$v.${propertyKey}.${validatorKey}`, true);
          }
          this.set(`$v.${propertyKey}.${validatorKey}`, false);
          this._setPropertyValidity([propertyKey]);
          this._setGlobalValidity();
        }
      } else {
        this.$v = this._createInitialValidationState();
      }
    }

    /**
     * Intiates an asynchronous validation.
     *
     * @param {String} propertyKey
     * @param {String} validation
     * @param {String} value
     */
    _callPromiseValidation(propertyKey, validation, value) {
      this.set('$v.$pending', true);
      this.set(`$v.${propertyKey}.$pending`, true);
      this.validators[propertyKey][validation].call(this, value, propertyKey)
        .then((resp) => {
          this.set(`$v.${propertyKey}.${validation}`, true);
        })
        .catch((err) => {
          this.set(`$v.${propertyKey}.${validation}`, false);
        })
        .finally(() => {
          this.set(`$v.${propertyKey}.$pending`, false);
          this._setPropertyValidity([propertyKey]);
          this._setGlobalValidity();
        });
    }

    /**
     * Sets the $dirty flag for the given property key.
     *
     * @param {String} propertyKey The property key to mark as dirty.
     */
    _setDirty(propertyKey) {
      this.set('$v.$dirty', true);
      if (typeof propertyKey !== 'undefined') {
        this.set(`$v.${propertyKey}.$dirty`, true);
      }
    }

    /**
     * @param {Array} _propertyKeys
     */
    _setPropertyValidity(_propertyKeys) {
      let propertyKeys = _propertyKeys || Object.keys(this.$v);
      for (let propertyKey in this.$v) {
        if (!this.$v.hasOwnProperty(propertyKey) || this.skipArray.indexOf(propertyKey) !== -1 ||
          propertyKeys.indexOf(propertyKey) === -1) continue;

        let isPropertyValid = true;
        for (let validationKey in this.$v[propertyKey]) {
          if (this.$v[propertyKey].hasOwnProperty(validationKey) && this.skipArray.indexOf(validationKey) === -1 &&
          !this.$v[propertyKey][validationKey] ) {
            isPropertyValid = false;
            break;
          }
        }
        this.set(`$v.${propertyKey}.$valid`, isPropertyValid);
      }
    }

    /**
     * Checks if any of the keys in this.$v are invalid, and returns the value.
     * validator properties.
     *
     */
    _setGlobalValidity() {
      let isStateValid = true;
      for (let key in this.$v) {
        if (this.$v.hasOwnProperty(key) && !this.$v[key].$valid && this.skipArray.indexOf(key) === -1 ) {
          isStateValid = false;
          break;
        }
      };
      this.set('$v.$valid', isStateValid);
    }

    /**
     * Creates the initial validation state object, with the initial
     * property and prototype object.
     *
     * @param {String} propertyKey Determines if the created object
     *                             should have a set prototype.
     * @return {Object} New initial validation state object
     */
    _createValidationStateObject(propertyKey = '') {
      return {
        $valid: true,
        $dirty: false,
        $pending: false,
        $touch: this.$touch.bind(this, propertyKey),
        $reset: this.$reset.bind(this, propertyKey)
      };
    }

    /**
     * Creates the initial validation state object, when the mixin
     * application is created.
     *
     * @return {Object} The initial validation state
     */
     _createInitialValidationState() {
      // Sets initial $v validation object.
      let validationState = this._createValidationStateObject();
      // Sets initial property key validation objects for the consuming component.
      for (let validatorKey in this.validators) {
        if (!this.validators.hasOwnProperty(validatorKey)) continue;
          validationState[validatorKey] = this._createValidationStateObject(validatorKey);
          // Sets initial values for each validation type for a property key.
          for (let validationType in this.validators[validatorKey]) {
            if (!this.validators[validatorKey].hasOwnProperty(validationType)) continue;
            validationState[validatorKey][validationType] = true;
          }
      }
      return validationState;
    }
  }
  return AoflValidate;
};
