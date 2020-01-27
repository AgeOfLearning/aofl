/**
 * @summary router-instance
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
import Router from './Router';
/**
 * Persistent instance of Router.
 *
 * @memberof module:@aofl/router
 * @type {Router}
 */
const routerInstance = new Router();

export {
  routerInstance
};
