import template from './template';
import styles from './styles';
import {AoflElement} from '@aofl/web-components/aofl-element';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {storeInstance} from '@aofl/store';

class MixinComponent extends mapStatePropertiesMixin(AoflElement) {
  constructor() {
    super();
    this.storeInstance = storeInstance;
  }

  static get is() {
    return 'mixin-preview';
  }

  mapStateProperties() {
    const state = storeInstance.getState();
    this.parentNode.style.background = state.color.color;
  }

  connectedCallback() {
    super.connectedCallback();
    this.mapStateProperties();
  }
  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(MixinComponent.is, MixinComponent);
