import {AoflElement} from '@aofl/element';
import template from './template';
import styles from './styles';
import {uuid} from '@aofl/uuid';

class ExampleComponent extends AoflElement {
  constructor() {
    super();
    this.uuid = uuid();
  }

  static get is() {
    return 'example-component';
  }

  static get properties() {
    return {
      uuid: {type: String}
    };
  }

  generate() {
    this.uuid = uuid();
  }

  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
