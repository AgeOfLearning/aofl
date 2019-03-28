import {AoflElement} from '@aofl/web-components/aofl-element';
import template from './template';
import styles from './styles';
import '../preview-sdo';
import {storeInstance} from '@aofl/store';

class ExampleComponent extends AoflElement {
  constructor() {
    super();
  }

  static get is() {
    return 'example-component';
  }

  static get properties() {
    return {
      state: {type: Object},
      count: {type: Number},
      formattedDate: {type: String},
      unsubscribeStore: {type: Object}
    };
  }

  incrementCount() {
    const state = storeInstance.getState();

    storeInstance.commit({
      namespace: 'preview',
      mutationId: 'increment',
      payload: state.preview.count
    });
  }

  unsubscribe() {
    if (typeof this.unsubscribeStore === 'function') {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }

  subscribe() {
    if (typeof this.unsubscribeStore !== 'function') {
      this.unsubscribeStore = storeInstance.subscribe(() => this.mapStateProperties());
    }
  }


  mapStateProperties() {
    const state = storeInstance.getState();
    this.state = state;
    this.count = state.preview.count;
    this.formattedDate = state.preview.$formattedDate;
  }

  connectedCallback() {
    super.connectedCallback();
    this.mapStateProperties();
    this.unsubscribeStore = storeInstance.subscribe(() => this.mapStateProperties());
  }

  disconnectedCallback() {
    if (typeof this.unsubscribeStore === 'function') {
      this.unsubscribeStore();
    }
  }

  render() {
    return super.render(template, [styles]);
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
