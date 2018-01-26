/**
 *
 */
class RegisterCallback {
  /**
   *
   */
  constructor() {
    this.callbacks = {
      next: [],
      error: []
    };
  }

  /**
   *
   * @param {*} type
   * @param {*} fn
   */
  __addCb(type, fn) {
    if (this.callbacks[type].indexOf(fn) === -1) {
      this.callbacks[type].push(fn);
    }
  }

  /**
   *
   * @param {*} type
   * @param {*} fn
   */
  __removeCb(type, fn) {
    let index = this.callbacks[type].indexOf(fn);
    this.callbacks[type].splice(index, 1);
  }

  /**
   *
   * @param {*} next
   * @param {*} error
   * @return {Function}
   */
  register(next, error) {
    if (typeof next === 'function') {
      this.__addCb('next', next);
    }

    if (typeof error === 'function') {
      this.__addCb('error', error);
    }

    return () => {
      this.__removeCb('next', next);
      this.__removeCb('error', error);
    };
  }

  /**
   *
   * @param {*} payload
   */
  next(payload) {
    for (let i = 0; i < this.callbacks.next.length; i++) {
      this.callbacks.next[i](payload);
    }
  }

  /**
   *
   * @param {*} payload
   */
  error(payload) {
    for (let i = 0; i < this.callbacks.error.length; i++) {
      this.callbacks.error[i](payload);
    }
  }
}

export default RegisterCallback;
