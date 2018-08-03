/**
 *
 */
class MemoryStorage {
  /**
   *
   */
  static clear() {
    for (let key in MemoryStorage) {
      if (MemoryStorage.hasOwnProperty(key)) {
        MemoryStorage.removeItem(key);
      }
    }
  }

  /**
   *
   *
   * @readonly
   * @static
   * @memberof MemoryStorage
   */
  static get length() {
    let length = 0;
    for (let key in MemoryStorage) {
      if (MemoryStorage.hasOwnProperty(key)) {
        length++;
      }
    }
    return length;
  }

  /**
   *
   * @param {String} key
   * @return {*}
   */
  static getItem(key) {
    if (MemoryStorage.hasOwnProperty(key)) {
      return MemoryStorage[key];
    }
    return null;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  static setItem(key, value) {
    MemoryStorage[key] = value;
  }

  /**
   * When passed a key name, will remove that key from the storage.
   *
   * @param {String} key
   */
  static removeItem(key) {
    MemoryStorage[key] = null;
    delete MemoryStorage[key];
  }
};

export default MemoryStorage;
