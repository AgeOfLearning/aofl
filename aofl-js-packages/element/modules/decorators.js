/**
 * @summary decorators
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi<arian.khosravi@aofl.com>
 */
import {storeInstance} from '@aofl/store';
import {get, has} from '@aofl/object-utils';
import {property as litProperty, customElement as litCustomElement} from 'lit-element/lib/decorators';

/**
 * @memberof module:@aofl/element
 * @private
 * @type {Object}
 */
const MapStateDeclaration = {
  store: storeInstance,
  state: ''
};

/**
 * extends lit-element's property decorator and adds support for map state to @aofl/store.
 *
 * @memberof module:@aofl/element
 *
 * @param {Object} options
 * @param {Boolean|String} options.attribute
 * @param {TypeHint} options.type
 * @param {Function} options.converter
 * @param {Boolean} options.reflect
 * @param {Function} options.hasChanged
 * @param {Boolean} options.noAccessor
 * @param {Store} options.store,
 * @param {String} options.mapState
 * @return {Object}
 */
export function property(options = MapStateDeclaration) {
  const _options = Object.assign({}, MapStateDeclaration, options);

  return (protoOrDescriptor, name) => {
    const propertyDecorator = litProperty(_options);
    const descriptor = propertyDecorator(protoOrDescriptor, name);

    return Object.assign({}, descriptor, {
      initializer() {
        /* istanbul ignore next */
        if (typeof descriptor.initializer === 'function') {
          descriptor.initializer.call(this);
        }

        /* istanbul ignore next */
        if (_options.mapState !== '') {
          const updateValue = () => {
            const state = _options.store.state;
            if (has(state, _options.mapState)) {
              this[protoOrDescriptor.key] = get(state, _options.mapState);
            } else {
              this[protoOrDescriptor.key] = get(_options.store, _options.mapState);
            }
          };

          updateValue();
          const unsubscribe = _options.store.subscribe(updateValue);
          this._observedPropertiesMap.set(protoOrDescriptor.key, unsubscribe);
        }
      }
    });
  };
}


/**
 * extends lit-element's custom-element decorator and prevents an error being thrown when
 * the element is already defined when hot module replacement is enabled.
 *
 * @memberof module:@aofl/element
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
