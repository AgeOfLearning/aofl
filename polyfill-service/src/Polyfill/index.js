import es6Promise from 'es6-promise';
es6Promise.polyfill();

/**
 * polyfill service
 */
class Polyfill {
  /**
   *
   * @param {Array} _polyfills list of polyfills
   */
  constructor(_polyfills) {
    this.polyfills = _polyfills;
  }

  /**
   * test if module is supported by browser
   * @param {String} _module name of module
   * @return {Boolean}
   */
  supported(_module) {
    let modulePath = _module.split('.');
    let obj = window;
    for (let i = 0; i < modulePath.length; i++) {
      if (!obj.hasOwnProperty(modulePath[i])) return false;
      obj = obj[modulePath[i]];
    }
    return true;
  }

  /**
   * Test if polyfill exists
   *
   * @param {String} _module name of polyfill
   * @return {Boolean}
   */
  exists(_module) {
    return this.polyfills.hasOwnProperty(_module);
  }

  /**
   * load polyfill
   * @param {String} _module name of polyfill to load
   * @return {Promise}
   */
  load(_module) {
    if (!this.supported(_module) && this.exists(_module)) {
      return this.polyfills[_module]();
    }
    return Promise.resolve();
  }

  /**
   * load all polyfills
   * @return {Promis}
   */
  loadAll() {
    let promises = [];

    for (let key in this.polyfills) {
      if (this.polyfills.hasOwnProperty(key)) {
        promises.push(this.load(key));
      }
    }

    return Promise.all(promises);
  }
};

export default Polyfill;
