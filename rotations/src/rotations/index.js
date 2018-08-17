import {CacheManager, CacheTypeEnumerate} from '@aofl/cache-manager';

/**
 *
 * @description Simple generic array generator
 * @param {Array} arr
 */
const gen = function* gen(arr) {
  yield* arr;
};

/**
 * @description Produces an updated route config based on a rotation config
 */
class Rotations {
  /**
   * @param {String} cacheNamespace
   * @param {Object} routeConfig
   * @param {Object} rotationConfig
   * @param {Object} rotationConditions
   */
  constructor(cacheNamespace, routeConfig, rotationConfig, rotationConditions) {
    this.routeConfig = routeConfig;
    this.rotationConfig = rotationConfig;
    this.rotationConditions = rotationConditions;
    this.cache = new CacheManager(cacheNamespace, CacheTypeEnumerate.LOCAL, 7776000000); // expires in 90 days
  }

  /**
   *
   * @param {String} rotationName
   * @return {Boolean}
   */
  qualifies(rotationName) {
    return new Promise(this.rotationConditions[rotationName]);
  }

  /**
   *
   * @param {Object} versions
   * @return {Number}
   */
  getWeightsTotal(versions) {
    let total = 0;
    for (let version in versions) {
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
    for (let version in versions) {
      if (!versions.hasOwnProperty(version)) continue;
      let weight = versions[version];
      let pct = Math.round(Number(weight) / weightTotal * 100);
      let range = Number(startRange) + pct;
      startRange += range;
      versions[version] = range;
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
    let promises = [];
    let rotationIds = [];
    let selectedRotationId = null;
    return new Promise((resolve, reject) => {
      rotationIds = this.rotationConfig['page_rotations'][route.path] || [];
      for (let i = 0; i < rotationIds.length; i++) {
        promises.push(this.qualifies(this.rotationConfig['rotation_id_keyname_map'][rotationIds[i]]));
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
    });
  }

  /**
   * @description Returns a rotation view string based on its weighted value
   * @param {Number} selectedRotationId
   * @return {String}
   */
  chooseWeightedVariant(selectedRotationId) {
    let selectedRotation = '';
    let versions = this.createVersionRanges(this.rotationConfig['rotation_versions'][selectedRotationId]);
    let randomVal = Math.round(Math.random()*100);
    for (let i = 0; i < versions.length; i++) {
      if ((randomVal < versions[i].range) || (i + 1 === versions.length && !selectedRotation)) {
        selectedRotation = versions[i].version;
        break;
      }
    }
    return selectedRotation;
  }


  /**
   *
   *
   * @param {Array} routes
   * @param {String} selectedRotation
   * @param {Object} _route
   * @return {Array}
   * @memberof Rotations
   */
  replaceRoute(routes, selectedRotation = 'routes', _route) {
    let route = null;
    for (let i = 0; i < this.routeConfig[selectedRotation].length; i++) {
      let configRoute = this.routeConfig[selectedRotation][i];
      if (configRoute.path === _route.path) {
        route = configRoute;
        break;
      }
    }

    for (let i = 0; i < routes.length; i++) {
      if (routes[i].path === route.path) {
        return [
          ...routes.slice(0, i),
          route,
          ...routes.slice(i + 1)
        ];
      }
    }
    return routes;
  }

  /**
   *
   * @return {Array}
   * @memberof Rotations
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

    for (let key in this.routeConfig) {
      if (!this.routeConfig.hasOwnProperty(key) || key === 'routes') continue;
      for (let i = 0; i < this.routeConfig[key].length; i++) {
        let route = this.routeConfig[key][i];
        addRoute(route);
      }
    }
    return uniqueRoutes;
  }
  /**
   *
   * @return {Promise} resolves to a route configuration Array of route objects
   */
  async getRoutes() {
    return new Promise((resolve, reject) => {
      if (window.aofljsConfig && window.aofljsConfig.prerender) { // @todo: find better solution
        return resolve(this.routeConfig.routes);
      }
      const routes = this.uniqueRoutes();
      let iterRoutes = gen(routes);
      let route = {};
      let routeConfig = this.routeConfig.routes;
      const pushRoutes = (routeConfig=[]) => {
        let next = iterRoutes.next();
        let selectedRotation = '';

        if (next.done === true) {
          resolve(routeConfig);
        } else {
          route = next.value;
          this.getQualifyingRotation(route).then((selectedRotationId) => {
            selectedRotation = this.cache.getItem(selectedRotationId);
            if (selectedRotation === null) {
              selectedRotation = this.chooseWeightedVariant(selectedRotationId);
              if (selectedRotation !== '') {
                this.cache.setItem(selectedRotationId, selectedRotation);
              }
            }
            routeConfig = this.replaceRoute(routeConfig,
              this.rotationConfig.rotation_version_page_group_version_map[selectedRotation], route);
            pushRoutes(routeConfig);
          });
        }
      };
      pushRoutes(routeConfig);
    });
  }
}

export default Rotations;
