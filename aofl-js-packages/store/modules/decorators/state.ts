import {Sdo} from '../sdo.js';
import {ClassElement} from './base.js';

const legacyState = (proto: Sdo<any>, name: string) => {
  Object.defineProperty(proto, name, {
    get() {
      return this.state[name];
    },
    set(value) {
      if (typeof this.constructor.initialState[name] === 'undefined') {
        console.log('state', name, value, this.constructor.initialState);
        this.constructor.initialState[name] = value;
      } else {
        this.commit({
          ...this.state,
          [name]: value
        });
      }
    },
    enumerable: true
  });
}

const standardState = (descriptor: ClassElement) => {
  const key = descriptor.key;
  if (typeof key !== 'string') {
    return descriptor;
  }

  return {
    kind: 'field',
    key: Symbol(),
    placement: 'own',
    descriptor: {},
    initializer() {
      const val = Object.call(this, descriptor.initializer);

      if (typeof (this.constructor as any).initialState[key] === 'undefined') {
        (this.constructor as typeof Sdo).initialState[key] = val;
      }

      Object.defineProperty(this, key, {
        get() {
          return this.state[key];
        },
        set(value) {
          this.commit({
            ...this.state,
            [key]: value
          });
        },
        enumerable: true
      });
    },
    finisher() {}
  }
}

export function state() : any {
  return (protoOrDescriptor: Object|Sdo<any>, name?: string): any => {
    if (typeof name === 'undefined') {
      return standardState(protoOrDescriptor as ClassElement);
    }
    return legacyState(protoOrDescriptor as Sdo<any>, name);
  }
}
