/**
 * Defines server environments enumerate
 *
 * @summary server-environment
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * Server Environment types Enumerate
 *
 * @memberof module:@aofl/server-environment
 * @readonly
 * @enum {String}
 */
const environmentTypeEnumerate = {
  /** development */
  DEV: 'development',
  /** stage */
  STAGE: 'stage',
  /** production */
  PROD: 'production'
};

export {
  environmentTypeEnumerate
};
