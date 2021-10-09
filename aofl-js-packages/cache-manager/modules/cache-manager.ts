import {MemoryStorage} from './memory-storage.js';
import * as md5 from 'tiny-js-md5';

enum CacheType {
  MEMORY,
  LOCAL,
  SESSION
}

type Collection = {
  [key: string]: any
}

const STORAGE = {
  [CacheType.LOCAL]: localStorage,
  [CacheType.SESSION]: sessionStorage,
  [CacheType.MEMORY]: new MemoryStorage()
};

const MAX_SIGNED_INT = 2147483647;
/**
 * Provides a unified class for storing objects in Storage-like Objects. You can choose from
 * localStorage, sessionStorage and memoryStorage.
 */
class CacheManager {
  storage: MemoryStorage | Storage;
  storageType : CacheType;
  namespace: string;
  storedKeys: string[];
  interval: ReturnType<typeof setInterval> | null = null;
  /** @internal */
  private expireTimeout = 3600000;
  /**
   * Creates an instance of CacheManager.
   */
  constructor(namespace: string, storageType : CacheType = CacheType.MEMORY, expire = 3600000) {
    this.storage = STORAGE[storageType];
    this.storageType = storageType;
    this.namespace = namespace;
    this.storedKeys = this.getStoredKeys();
    this.expire = expire;
  }


  get expire() : number {
    return this.expireTimeout;
  }

  set expire(value : number) {
    this.expireTimeout = value;

    if (this.interval !== null) {
      clearInterval(this.interval);
    }

    if (value > 0 && value < MAX_SIGNED_INT) {
      this.interval = setInterval(() => this.removeExpired(), value);
    }
  }

  /**
   * The size read-only property of the Storage interface returns an integer representing the
   * number of data items stored in the Storage object.
   */
  get size() : number {
    const collection = this.getCollection();
    return Object.keys(collection).length;
  }

  /**
   * Returns keys controlled by the instance of CacheManager
   */
  getStoredKeys() : string[] {
    const keys = [];
    for (const key in this.storage) {
      if (!Object.hasOwnProperty.call(this.storage, key)) continue;
      if (key.indexOf(this.namespace + '_') === 0) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Returns the serialized key based on namespace
   */
  getNamespaceKey(key : string) {
    if (this.storedKeys.indexOf(key) > -1) {
      return key;
    }

    return this.namespace + '_' + (md5 as Function)(key);
  }

  /**
   * The setItem() method of the CacheManager interface, when passed a key name and value, will add
   * that key to the storage, or update that key's value if it already exists
   */
  setItem(key: string, value: unknown) {
    const obj = {
      t: Date.now(),
      v: value
    };

    const namespaceKey = this.getNamespaceKey(key);
    this.storedKeys.push(namespaceKey);

    if (this.storageType === CacheType.LOCAL || this.storageType === CacheType.SESSION) {
      const str = JSON.stringify(obj);
      this.storage.setItem(namespaceKey, str);
    } else {
      (this.storage as MemoryStorage).setItem(namespaceKey, obj);
    }
  }

  /**
   * The getItem() method of the CacheManager interface, when passed a key name, will return that
   * key's value or null if the key does not exist.
   *
   */
  getItem(key: string) : unknown {
    let obj = this.storage.getItem(this.getNamespaceKey(key));
    if (this.storageType === CacheType.LOCAL ||
    this.storageType === CacheType.SESSION) {
      obj = JSON.parse(obj);
    }
    if (obj !== null && Object.hasOwnProperty.call(obj, 't')) {
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
   */
  getCollection() : any {
    const collection : Collection = {};
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
   */
  removeItem(key : string) : void {
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
  clear() : void {
    for (let i = 0; i < this.storedKeys.length; i++) {
      this.storage.removeItem(this.storedKeys[i]);
    }
    this.storedKeys = [];
  }

  /**
   * The isExpired() method of the CacheManager interface, when invoked, checks if the given key
   * is expired.
   */
  private isExpired(key: string) : boolean {
    if (typeof this.expire !== 'number' || this.expire <= 0) {
      return false;
    }

    const namespaceKey = this.getNamespaceKey(key);
    let obj = this.storage.getItem(namespaceKey);

    if (this.storageType === CacheType.LOCAL ||
    this.storageType === CacheType.SESSION) {
      try {
        obj = JSON.parse(obj);
      } catch (e) {}
    }

    if (obj === null || obj.t < (Date.now() - this.expire)) { // expired
      return true;
    }
    return false;
  }

  /**
   * The removeExpired() method of the CacheManager interface, when invoked, Removes all expired
   * keys.
   */
  removeExpired() : void {
    for (let i = 0; i < this.storedKeys.length; i++) {
      if (this.isExpired(this.storedKeys[i])) {
        this.removeItem(this.storedKeys[i]);
      }
    }
  }
}

export {
  CacheManager,
  CacheType
};
