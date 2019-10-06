/**
 * @summary instance
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi<arian.khsoravi@aofl.com>
 */
import {Store} from './store';

/**
 * Persistent instance of Store.
 *
 * @memberof module:@aofl/store
 */
const storeInstance = new Store(process.env.NODE_ENV === 'development');

export {
  storeInstance
};
