/**
 * ValidationProperty implementation
 *
 * @summary validation property
 * @version 1.0.0
 * @requires module:aofl-js/form-validate-package/src/validation-function
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

import ValidationFunction from '../validation-function';

/**
 *
 */
class ValidationProperty {
  /**
   * Creates an instance of ValidationProperty.
   *
   * @param {Object} target
   * @param {Object} validators
   * @param {String} _propName
   */
  constructor(target, validators, _propName = '') {
    Object.defineProperty(this, 'resolve', {
      writable: true
    });
    Object.defineProperty(this, 'validateCompleteResolved', {
      writable: true
    });
    Object.defineProperty(this, 'validateCompletePromise', {
      writable: true
    });

    for (let key in validators) {
      /* istanbul ignore next */
      if (!validators.hasOwnProperty(key)) continue;
      /* istanbul ignore next */
      if (this.hasOwnProperty(key)) {
        throw new Error(`${key} is a reserved keyword and cannot be used as a validator name.`);
      }

      let propName = _propName; // @todo: move to object-utils
      if (propName.length === 0) {
        propName = key;
      } else {
        propName += '.' + key;
      }

      if (typeof validators[key] === 'function') {
        this[key] = new ValidationFunction(target, validators[key], propName);
      } else {
        this[key] = new ValidationProperty(target, validators[key], propName);
      }
    }

    this.reset();
  }

  /**
   *
   */
  reset() {
    this.validateCompletePromise = new Promise((resolve) => {
      this.resolve = resolve;
    });
    this.validateCompleteResolved = false;

    for (let key in this) {
      /* istanbul ignore next */
      if (!this.hasOwnProperty(key) ||
      !(this[key] instanceof ValidationProperty || this[key] instanceof ValidationFunction)) continue;

      this[key].reset();
    }
  }

  /**
   *
   * @readonly
   */
  get valid() {
    for (let key in this) {
      /* istanbul ignore next */
      if (!this.hasOwnProperty(key) ||
      !(this[key] instanceof ValidationProperty || this[key] instanceof ValidationFunction)) continue;

      if (this[key].valid === false) {
        return false;
      }
    }
    return true;
  }

  /**
   *
   * @readonly
   */
  get pending() {
    for (let key in this) {
      /* istanbul ignore next */
      if (!this.hasOwnProperty(key) ||
      !(this[key] instanceof ValidationProperty || this[key] instanceof ValidationFunction)) continue;

      if (this[key].pending === true) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @readonly
   */
  get observed() {
    for (let key in this) {
      /* istanbul ignore next */
      if (!this.hasOwnProperty(key) ||
      !(this[key] instanceof ValidationProperty || this[key] instanceof ValidationFunction)) continue;

      if (this[key].observed === false) {
        return false;
      }
    }
    return true;
  }

  /**
   *
   *
   */
  validate() {
    for (let key in this) {
      /* istanbul ignore next */
      if (!this.hasOwnProperty(key) ||
      !(this[key] instanceof ValidationProperty || this[key] instanceof ValidationFunction)) continue;

      this[key].validate();
    }
  }

  /**
   *
   * @readonly
   */
  get validateComplete() {
    if (this.pending && this.validateCompleteResolved) {
      this.validateCompleteResolved = false;
      this.validateCompletePromise = new Promise((resolve) => {
        this.resolve = resolve;
      });
    }

    const checkPendingPromises = () => {
      const promises = Object.keys(this).map((item) => this[item].validateComplete);
      Promise.all(promises)
      .then(() => {
        if (this.pending) {
          return checkPendingPromises();
        }

        this.resolve();
        this.validateCompleteResolved = true;
      });
    };

    checkPendingPromises();
    return this.validateCompletePromise;
  }

  /* istanbul ignore next */
  /**
   *
   * @return {Array}
   */
  getKeys() {
    const keys = ['valid', 'pending', 'observed'];
    for (let key in this) {
      /* istanbul ignore next */
      if (!this.hasOwnProperty(key)) continue;
      keys.push(key);
      keys.push(...this[key].getKeys());
    }
    return keys;
  }

  /* istanbul ignore next */
  /**
   * @return {String}
   */
  toString() {
    const keys = this.getKeys();
    return JSON.stringify(this, keys, 2);
  }
}

export default ValidationProperty;
