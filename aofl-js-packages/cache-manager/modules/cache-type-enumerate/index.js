/**
 * Defines cache type enumerate
 *
 * @summary cache-type-enumerate
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * Cache types enumerate
 *
 * @memberof module:@aofl/cache-manager
 * @readonly
 * @static
 * @enum {Number}
 */
const cacheTypeEnumerate = {
  /** memoryStorage */
  MEMORY: 0,
  /** localStorage */
  LOCAL: 1,
  /** sessionStorage */
  SESSION: 2
};

export {
  cacheTypeEnumerate
};
