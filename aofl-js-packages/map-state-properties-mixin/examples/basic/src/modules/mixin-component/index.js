import template from './template';
import styles from './styles';
import {AoflElement} from '@aofl/element';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {storeInstance} from '@aofl/store';
import {colorSdo} from '../color-sdo';

class MixinComponent extends mapStatePropertiesMixin(AoflElement) {
  constructor() {
    super();
    this.storeInstance = storeInstance;
  }

  static get is() {
    return 'mixin-preview';
  }

  mapStateProperties() {
    this.parentNode.style.background = colorSdo.color;
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
