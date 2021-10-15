import {Middleware} from '@aofl/middleware';
import {deepFreeze} from '@aofl/object-utils';
import {Sdo} from './sdo.js';

export type SubscribeFn = () => void;
export type State = {
  [key: string]: any;
};
type Sdos = {
  [key: string]: any;
}

export class Store {
  private mode = process.env.NODE_ENV;
  private _tick : ReturnType<typeof setTimeout>|null= null;
  private _microtask = () => {
    for (const mw of this._middleware) {
      mw({}, {}, {});
    }
    this._tick = null;
  };
  private _state = {};
  private _sdos : Sdos = {};
  private _middleware = new Middleware();

  constructor() {
    if (this.mode === 'development') {
      this._state = deepFreeze(this._state);
    }
    if (typeof aoflDevtools !== 'undefined') {
      if (!Array.isArray(aoflDevtools.storeInstances)) {
        aoflDevtools.storeInstances = [];
      }
      aoflDevtools.storeInstances.push(this);
    }
  }

  subscribe(fn: SubscribeFn) {
    return this._middleware.use(() => fn());
  }

  get state() : State {
    return this._state;
  }

  addSdo(sdo: Sdo<any>) {
    if (typeof this._sdos[sdo.namespace] !== 'undefined' && !aofljsConfig?.hot) {
      throw new Error(`${this.constructor.name}: Cannot redefine existing namespace ${sdo.namespace}`);
    }

    const state = {
      ...(sdo.constructor as typeof Sdo).initialState,
      ...sdo.initialState,
      ...(this._sdos[sdo.namespace] || {})
    };

    this._sdos[sdo.namespace] = sdo;
    this.commit(sdo.namespace, {...state});
  }

  commit(namespace: string, subState: State) {
    const state = {
      ...this._state,
      [namespace]: subState,
    };
    this.replaceState(state);
  }

  replaceState(state: State) {
    this._state = state;
    if (this.mode === 'development') {
      this._state = deepFreeze(this._state);
    }
    this.dispatch();
  }

  flushState() {
    const state : State = {};
    for (const key in this._sdos) {
      if (!Object.prototype.hasOwnProperty.call(this._sdos, key)) {
        continue;
      }
      const sdo = this._sdos[key];
      state[sdo.constructor.namespace] = sdo.state;
    }

    this.replaceState(state);
  }

  dispatch() {
    if (this._tick) {
      return;
    }
    this._tick = setTimeout(this._microtask);
  }
}
