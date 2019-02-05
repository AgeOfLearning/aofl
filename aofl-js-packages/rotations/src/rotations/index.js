import {CacheManager, cacheTypeEnumerate} from '@aofl/cache-manager';

const EXPIRE_90_DAYS = 7776000000;
/**
 * Produces an updated route config based on a rotation config
 * @summary rotations
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @memberof module:aofl-js/rotations-package
 *
 * @requires module:aofl-js/cache-manager-package
 */
class Rotations {
  /**
   * @param {String} cacheNamespace
   * @param {Object} routeConfig
   * @param {Object} rotationConfig
   * @param {Object} rotationConditions
   */
  constructor(cacheNamespace, routeConfig, rotationConfig, rotationConditions) {
    this.routeConfig = Object.assign({}, routeConfig);
    this.rotationConfig = Object.assign({}, rotationConfig);
    this.rotationConditions = Object.assign({}, rotationConditions);
    this.cache = new CacheManager(cacheNamespace, cacheTypeEnumerate.LOCAL, EXPIRE_90_DAYS); // expires in 90 days
  }

  /**
   *
   * @description Simple generic array generator
   * @param {Array} arr
   */
  * gen(arr) {
    yield* arr;
  }

  /**
   *
   * @param {String} rotationName
   * @return {Promise}
   */
  qualifies(rotationName) {
    return Promise.resolve(this.rotationConditions[rotationName]());
  }

  /**
   *
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   *
   * @param {Object} versions
   * @return {Number}
   */
  getWeightsTotal(versions) {
    let total = 0;

    for (const version in versions) {
      /* istanbul ignore if */
      if (!versions.hasOwnProperty(version)) continue;
      total += Number(versions[version]);
    }

    return total;
  }

  /**
   *
   * @param {Object} versions
   * @return {Array}
   */
  createVersionRanges(versions) {
    const versionRanges = [];
    let startRange = 0;
    // Weights need to be converted into a percentage
    // Weight percentage = weight / weights total
    const weightTotal = this.getWeightsTotal(versions);
    for (const version in versions) {
      /* istanbul ignore if */
      if (!versions.hasOwnProperty(version)) continue;
      const weight = versions[version];
      const pct = Math.round(Number(weight) / weightTotal * 100);
      const range = Number(startRange) + pct;
      startRange += range;
      versionRanges.push({
        version,
        range
      });
    }
    return versionRanges;
  }

  /**
   *
   * @param {Object} route
   * @return {Promise} resolves to {Number} selectedRotationId
   */
  getQualifyingRotation(route) {
    const promises = [];
    let rotationIds = [];
    let selectedRotationId = null;
    return new Promise((resolve, reject) => {
      rotationIds = this.rotationConfig.page_rotations[route.path];
      if (rotationIds) {
        for (let i = 0; i < rotationIds.length; i++) {
          promises.push(this.qualifies(this.rotationConfig.rotation_id_keyname_map[rotationIds[i]]));
        }
        Promise.all(promises).then((results) => {
          for (let i = 0; i < results.length; i++) {
            if (results[i] === true) {
              // Order of promises is preserved so the promise matches the order of rotationIds
              selectedRotationId = rotationIds[i];
              break;
            }
          }
          resolve(selectedRotationId);
        });
      } else {
        reject('No matching rotations ids for ' + route && route.path);
      }
    });
  }

  /**
   * @description Returns a rotation view string based on its weighted value
   * @param {Number} selectedRotationId
   * @return {String}
   */
  chooseWeightedVariant(selectedRotationId) {
    let selectedRotation;
    const versions = this.createVersionRanges(this.rotationConfig.rotation_versions[selectedRotationId]);
    const randomVal = Math.round(Math.random()*100);
    for (let i = 0; i < versions.length; i++) {
      if ((randomVal < versions[i].range) || (i + 1 === versions.length)) {
        selectedRotation = versions[i].version;
        break;
      }
    }
    return selectedRotation;
  }

  /**
   *
   * @param {Array} routes
   * @param {String} selectedRotation
   * @param {String} path
   * @return {Array}
   */
  replaceRoute(routes, selectedRotation, path) {
    let route = null;
    for (let i = 0; i < this.routeConfig[selectedRotation].length; i++) {
      const configRoute = this.routeConfig[selectedRotation][i];
      if (configRoute.path === path) {
        route = configRoute;
        break;
      }
    }

    for (let i = 0; i < routes.length; i++) {
      if (routes[i].path === route.path) {
        routes = [
          ...routes.slice(0, i),
          route,
          ...routes.slice(i + 1)
        ];
        break;
      }
    }
    return routes;
  }

  /**
   *
   * @return {Array}
   */
  uniqueRoutes() {
    const cachedPaths = [];
    const uniqueRoutes = [];
    const addRoute = (route) => {
      if (cachedPaths.indexOf(route.path) === -1) {
        uniqueRoutes.push(route);
        cachedPaths.push(route.path);
      }
    };

    if (typeof this.routeConfig.routes !== 'undefined') {
      for (let i = 0; i < this.routeConfig.routes.length; i++) {
        addRoute(this.routeConfig.routes[i]);
      }
    }
    for (const key in this.routeConfig) {
      /* istanbul ignore if */
      if (!this.routeConfig.hasOwnProperty(key) || key === 'routes') continue;
      for (let i = 0; i < this.routeConfig[key].length; i++) {
        const route = this.routeConfig[key][i];
        addRoute(route);
      }
    }
    return uniqueRoutes;
  }

  /**
   *
   * @return {Promise} resolves to a route configuration Array of route objects
   */
  getRoutes() {
    return new Promise((resolve) => {
      if (window.aofljsConfig && window.aofljsConfig.prerender) { // @todo: find better solution
        return resolve(this.routeConfig.routes);
      }
      const routes = this.uniqueRoutes();
      const iterRoutes = this.gen(routes);
      let route = {};
      const routeConfig = this.routeConfig.routes;
      let rotationId;
      // this.cache.clear();
      const pushRoutes = (routeConfig=[]) => {
        const next = iterRoutes.next();
        let selectedRotation = '';
        if (next.done === true) {
          resolve(routeConfig);
        } else {
          route = next.value;
          this.getQualifyingRotation(route).then((selectedRotationId) => {
            selectedRotation = this.cache.getItem(selectedRotationId);
            if (selectedRotation === null) {
              selectedRotation = this.chooseWeightedVariant(selectedRotationId);
              this.cache.setItem(selectedRotationId, selectedRotation);
            }
            rotationId = this.rotationConfig.rotation_version_page_group_version_map[selectedRotation];
            routeConfig = this.replaceRoute(routeConfig, rotationId, route.path);
            pushRoutes(routeConfig);
          })
            .catch(() => {
            // no matching rotation, pass on, also catches errors
              pushRoutes(routeConfig);
            });
        }
      };
      pushRoutes(routeConfig);
    });
  }
}

export default Rotations;
