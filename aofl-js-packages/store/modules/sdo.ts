import {State, Store, SubscribeFn} from './store.js';
import {mapState} from './decorators/mapState.js';

type Decorator = {
  values: Array<any>,
  keys: Array<string>,
  value: any
};

export type Decorators<T> = {
  [property in keyof T as Exclude<property, 'commit'|'decorators'|'initialState'|'namespace'|'reset'|'state'|'store'|'subscribe'|'decorators'>]: ReturnType<typeof mapState>
}

export abstract class Sdo<S> {
  [key: string]: unknown;
  _decorators : Map<string, Decorator> = new Map();

  protected static namespace : string;
  static initialState: State = {};
  namespace : string;
  initialState : State|void;
  store: Store;
  decorators : Decorators<S>;

  constructor(store: Store, initialState?: State) {
    if (typeof (this.constructor as typeof Sdo).namespace === 'undefined') {
      throw new Error('Sdo.namespace is not defined');
    }
    this.namespace = (this.constructor as typeof Sdo).namespace;
    this.initialState = initialState;
    this.store = store;

    this.decorators = ({} as Decorators<S>);
    this.createStateDecorators();
    store.addSdo(this, initialState || (this.constructor as typeof Sdo).initialState);
  }

  get state() : Decorators<S> {
    return this.store.state[this.namespace];
  }

  commit(state: State) {
    this.store.commit(this.namespace, state);
  }

  reset() {
    this.store.commit(this.namespace, this.initialState || (this.constructor as typeof Sdo).initialState);
  }

  subscribe(cb: SubscribeFn) {
    return this.store.subscribe(cb);
  }

  private createStateDecorators() {
    const proto = Object.getPrototypeOf(this);
    const properties = Object.getOwnPropertyDescriptors(proto);

    for (const [key, descriptor] of Object.entries(properties)) {
      if (descriptor.get && descriptor.set) {
        Object.defineProperty(this.decorators, key, {
          value: (path?: string) => {
            let k = `${key}`;
            if (typeof path === 'string') {
              k += `.${path}`;
            }
            return mapState({store: this, path: k});
          }
        });
      }
    }
  }
}
