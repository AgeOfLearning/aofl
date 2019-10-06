/**
 *
 * @requires module:aofl-js/store-package
 *
 */

import Store from './store';

/**
 * Persistent instance of Store.
 *
 * @memberof module:aofl-js/store-package
 */
const storeInstance = new Store(process.env.NODE_ENV === 'development');

export default storeInstance;

