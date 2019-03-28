import {AoflElement} from '@aofl/web-components/aofl-element';
import template from './template';
import styles from './styles';
import GetFormatter from '../get-formatter';
import {ApiRequest} from '@aofl/api-request';

class ExampleComponent extends AoflElement {
  constructor() {
    super();
    this.memes = [];
    this.apiRequestInstance = new ApiRequest();
    this.apiRequestInstance.addFormatter('get', GetFormatter);
  }

  static get is() {
    return 'example-component';
  }

  static get properties() {
    return {
      memes: String
    };
  }

  render() {
    return super.render(template, [styles]);
  }

  makeRequest() {
    this.apiRequestInstance.request('https://api.imgflip.com/get_memes', void 0, 'get')
      .then((response) => {
        this.memes = response.data.memes;
      });
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
