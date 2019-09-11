import {storeInstance} from '@aofl/store';
import {get} from '@aofl/object-utils';
import {property as litProperty} from 'lit-element/lib/decorators';

const MapStateDeclaration = {
  store: storeInstance,
  state: ''
}


/**
 *
 *
 * @export
 * @param {Object} options
 * @returns
 */
export function property(options = MapStateDeclaration) {
  const _options = Object.assign({}, MapStateDeclaration, options);

  return (protoOrDescriptor, name) => {
    const propertyDecorator = litProperty(_options);
    const descriptor = propertyDecorator(protoOrDescriptor, name);

    return Object.assign({}, descriptor, {
      initializer() {
        if (typeof descriptor.initializer === 'function') {
          descriptor.initializer.call(this);
        }

        if (_options.state !== '') {
          const updateValue = () => {
            const state = _options.store.getState();
              this[protoOrDescriptor.key] = get(state, _options.state);
          };

          updateValue();
          const unsubscribe = storeInstance.subscribe(updateValue);
          this._observedPropertiesMap.set(protoOrDescriptor.key, unsubscribe);
        }
      }
    });
  }
};
