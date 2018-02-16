/**
 *
 */
class MemoryStorage {
  static store = {};

  /**
   *
   */
  static clear() {
    MemoryStorage.store = {};
  }

  /**
   *
   * @param {String} key
   * @return {*}
   */
  static getItem(key) {
    if (MemoryStorage.store.hasOwnProperty(key)) {
      return MemoryStorage.store[key];
    }
    return null;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  static setItem(key, value) {
    MemoryStorage.store[key] = value;
  }

  /**
   * When passed a key name, will remove that key from the storage.
   *
   * @param {String} key
   */
  static removeItem(key) {
    delete MemoryStorage.store[key];
  }
};

export default MemoryStorage;
