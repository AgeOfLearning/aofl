import {storeInstance} from '@aofl/store';
import {get} from '@aofl/object-utils';
import {property as litProperty, customElement as litCustomElement} from 'lit-element/lib/decorators';

const MapStateDeclaration = {
  store: storeInstance,
  state: ''
};


/**
 *
 * @param {Object} options
 * @param {Boolean|String} options.attribute
 * @param {TypeHint} options.type
 * @param {Function} options.converter
 * @param {Boolean} options.reflect
 * @param {Function} options.hasChanged
 * @param {Boolean} options.noAccessor
 * @param {Store} options.store,
 * @param {String} options.state
 * @return {Object}
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
  };
}


/**
 *
 * @export customElement
 * @param {String} tagName
 * @return {Object}
 */
export function customElement(tagName) {
  return (descriptor) => {
    if (window.customElements.get(tagName) !== void 0) {
      return descriptor;
    }
    return litCustomElement(tagName)(descriptor);
  };
}
