import {AoflElement} from '@aofl/element';
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
    return super.render(
      (ctx, html) => html`
        <p>Number of Results: ${this.memes.length}</p>
        <button @click="${() => this.makeRequest()}">Request</button>

        <p>Memes:</p>
        ${this.memes.map((item) => html`
            <img
              src="${item.url}"
              style="width: 50px; height: 50px; margin: 0 5px 5px 0;"
            />
          `)}
      `,
      [
        `:host {
          display: block;
        }
      `
      ]
    );
  }

  makeRequest() {
    this.apiRequestInstance
      .request('https://api.imgflip.com/get_memes', void 0, 'get')
      .then((response) => {
        this.memes = response.data.memes;
      });
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
