import FormatterManager from '../formatter-manager';
import {CacheManager} from '@aofl/cache-manager';

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
  };

  /**
   * Creates an instance of ApiRequest.
   */
  constructor() {
    this.formatterManager = new FormatterManager();
    this.cacheManagers = {
      default: new CacheManager(ApiRequest.DEFAULT_CACHE_NAMESPACE)
    };
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
   * Returns an existing cacheManager if it exists or creates a new one and assigns it to the
   * namespace.
   *
   * @param {String} namespace cache namespace
   * @return {CacheManager}
   */
  getCacheManager(namespace) {
    if (!this.cacheManagers.hasOwnProperty(namespace)) {
      this.cacheManagers[namespace] = new CacheManager(namespace);
    }
    return this.cacheManagers[namespace];
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
  request(url, payload, format, fromCache = true, namespace = 'default') {
    const formatter = this.formatterManager.getFormatter(format);
    const cacheKey = url + JSON.stringify(payload);
    const cacheManager = this.getCacheManager(namespace);
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
