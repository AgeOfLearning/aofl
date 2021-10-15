import {Store} from '../store.js';
import {Sdo} from '../sdo.js';
import {ClassElement} from './base.js';
import {AoflElement} from '@aofl/element';

export type MapStateOptions = {
  store: Store|Sdo<any>;
  path: string;
};

const legacyMapState = (options: MapStateOptions, proto: AoflElement, name: string) => {
  const map = (proto as any)._mapStateProperties || new Map();
  map.set(name, {
    store: options.store,
    path: options.path
  });
  Object.defineProperty(proto, '_mapStateProperties', {
    enumerable: false,
    configurable: false,
    writable: true,
    value: map
  });
}

const standardMapState = (options: MapStateOptions, descriptor: ClassElement) => {
  const init = descriptor.initializer;

  const key = descriptor.key;
  return {
    ...descriptor,
    initializer() {
      if (typeof init === 'function') {
        init();
      }
      if (typeof key === 'string') {
        (this as any)._mapStateProperties.set(key, {
         store: options.store,
         path: options.path
       });
      }
    }
  }
}

export function mapState(options: MapStateOptions) :any {
  return (protoOrDescriptor: Object|AoflElement, name?: string): any => {
    if (typeof name === 'undefined') {
      return standardMapState(options, protoOrDescriptor as ClassElement);
    }
    return legacyMapState(options, protoOrDescriptor as AoflElement, name);
  }
}
