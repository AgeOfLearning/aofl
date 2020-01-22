/**
 * @summary map-state-properties-mixin
 * @version 3.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

/**
 * @memberof module:@aofl/map-state-properties-mixin
 * @pram {HtmlElement} superClass
 */
const mapStatePropertiesMixin = (superClass) => {
  /**
   * Mixes the superClass with MapStatePropertiesMixin. It subscribes to store on
   * connectedCallback and calls mapStateProperties before element is connected to
   * initialize the values. It requires the instance to have `storeInstance` and
   * override mapStateProperties.
   *
   * @memberof module:@aofl/map-state-properties-mixin
   * @extends {superClass}
   */
  class MapStatePropertiesMixin extends superClass {
    /**
     * Override this class to map state properties
     * @protected
     */
    mapStateProperties() {}
    /**
     * @param {*} args
     */
    connectedCallback(...args) {
      /* istanbul ignore else */
      if (typeof this.mapStateProperties === 'function' &&
      typeof this.storeInstance !== 'undefined') {
        this.mapStateProperties();
        this.statePropertiesUnsubscribe = this.storeInstance.subscribe(() => {
          this.mapStateProperties();
        });
      }
      super.connectedCallback(...args);
    }

    /**
     * @param {*} args
     */
    disconnectedCallback(...args) {
      super.disconnectedCallback(...args);
      /* istanbul ignore else */
      if (typeof this.statePropertiesUnsubscribe === 'function') {
        this.statePropertiesUnsubscribe();
        this.statePropertiesUnsubscribe = null;
      }
    }
  }

  return MapStatePropertiesMixin;
};

export {
  mapStatePropertiesMixin
};
