/**
 * @summary server-environment
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */


/**
 *
 *
 * @memberof module:@aofl/cache-manager
 */
class MemoryStorage {
  /**
   * The clear() method of the Storage interface, when invoked, clears all stored keys.
   */
  static clear() {
    for (const key in MemoryStorage) {
      /* istanbul ignore else */
      if (Object.hasOwnProperty.call(MemoryStorage, key)) {
        MemoryStorage.removeItem(key);
      }
    }
  }

  /**
   * The length read-only property of the Storage interface returns an integer representing the
   *  number of data items stored in the Storage object.
   *
   * @readonly
   * @type {Number}
   */
  static get size() {
    let length = 0;
    for (const key in MemoryStorage) {
      /* istanbul ignore else */
      if (Object.hasOwnProperty.call(MemoryStorage, key)) {
        length++;
      }
    }
    return length;
  }

  /**
   * The getItem() method of the Storage interface, when passed a key name, will return that key's
   * value or null if the key does not exist.
   *
   * @param {String} key The name of the key you want to retrieve the value of.
   * @return {*}
   */
  static getItem(key) {
    /* istanbul ignore else */
    if (Object.hasOwnProperty.call(MemoryStorage, key)) {
      return MemoryStorage[key];
    }
    return null;
  }

  /**
   * The setItem() method of the Storage interface, when passed a key name and value, will add
   * that key to the storage, or update that key's value if it already exists.
   *
   * @param {*} key The name of the key you want to create/update.
   * @param {*} value The value you want to give the key you are creating/updating.
   */
  static setItem(key, value) {
    MemoryStorage[key] = value;
  }

  /**
   * The removeItem() method of the Storage interface, when passed a key name, will remove that key
   * from the storage if it exists. If there is no item associated with the given key, this method
   * will do nothing.
   *
   * @param {String} key The name of the key you want to remove.
   */
  static removeItem(key) {
    MemoryStorage[key] = null;
    delete MemoryStorage[key];
  }
}

export {
  MemoryStorage
};
