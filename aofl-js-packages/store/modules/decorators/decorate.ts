import {Sdo} from '../sdo.js';
import {get} from '@aofl/object-utils';
import {ClassElement} from './base.js';

const legacyDecorate = (paths: string[], proto: Sdo<any>, name: string, descriptor: any) => {
  const getFn = Reflect.get(descriptor, 'get');

  descriptor.get = function() {
    let observedProperty = this._decorators.get(name);
    if (!observedProperty) {
      observedProperty = {
        keys: paths,
        values: paths,
        value: void 0
      };
    }

    let changed = false;
    const state = this.store.state;
    const newValues = [];
    for (let i = 0; i < observedProperty.keys.length; i++) {
      const key = observedProperty.keys[i];
      const value = observedProperty.values[i];
      const newValue = get(state, key);

      newValues.push(newValue);
      if (value !== newValue) {
        changed = true;
      }
    }

    observedProperty.values = newValues;

    if (changed) {
      observedProperty.value = Reflect.apply(getFn, this, []);
      this._decorators.set(name, observedProperty);
    }
    return observedProperty.value;
  };
};

const standardDecorate =  (args: string[], descriptor: ClassElement) => {
    if (args.length === 0) {
      throw new TypeError('Expected at least 1 argument, but only 0 were passed');
    }

    const key = descriptor.key;
    if (typeof key === 'string') {
      descriptor.finisher = (clazz) => {
        (clazz.prototype as Sdo<any>)._decorators.set(key, {
          keys: args,
          values: args,
          value: ''
        });
      }
    }

    return descriptor;
}

export function decorate(...args: string[]) :any {
  return (protoOrDescriptor: Object|Sdo<any>, name?: string, descriptor?: any): any => {
    if (typeof name === 'undefined') {
      return standardDecorate(args, protoOrDescriptor as ClassElement);
    }
    return legacyDecorate(args, protoOrDescriptor as Sdo<any>, name, descriptor);
  }
}
