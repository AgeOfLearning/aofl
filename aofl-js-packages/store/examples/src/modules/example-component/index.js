import {AoflElement, property} from '@aofl/element';
import template from './template';
import styles from './styles';
import {previewSdo} from '../preview-sdo';

class ExampleComponent extends AoflElement {
  constructor() {
    super();
  }

  static is = 'example-component';

  @property({mapState: 'preview'})
  previewState = {};

  @property({mapState: 'count', store: previewSdo})
  count = 0;

  @property({mapState: 'formattedDate', store: previewSdo})
  formattedDate = '';

  unsubscribeStore = null;

  incrementCount() {
    previewSdo.increment();
  }

  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
