import {cacheTypeEnumerate} from '../cache-type-enumerate';
import MemoryStorage from '../memory-storage';
import md5 from 'tiny-js-md5';

const STORAGE = {
  [cacheTypeEnumerate.LOCAL]: localStorage,
  [cacheTypeEnumerate.SESSION]: sessionStorage,
  [cacheTypeEnumerate.MEMORY]: MemoryStorage
};

const MAX_SIGNED_INT = 2147483647;

/**
 * Provides a unified class for storing objects in Storage-like Objects. You can choose from
 * localStorage, sessionStorage and memoryStorage.
 *
 * @summary cache-manager
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @memberof module:aofl-js/cache-manager-package
 *
 * @requires module:aofl-js/cache-manager-package/src/cache-type-enumerate
 * @requires module:aofl-js/cache-manager-package/src/memory-storage
 * @requires tiny-js-md5/md5
 */
class CacheManager {
  /**
   * Creates an instance of CacheManager.
   * @param {*} namespace used to group keys controlled by each instance since the starage objects are shared
   * @param {*} [storageType=cacheTypeEnumerate.MEMORY] memory, local or session
   * @param {number} [expire=3600000] cache expiration in ms
   */
  constructor(namespace, storageType = cacheTypeEnumerate.MEMORY, expire = 3600000) {
    this.storage = STORAGE[storageType];
    this.storageType = storageType;
    this.expire = expire;
    this.namespace = namespace;
    this.storedKeys = this.getStoredKeys();
    if (expire > 0 && expire < MAX_SIGNED_INT) {
      this.interval = setInterval(() => this.removeExpired(), expire);
    }
  }


  /**
   * The size read-only property of the Storage interface returns an integer representing the
   * number of data items stored in the Storage object.
   *
   * @readonly
   */
  get size() {
    const collection = this.getCollection();
    return Object.keys(collection).length;
  }

  /**
   * Returns keys controlled by the instance of CacheManager
   *
   * @return {Array}
   */
  getStoredKeys() {
    const keys = [];
    for (const key in this.storage) {
      if (!this.storage.hasOwnProperty(key)) continue;
      if (key.indexOf(this.namespace + '_') === 0) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Returns the serialized key based on namespace
   *
   * @param {String} key
   * @return {String}
   */
  getNamespaceKey(key) {
    if (this.storedKeys.indexOf(key) > -1) {
      return key;
    }

    return this.namespace + '_' + md5(key);
  }

  /**
   * The setItem() method of the CacheManager interface, when passed a key name and value, will add
   * that key to the storage, or update that key's value if it already exists
   *
   * @param {String} key A String containing the name of the key you want to create/update.
   * @param {*} value The value you want to give the key you are creating/updating.
   */
  setItem(key, value) {
    let obj = {
      t: Date.now(),
      v: value
    };

    if (this.storageType === cacheTypeEnumerate.LOCAL ||
    this.storageType === cacheTypeEnumerate.SESSION) {
      obj = JSON.stringify(obj);
    }

    const namespaceKey = this.getNamespaceKey(key);
    this.storage.setItem(namespaceKey, obj);
    this.storedKeys.push(namespaceKey);
  }

  /**
   * The getItem() method of the CacheManager interface, when passed a key name, will return that
   * key's value or null if the key does not exist.
   *
   * @param {String} key The name of the key you want to retrieve the value of
   * @return {*}
   */
  getItem(key) {
    let obj = this.storage.getItem(this.getNamespaceKey(key));
    if (this.storageType === cacheTypeEnumerate.LOCAL ||
    this.storageType === cacheTypeEnumerate.SESSION) {
      obj = JSON.parse(obj);
    }
    if (obj !== null && obj.hasOwnProperty('t')) {
      if (this.isExpired(key)) { // expired
        this.removeItem(key);
        return null;
      }
      return obj.v;
    }

    return obj;
  }

  /**
   * The getItem() method of the CacheManager interface, wen invoked, will return the key/value
   * pairs that that instance of CacheManager tracks.
   *
   * @return {Object}
   */
  getCollection() {
    const collection = {};
    this.storedKeys = this.getStoredKeys();
    for (let i = 0; i < this.storedKeys.length; i++) {
      if (this.isExpired(this.storedKeys[i])) continue;
      collection[this.storedKeys[i]] = this.getItem(this.storedKeys[i]);
    }
    return collection;
  }

  /**
   * The removeItem() method of the CacheManager interface, when passed a key name, will remove that
   * key from the storage if it exists. If there is no item associated with the given key, this
   * method will do nothing.
   *
   * @param {String} key The name of the key you want to remove
   */
  removeItem(key) {
    const namespaceKey = this.getNamespaceKey(key);
    const index = this.storedKeys.indexOf(namespaceKey);

    if (index > -1) {
      this.storage.removeItem(namespaceKey);
      this.storedKeys.splice(index, 1);
    }
  }

  /**
   * The clear() method of the CacheManager interface, when invoked, clears all stored keys
   */
  clear() {
    for (let i = 0; i < this.storedKeys.length; i++) {
      this.storage.removeItem(this.storedKeys[i]);
    }
    this.storedKeys = [];
  }

  /**
   * The isExpired() method of the CacheManager interface, when invoked, checks if the given key
   * is expired.
   *
   * @param {String} key The name of the key you want to check if is expired.
   * @return {Boolean}
   */
  isExpired(key) {
    if (typeof this.expire !== 'number' || this.expire <= 0) {
      return false;
    }

    const namespaceKey = this.getNamespaceKey(key);
    let obj = this.storage.getItem(namespaceKey);
    if (this.storageType === cacheTypeEnumerate.LOCAL ||
    this.storageType === cacheTypeEnumerate.SESSION) {
      obj = JSON.parse(obj);
    }
    if (obj.t < (Date.now() - this.expire)) { // expired
      return true;
    }
    return false;
  }

  /**
   * The removeExpired() method of the CacheManager interface, when invoked, Removes all expired
   * keys.
   */
  removeExpired() {
    for (let i = 0; i < this.storedKeys.length; i++) {
      if (this.isExpired(this.storedKeys[i])) {
        this.removeItem(this.storedKeys[i]);
      }
    }
  }

  /**
   * The destruct() method of the CacheManager interface, when invoked, resets all instance
   * variables and clears expire interval.
   */
  destruct() {
    clearInterval(this.interval);
    this.namespace = null;
    this.storage = null;
    this.storageType = null;
    this.expire = null;
    this.storedKeys = null;
    this.interval = null;
  }
}

export default CacheManager;
