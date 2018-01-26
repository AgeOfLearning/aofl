import ENVIRONMENTS from '../EnvironmentTypeEnumerate';

/**
 *
 */
class ServerEnvironment {
  /**
   *
   * @param {*} localRegex
   * @param {*} stageRegex
   * @return {Number}
   */
  static get(localRegex, stageRegex) {
    if (localRegex instanceof RegExp && localRegex.test(location.hostname)) {
      return ENVIRONMENTS.DEV;
    }

    if (stageRegex instanceof RegExp && stageRegex.test(location.hostname)) {
      return ENVIRONMENTS.STAGE;
    }

    return ENVIRONMENTS.LIVE;
  }
}

export default ServerEnvironment;
