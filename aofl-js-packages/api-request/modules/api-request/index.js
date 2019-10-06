import FormatterManager from '../formatter-manager';
import {CacheManager, cacheTypeEnumerate} from '@aofl/cache-manager';

/**
 * ApiReqest class implementation.
 *
 * @summary api-request
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @memberof module:aofl-js/api-request-package
 *
 * @requires module:aofl-js/cache-manager-package
 * @requires module:aofl-js/api-request-package/src/formatter-manager
 */
class ApiRequest {
  /**
   * @readonly
   */
  static get DEFAULT_CACHE_NAMESPACE() {
    return 'ApiRequest';
  }

  /**
   * Creates an instance of ApiRequest.
   */
  constructor() {
    this.formatterManager = new FormatterManager();
    this.cacheManagers = {};

    this.addCacheManager('default');
  }
  /**
   * addformatter() adds a new format to formatter's list.
   *
   * @param {String} format name for the formatter
   * @param {Object} formatter formatter object
   */
  addFormatter(format, formatter) {
    this.formatterManager.addFormatter(format, formatter);
  }
  /**
   *
   * @param {String} namespace
   * @param {Number} expire
   */
  addCacheManager(namespace, expire) {
    if (this.cacheManagers.hasOwnProperty(namespace)) {
      throw new Error(`ApiRequest: Cache namespace ${namespace} already exists`);
    }
    this.cacheManagers[namespace] = new CacheManager(namespace, cacheTypeEnumerate.MEMORY, expire);
  }
  /**
   * Returns an existing cacheManager if it exists or creates a new one and assigns it to the
   * namespace.
   *
   * @param {String} namespace cache namespace
   * @param {Number} expire
   * @return {CacheManager}
   */
  getCacheManager(namespace, expire) {
    try {
      this.addCacheManager(namespace, expire);
    } catch (e) {}

    return this.cacheManagers[namespace];
  }
  /**
   * Update a cache managers expire time
   * @param {String} namespace
   * @param {Number} expire
   */
  updateCacheInterval(namespace, expire) {
    const manager = this.getCacheManager(namespace, expire);
    manager.expire = expire;
  }
  /**
   *
   *
   * @param {String} namespace
   */
  purgeCache(namespace) {
    if (typeof namespace === 'undefined') { // purge all
      for (const key in this.cacheManagers) {
        if (!this.cacheManagers.hasOwnProperty(key)) continue;
        this.cacheManagers[key].clear();
      }
    } else {
      this.cacheManagers[namespace].clear();
    }
  }

  /**
   * Makes a network call using fetch API.
   *
   * @param {String} url request url
   * @param {*} payload data
   * @param {String} format formatter name
   * @param {Boolean} fromCache fetch new data or return cached
   * @param {String} namespace cache manager namespace
   * @return {Promise}
   */
  request(url, payload, format, fromCache = true, namespace = 'default', expire) {
    const formatter = this.formatterManager.getFormatter(format);
    const cacheKey = url + JSON.stringify(payload);
    const cacheManager = this.getCacheManager(namespace, expire);
    const cacheResponse = cacheManager.getItem(cacheKey);
    if (fromCache && cacheResponse) {
      return cacheResponse;
    }

    const requestPromise = fetch(url, formatter.pack(payload))
      .then(formatter.unpack);

    cacheManager.setItem(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Clears cached data by namespace.
   *
   * @param {String} namespace cache namespace
   */
  clearCache(namespace) {
    const cacheManager = this.getCacheManager(namespace);
    cacheManager.clear();
  }
}

export default ApiRequest;
