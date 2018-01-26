/**
 *
 */
class MemoryStorage {
  static store = {};

  /**
   *
   */
  static clear() {
    store = {};
  }

  /**
   *
   * @param {String} key
   * @return {*}
   */
  static getItem(key) {
    if (store.hasOwnProperty(key)) {
      return store[key];
    }
    return null;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  static setItem(key, value) {
    store[key] = value;
  }

  /**
   * When passed a key name, will remove that key from the storage.
   *
   * @param {String} key
   */
  static removeItem(key) {
    delete store[key];
  }
};

export default MemoryStorage;
