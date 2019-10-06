/**
 * @summary register-callback
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */


/**
 * RegisterCallback class. It allows callback functions to be registered and called in
 * series when registerCallbackinstance.next is called.
 *
 * @memberof module:@aofl/register-callback
 */
class RegisterCallback {
  /**
   * Creates an instance of RegisterCallback.
   */
  constructor() {
    this.callbacks = [];
  }

  /**
   * When register() is invoked, it adds next and error functions to the callbacks list.
   *
   * @param {Function} cb The callback function is invoked when registerCallbackInstance.next is called.
   * @return {Function}
   */
  register(cb) {
    this.callbacks.push(cb);

    const unsubscribe = () => {
      if (unsubscribe.executed) { return; }
      Object.defineProperty(unsubscribe, 'executed', {
        value: true
      });

      const index = this.callbacks.indexOf(cb);
      /* istanbul ignore else */
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };

    return unsubscribe;
  }

  /**
   * When next() is invoked, it calls all functions in this.callbacks list and passes error and args
   * to each function.
   *
   * @param {*} [err=null]
   * @param {*} args
   */
  next(err = null, ...args) {
    for (let i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i].call(null, err, ...args);
    }
  }
}

export default RegisterCallback;
