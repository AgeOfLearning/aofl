import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin';

export default dedupingMixin((superClass) => {
  /**
   *
   *
   * @class MapStatePropertiesMixin
   * @extends {dedupingMixin(superClass)}
   */
  class MapStatePropertiesMixin extends superClass {
    /**
     *
     *
     * @param {*} args
     * @memberof MapStatePropertiesMixin
     */
    connectedCallback(...args) {
      if (typeof this?.mapStateProperties === 'function' &&
      typeof this?.storeInstance?.subscribe === 'function') {
        this.statePropertiesUnsubscribe = this.storeInstance.subscribe(() => {
          this.mapStateProperties();
        });
      }
      super.connectedCallback(...args);
    }

    /**
     *
     * @param {*} args
     * @memberof MapStatePropertiesMixin
     */
    disconnectedCallback(...args) {
      // super.disconnectedCallback(...args);
      if (typeof this.statePropertiesUnsubscribe === 'function') {
        this.statePropertiesUnsubscribe();
        this.statePropertiesUnsubscribe = null;
      }
    }
  }

  return MapStatePropertiesMixin;
});
