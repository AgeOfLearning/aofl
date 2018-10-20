/**
 * ValidationFunction implementation
 *
 * @summary validation function
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
class ValidationFunction {
  /**
   * Creates an instance of ValidationFunction.
   *
   * @param {Object} target
   * @param {Object} validatorFn
   * @param {String} path
   */
  constructor(target, validatorFn, path) {
    Object.defineProperties(this, {
      target: {
        value: target
      },
      propName: {
        value: path
      },
      resolve: {
        writable: true
      },
      cachedPromise: {
        writable: true
      },
      validateCompletePromise: {
        writable: true
      },
      valid: {
        writable: true
      },
      observed: {
        writable: true
      },
      pending: {
        writable: true
      },
      validatorFn: {
        value: validatorFn
      }
    });

    this.reset();
  }

  /**
   *
   */
  reset() {
    this.cachedPromise = null;
    this.resolve = null;
    this.valid = true;
    this.observed = false;
    this.pending = false;
    this.validateCompletePromise = null;
  }

  /**
   *
   *
   */
  validate() {
    this.observed = true;
    let target = this.target; // @todo: move to object utils
    const propChain = this.propName.split('.');

    for (let i = 0; i < propChain.length - 1; i++) {
      target = target[propChain[i]];
    }

    const promise = Promise.resolve(this.validatorFn(target));

    this.cachedPromise = promise;

    if (this.pending === false) {
      this.validateCompletePromise = new Promise((resolve) => {
        this.resolve = resolve;
      });
    }

    this.pending = true;
    promise
    .then((valid) => {
      if (this.cachedPromise === promise) { // latest update
        this.valid = valid;
        this.pending = false;
        this.resolve();
        this.target.requestUpdate();
      }
    });
  }

  /**
   *
   *
   */
  get validateComplete() {
    return this.validateCompletePromise;
  }

  /* istanbul ignore next */
  /**
   *
   * @return {Array}
   */
  getKeys() {
    const keys = ['valid', 'pending', 'observed'];
    for (const key in this) {
      if (!this.hasOwnProperty(key)) continue;
      keys.push(key);
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

export default ValidationFunction;
