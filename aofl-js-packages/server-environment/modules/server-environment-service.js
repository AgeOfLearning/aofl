/**
 * @summary server-environment
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {environmentTypeEnumerate} from '../environment-type-enumerate';

/**
 * Takes a devRegex and a stageRegex and tests them against hostname. Returns 'production' if
 * the regexes do not capture any results from hostname
 *
 * @memberof module:@aofl/server-environment
 *
 * @param {RegExp} devRegex
 * @param {RegExp} stageRegex
 * @return {Number}
 */
export function getServerEnvironment(devRegex, stageRegex) {
  if (devRegex instanceof RegExp && devRegex.test(location.hostname)) {
    return environmentTypeEnumerate.DEV;
  }

  if (stageRegex instanceof RegExp && stageRegex.test(location.hostname)) {
    return environmentTypeEnumerate.STAGE;
  }

  return environmentTypeEnumerate.PROD;
}
