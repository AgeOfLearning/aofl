import {AoflElement} from '@aofl/element';
import template from './template';
import styles from './styles';
import randomColor from '../random-color';
import '../mixin-component';
import {colorSdo} from '../color-sdo';

class ExampleComponent extends AoflElement {
  constructor() {
    super();
    this.component = document.createElement('mixin-preview');
    this.attached = false;
  }

  static get is() {
    return 'example-component';
  }

  static get properties() {
    return {
      attached: {type: Boolean}
    };
  }

  updateColor() {
    colorSdo.color = randomColor();
  }

  attachDetach(e) {
    if (this.attached) {
      this.attached = false;
      this.removeChild(this.component);
    } else {
      this.attached = true;
      this.appendChild(this.component);
    }
  }

  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
