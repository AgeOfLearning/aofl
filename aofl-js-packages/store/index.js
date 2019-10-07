/**
 * Exports Sdo, Store and storeInstance
 *
 * @module @aofl/store
 *
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

import {Store} from './modules/store';
import {storeInstance} from './modules/instance';
import {Sdo} from './modules/sdo';
import {decorate, state} from './modules/decorators';

export {
  Sdo,
  Store,
  storeInstance,
  decorate,
  state
};
