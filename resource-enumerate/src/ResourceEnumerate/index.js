import {EnvironmentTypeEnumerate, ServerEnvironment} from '@aofl/server-environment';
import interpolate from '../interpolate';
import {CacheManager, CacheTypeEnumerate} from '@aofl/cache-manager';

/**
 *
 */
class ResourceEnumerate {
  /**
   *
   * @param {*} param0
   * @return {Promise}
   */
  init({apis, localRegex, stageRegex, localConfigPath, stageConfigPath}) {
    this.environment = ServerEnvironment.get(localRegex, stageRegex);
    this.apis = apis;
    this.memoryCache = new CacheManager('resource-enumname', CacheTypeEnumerate.MEMORY);

    if (this.environment !== EnvironmentTypeEnumerate.LIVE) {
      return this.updateApis(localConfigPath, stageConfigPath);
    }

    return Promise.resolve();
  }


  /**
   *
   * @param {*} apiNs
   * @return {Promise}
   */
  get(apiNs) {
    let api = this.apis[apiNs];

    if (typeof api === 'undefined') {
      throw new Error('no such api namespace');
    }

    if (typeof api.invalidateCache === 'function' && api.invalidateCache.call(null)) {
      this.memoryCache.clear();
    }
    let re = this.memoryCache.getItem(apiNs);
    if (re !== null && this.environment !== EnvironmentTypeEnumerate.DEV) {
      return Promise.resolve(re);
    }

    return fetch(api.url, api.requestOptions)
    .then((response) => {
      return response.json()
      .then((data) => {
        this.memoryCache.setItem(apiNs, data);
        return data;
      });
    });
  }

  /**
   *
   * @param {*} localConfigPath
   * @param {*} stageConfigPath
   * @return {Promise}
   */
  updateApis(localConfigPath, stageConfigPath) {
    let envPrefix = 'local';
    let path = localConfigPath;

    if (this.environment === EnvironmentTypeEnumerate.STAGE) {
      envPrefix = 'stage',
      path = stageConfigPath;
    }

    return fetch(path)
    .then((response) => {
      return response.json()
      .then((data) => {
        for (let apiNs in this.apis) {
          if (!this.apis.hasOwnProperty(apiNs)) continue;
          let api = this.apis[apiNs];
          let keyFn = api[envPrefix + 'ConfigKey'];
          let key = '';
          if (typeof keyFn === 'function') {
            key = keyFn();
          }

          if (key && typeof data[key] !== 'undefined') {
            let mapFn = api[envPrefix + 'Replace'];
            let map = {};
            if (typeof mapFn === 'function') {
              map = mapFn();
            }
            let host = interpolate(data[key], map);
            api.url = host;
          }
        }
      });
    });
  };
};

export default new ResourceEnumerate();
