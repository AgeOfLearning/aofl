import CACHE_TYPE_ENUMERATE from '../CacheTypeEnumerate';
import MemoryStorage from '../MemoryStorage';

const STORAGE = {
  [CACHE_TYPE_ENUMERATE.LOCAL]: localStorage,
  [CACHE_TYPE_ENUMERATE.SESSION]: sessionStorage,
  [CACHE_TYPE_ENUMERATE.MEMORY]: MemoryStorage
};

/**
 *
 */
class CacheManager {
  /**
   *
   * @param {String} namespace
   * @param {Number} storageType
   * @param {Number} expire
   */
  constructor(namespace, storageType = CACHE_TYPE_ENUMERATE.MEMORY, expire = 3600000) {
    this.storage = STORAGE[storageType];
    this.expire = expire;
    this.storedKeys = [];
    this.interval = setInterval(this.removeExpired, expire);
  }

  /**
   *
   * @param {String} key
   * @return {String}
   */
  getNamespaceKey(key) {
    return this.namespace + '_' + key;
  }

  /**
   *
   * @param {String} key
   * @param {*} value
   */
  setItem(key, value) {
    let obj = {
      t: Date.now(),
      v: value
    };
    let namespaceKey = this.getNamespaceKey(key);
    this.storage.setItem(namespaceKey, obj);
    this.storedKeys.push(namespaceKey);
  }

  /**
   *
   * @param {String} key
   * @return {*}
   */
  getItem(key) {
    let obj = this.storage.getItem(this.getNamespaceKey(key));
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
   * @param {String} key
   */
  removeItem(key) {
    let namespaceKey = this.getNamespaceKey(key);
    let index = this.storedKeys.indexOf(namespaceKey);

    this.storage.removeItem(namespaceKey);
    this.namespaceKey.splice(index, 1);
  }

  /**
   *
   */
  clear() {
    for (let i = 0; i < this.storedKeys.length; i++) {
      this.removeItem(this.storedKeys[i]);
    }
  }

  /**
   *
   * @param {String} key
   * @return {Boolean}
   */
  isExpired(key) {
    let namespaceKey = this.getNamespaceKey(key);
    let obj = this.storage.getItem(namespaceKey);

    if (obj.t < (Date.now() - this.expire)) { // expired
      return true;
    }
    return false;
  }

  /**
   *
   */
  removeExpired() {
    for (let i = 0; i < this.storedKeys.length; i++) {
      if (this.isExpired(this.storedKeys[i])) {
        this.removeItem(this.storedKeys[i]);
      }
    }
  }

  /**
   *
   */
  destruct() {
    clearInterval(this.interval);
    this.namespace = null;
    this.storage = null;
    this.expire = null;
    this.storedKeys = null;
    this.interval = null;
  }
}

export default CacheManager;
export {
  CACHE_TYPE_ENUMERATE
};
