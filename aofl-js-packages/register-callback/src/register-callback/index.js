/**
 * RegisterCallback class. It allows callback functions to be registered and called in
 * series when registerCallbackinstance.next is called.
 *
 * @summary register-callback
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @memberof module:aofl-js/register-callback-package
 */
class RegisterCallback {
  /**
   * Creates an instance of RegisterCallback.
   */
  constructor() {
    this.callbacks = {
      next: [],
      error: []
    };
  }

  /**
   * When addCB() is invoked it adds a function to the list of callbacks.
   *
   * @param {String} type next|error callback type
   * @param {Function} fn callback function
   * @private
   */
  addCb(type, fn) {
    if (this.callbacks[type].indexOf(fn) === -1) {
      this.callbacks[type].push(fn);
    }
  }

  /**
   * When removeCB() is invoked it removes a function to the list of callbacks.
   *
   * @param {String} type next|error callback type
   * @param {Function} fn callback function
   * @private
   */
  removeCb(type, fn) {
    let index = this.callbacks[type].indexOf(fn);
    if (index > -1) {
      this.callbacks[type].splice(index, 1);
    }
  }

  /**
   * When register() is invoked, it adds next and error functions to the callbacks list.
   *
   * @param {Function} next The next callback function is invoked when registerCallbackInstance.next is called.
   * @param {Function} error The error callback function is invoked when registerCallbackInstance.error is called.
   * @return {Function}
   */
  register(next, error) {
    if (typeof next === 'function') {
      this.addCb('next', next);
    }

    if (typeof error === 'function') {
      this.addCb('error', error);
    }

    const unsubscribe = () => {
      if (unsubscribe.executed) return;
      Object.defineProperty(unsubscribe, 'executed', {
            value: true
      });

      this.removeCb('next', next);
      this.removeCb('error', error);
    };

    return unsubscribe;
  }

  /**
   * When next() is invoked, it calls all functions in this.callbacks.next list and passes payload
   * to each function.
   *
   * @param {*} payload This is the payload that is passed to each next callback function.
   */
  next(payload) {
    for (let i = 0; i < this.callbacks.next.length; i++) {
      this.callbacks.next[i](payload);
    }
  }

  /**
   * When error() is invoked, it calls all functions in this.callbacks.error list and passes payload
   * to each function.
   *
   * @param {*} payload This is the payload that is passed to each error callback function.
   */
  error(payload) {
    for (let i = 0; i < this.callbacks.error.length; i++) {
      this.callbacks.error[i](payload);
    }
  }
}

export default RegisterCallback;
