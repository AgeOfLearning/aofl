import FormatterManager from '../FormatterManager';
import {CacheManager} from '@aofl/cache-manager';
/**
 *
 */
class ApiRequest {
  static DEFAULT_CACHE_NAMESPACE = 'ApiRequest';
  /**
   *
   */
  constructor() {
    this.formatterManager = new FormatterManager();
    this.cacheManagers = {
      default: new CacheManager(ApiRequest.DEFAULT_CACHE_NAMESPACE)
    };
  }
  /**
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
   * @return {CacheManager}
   */
  getCacheManager(namespace) {
    if (this.cacheManagers.hasOwnProperty(namespace)) {
      return this.cacheManagers[namespace];
    }
    this.cacheManagers[namespace] = new CacheManager(namespace);
  }

  /**
   * makes XHR request
   *
   * @param {String} url request url
   * @param {*} payload data
   * @param {String} format formatter name
   * @param {Boolean} cache fetch new data or return cached
   * @param {String} namespace cache manager namespace
   * @return {Promise}
   */
  request(url, payload, format, cache = true, namespace = 'default') {
    let formatter = this.formatterManager.getFormmatter(format);
    let cacheKey = url + JSON.stringify(payload);
    let cacheManager = this.getCacheManager(namespace);
    let cacheResponse = cacheManager.getItem(cacheKey);

    if (cache && cacheResponse) {
      return cacheResponse;
    }

    return fetch(url, formatter.pack(payload))
    .then(formatter.unpack)
    .then((response) => {
      cacheManager.setItem(cacheKey, response);
      return response;
    });
  }

  /**
   * clears cached data by namespace
   *
   * @param {String} namespace cache manager namespace
   */
  clearCache(namespace) {
    let cacheManager = this.getCacheManager(namespace);
    cacheManager.clear();
  }
}

export default ApiRequest;
