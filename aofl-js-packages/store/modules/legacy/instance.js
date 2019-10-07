/**
 * @summary instance
 * @version 2.0.0
 * @since 1.0.0
 * @author Arian Khosravi<arian.khsoravi@aofl.com>
 */

import Store from './store';

/**
 * Persistent instance of Store.
 *
 * @memberof module:@aofl/store/legacy
 * @deprecated
 * @type {Store}
 */
const storeInstance = new Store(process.env.NODE_ENV === 'development');

export default storeInstance;

