import {EnvironmentTypeEnumerate, ServerEnvironment} from '@aofl/server-environment';
import interpolate from '../interpolate';
import {CacheManager, CacheTypeEnumerate} from '@aofl/cache-manager';
import {Middleware} from '@aofl/middleware';

/**
 *
 */
class ResourceEnumerate extends Middleware {
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
   * @param {Boolean} forceNew
   * @return {Promise}
   */
  get(apiNs, forceNew = false) {
    let api = this.apis[apiNs];

    if (typeof api === 'undefined') {
      throw new Error('no such api namespace');
    }
    if (forceNew || (typeof api.invalidateCache === 'function' && api.invalidateCache.call(null))) {
      this.memoryCache.clear();
    }
    let re = this.memoryCache.getItem(apiNs);
    let request = {
      apiNs,
      cached: re !== null
    };

    let preMw = this.__iterateMiddleware(request, 'pre');
    let reResp = null;

    if (re !== null) {
      reResp = preMw.then((response) => Promise.resolve(re));
    } else {
      reResp = fetch(api.url, api.requestOptions)
      .then((response) => {
        return response.json()
        .then((data) => {
          return data;
        });
      });
      this.memoryCache.setItem(apiNs, reResp);
    }

    return reResp.then((response) => this.__iterateMiddleware(request, 'post', response));
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
      let contentType = response.headers.get('content-type');
      if (!contentType || contentType.indexOf('application/json') === -1) {
        return Promise.resolve();
      }
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
