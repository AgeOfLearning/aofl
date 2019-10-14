/**
 * @summary resource-enumerate
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {environmentTypeEnumerate} from '@aofl/server-environment';
import {Middleware} from '@aofl/middleware';
import {ApiRequest} from '@aofl/api-request';


/**
 * Resource enumerate is a special case API call that returns the interface of
 * the API code in a single endpoint. The response can contain server time,
 * paths to resources, and other information based on application needs. An
 * advantage of this technique is that it eliminates the need to hardcode paths\urls.
 *
 * @memberof module:@aofl/resource-enumerate
 */
class ResourceEnumerate {
  /**
   * Creates an instance of ResourceEnumerate.
   *
   * @param {String} environment
   */
  constructor(environment) {
    this.environment = environment;
    this.ready = new Promise((resolve) => { this.resolve = resolve; });
    this.middlewareInstance = new Middleware('before', 'after');
    this.apiRequestInstance = new ApiRequest();
  }

  /**
   *
   *
   * @readonly
   * @type {String}
   */
  static get NAMESPACE() {
    return 'resource-enumerate';
  }

  /**
   * init() updates apis.url based on supplied config object.
   *
   * @param {Object} {apis, developmentConfig, stageConfig}
   * @param {Boolean} [skipEnvironmentCheck=true] skip dev/stage config process
   * @return {Promise}
   */
  async init({apis, developmentConfig, stageConfig}, skipEnvironmentCheck = false) {
    this.apis = apis;

    for (const apiNs in this.apis) {
      /* istanbul ignore next */
      if (!Object.hasOwnProperty.call(this.apis, apiNs)) continue;
      const api = this.apis[apiNs];
      this.apiRequestInstance.addFormatter(apiNs, {
        pack() {
          return api.requestOptions || {};
        },
        unpack(response) {
          return response.json();
        }
      });
    }

    if (skipEnvironmentCheck === false && this.environment !== environmentTypeEnumerate.PROD) {
      await this.updateApis(developmentConfig, stageConfig);
      this.resolve();
      return this.ready;
    }

    this.resolve();
    return this.ready;
  }

  /* istanbul ignore next */
  /**
   * before hook. Allows to execute some logic right before the network call is made.
   *
   * @param {function} fn
   */
  before(fn) {
    this.middlewareInstance.use(fn, 'before');
  }

  /* istanbul ignore next */
  /**
   * after hook. Allows to execute some logic immediately after the network call is made.
   *
   * @param {Function} fn
   */
  after(fn) {
    this.middlewareInstance.use(fn, 'after');
  }

  /**
   * get() returns a promise that once resolved contains the payload from the resource enumerate
   * call.
   *
   * @param {String} apiNs
   * @param {Boolean} _fromCache
   * @return {Promise}
   */
  async get(apiNs, _fromCache = true) {
    await this.ready;
    const api = this.apis[apiNs];
    let fromCache = _fromCache;

    if (typeof api === 'undefined') {
      throw new TypeError(`${apiNs} is not a valid api namespace.`);
    }

    if (!fromCache || (typeof api.invalidateCache === 'function' && api.invalidateCache.call(null))) {
      this.apiRequestInstance.clearCache(ResourceEnumerate.NAMESPACE);
      fromCache = false;
    }

    const cacheManager = this.apiRequestInstance.getCacheManager(ResourceEnumerate.NAMESPACE);
    const re = cacheManager.getItem(api.url + JSON.stringify(''));
    const request = {
      namespace: apiNs,
      cached: re !== null
    };

    await this.middlewareInstance.iterateMiddleware(request, 'before');
    let reResp = null;

    if (re !== null) {
      reResp = re;
    } else {
      reResp = this.apiRequestInstance
        .request(api.url, '', apiNs, fromCache, ResourceEnumerate.NAMESPACE);
    }

    return reResp.then((response) => this.middlewareInstance.iterateMiddleware(request, 'after', response));
  }

  /**
   * updateApis() updates the api url of each namespace based on the config functions.
   *
   * @private
   * @param {*} developmentConfig
   * @param {*} stageConfig
   * @return {Promise}
   */
  updateApis(developmentConfig, stageConfig) {
    let configFn = developmentConfig;
    if (this.environment === environmentTypeEnumerate.STAGE) {
      configFn = stageConfig;
    }

    return configFn()
      .then((configModule) => {
        for (const apiNs in this.apis) {
        /* istanbul ignore next */
          if (!Object.hasOwnProperty.call(this.apis, apiNs)) continue;
          const api = this.apis[apiNs];
          let variables = {};
          if (typeof api[this.environment + 'Variables'] === 'function') {
            variables = api[this.environment + 'Variables'].call(null);
          }
          api.url = configModule.default(apiNs, variables);
        }
      });
  }
}

export {
  ResourceEnumerate
};
