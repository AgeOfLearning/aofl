/**
 *
 */
class MemoryStorage implements Storage {
  [index: string]: any;
  /**
   * Returns an integer representing the number of data items stored in the Storage object.
   */
  get length() {
    let length = 0;
    for (const key in this) {
      /* istanbul ignore else */
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        length++;
      }
    }
    return length;
  }
  /**
   * When passed a number n, this method will return the name of the nth key in the storage.
   */
  key(ndx : number) : string|null {
    let i = 0;
    for (const key in this) {
      /* istanbul ignore else */
      if (!Object.prototype.hasOwnProperty.call(this, key)) continue
      if (i === ndx) {
        return key;
      }
      i += 1;
    }
    return null;
  }
  /**
   * When passed a key name, will return that key's value.
   */
  getItem(key: string) : any {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      return this[key];
    }
    return null;
  }
  /**
   * When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
   */
  setItem(key: string, value: any) {
    this[key] = value;
  }
  /**
   * When passed a key name, will remove that key from the storage.
   */
  removeItem(key: string) {
    this[key] = null;
    delete this[key];
  }
  /**
   * When invoked, will empty all keys out of the storage.
   */
  clear() {
    for (const key in this) {
      /* istanbul ignore else */
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this.removeItem(key);
      }
    }
  }
}

export {
  MemoryStorage
};
