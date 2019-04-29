import {CacheManager, cacheTypeEnumerate} from '@aofl/cache-manager';

const EXPIRE_90_DAYS = 7776000000;
const TRAILING_SLASH_REGEX = /\/$/;
const gen = function* gen(arr) {
  yield* arr;
};
const PUBLIC_PATH = (__webpack_public_path__).replace(TRAILING_SLASH_REGEX, ''); // eslint-disable-line
const PUBLIC_PATH_REGEX = new RegExp(`^${PUBLIC_PATH}`);

/**
 * Produces an updated route config based on a rotation config
 * @summary rotations
 * @version 2.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @memberof module:aofl-js/rotations-package
 *
 * @requires module:aofl-js/cache-manager-package
 */
class Rotations {
  /**
   * @param {String} cacheNamespace
   * @param {Object} routesConfig
   * @param {Object} rotationConfig
   * @param {Object} rotationConditions
   */
  constructor(cacheNamespace, routesConfig, rotationConfig, rotationConditions, expires = EXPIRE_90_DAYS) {
    this.routesConfig = routesConfig;
    this.rotationConfig = rotationConfig;
    this.rotationConditions = rotationConditions;
    this.cache = new CacheManager(cacheNamespace, cacheTypeEnumerate.LOCAL, expires);
    this.qualification = {};
    this.weightRanges = {};
  }
  /**
   * @private
   * @param {String} conditionId
   */
  async qualifies(conditionId) {
    if (typeof this.qualification[conditionId] !== 'undefined') {
      return this.qualification[conditionId];
    }

    const conditionName = this.rotationConfig.conditions[conditionId];

    if (typeof this.rotationConditions[conditionName] === 'function') {
      const qualifies = Promise.resolve(await this.rotationConditions[conditionName]());
      this.qualification[conditionId] = qualifies;
      return qualifies;
    }

    return false;
  }
  /**
   *
   * @private
   * @param {String} qualificationOrder
   * @return {Promise}
   */
  getQualifyingId(qualificationOrder) {
    const qualificationIterator = gen(qualificationOrder);
    const qualify = async () => {
      const nextQ = qualificationIterator.next();
      if (nextQ.done) {
        throw new Error('No matching conditions');
      }
      const conditionId = nextQ.value;
      const qualifies = await this.qualifies(conditionId);
      if (qualifies) {
        return conditionId;
      }
      return qualify();
    };
    return qualify();
  }
  /**
   * @param {String} qualificationId
   * @private
   * @return {Array}
   */
  getWeightRange(qualificationId) {
    const weights = this.rotationConfig.weights[qualificationId];

    if (typeof weights === 'undefined') {
      throw new Error('Invalid weights for qualifying rotation');
    }

    const weightRanges = this.weightRanges[qualificationId];
    if (typeof weightRanges !== 'undefined') {
      return weightRanges;
    }

    const range = [];
    for (const key in weights) {
      /* istanbul ignore next */
      if (!weights.hasOwnProperty(key)) continue;
      let i = 0;
      while (i++ < weights[key]) {
        range.push(key);
      }
    }

    this.weightRanges[qualificationId] = range;
    return range;
  }
  /**
   * @param {String} qualificationId
   * @private
   * @return {String}
   */
  getVersion(qualificationId) {
    const weights = this.getWeightRange(qualificationId);
    return weights[Math.floor(Math.random() * Math.floor(weights.length))];
  }
  /**
   * @param {String} rotation
   * @param {String} path
   * @private
   * @return {Object}
   */
  findRotationRoute(rotation, path) {
    const routes = this.routesConfig[rotation];
    if (typeof routes === 'undefined') {
      throw new Error('Rotation not found');
    }

    for (let i = 0; i < routes.length; i++) {
      if (routes[i].path === path) {
        return routes[i];
      }
    }

    throw new Error('Rotation route not found');
  }
  /**
   * @param {String} path
   * @private
   * @return {Object}
   */
  getCachedRotation(path) {
    const cachedResult = this.cache.getItem(path);

    if (cachedResult === null) {
      return null;
    }

    const qualifyingId = cachedResult.qualifyingId;
    const version = cachedResult.version;
    const weights = this.rotationConfig.weights[qualifyingId];
    const rotation = this.rotationConfig.versions[version];

    if (typeof weights !== 'undefined' && typeof rotation !== 'undefined' &&
    typeof this.routesConfig[rotation] !== 'undefined') {
      try {
        this.findRotationRoute(rotation, path);

        return {
          qualifyingId,
          version
        };
      } catch (e) {}
    }

    return null;
  }
  /**
   * @param {String} mainRoutes
   * @return {Promise} resolves to a route configuration Array of route objects
   */
  async getRoutes(mainRoutes = 'routes') {
    const routes = [];
    const routesIterator = gen(this.routesConfig[mainRoutes]);

    const qualifyRoutes = async () => {
      const next = routesIterator.next();
      if (next.done) {
        return routes;
      }

      const route = next.value;
      const routePath = route.path.replace(PUBLIC_PATH_REGEX, '').replace(TRAILING_SLASH_REGEX, '');
      const qualificationOrder = this.rotationConfig.qualification_order[routePath] ||
        this.rotationConfig.qualification_order[routePath + '/'];

      if (typeof qualificationOrder === 'undefined') {
        const qr = await qualifyRoutes();
        return qr;
      }

      try {
        let qualifyingId = 0;
        let version = '';
        const cachedRotation = this.getCachedRotation(route.path);

        if (cachedRotation !== null) {
          qualifyingId = cachedRotation.qualifyingId;
          version = cachedRotation.version;
        } else {
          qualifyingId = await this.getQualifyingId(qualificationOrder);
          version = this.getVersion(qualifyingId);
        }
        const rotation = this.rotationConfig.versions[version];
        if (typeof rotation === 'undefined') {
          throw new Error('Version does not exist');
        }
        routes.push(this.findRotationRoute(rotation, route.path));
        if (cachedRotation === null) {
          this.cache.setItem(route.path, {qualifyingId, version});
        }
      } catch (e) { // no qualifying rotation
        routes.push(route);
      }
      await qualifyRoutes();
    };

    await qualifyRoutes();
    return routes;
  }
}

export {
  Rotations
};
