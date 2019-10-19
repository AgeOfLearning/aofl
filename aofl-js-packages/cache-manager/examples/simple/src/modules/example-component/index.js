import {AoflElement} from '@aofl/element';
import template from './template';
import styles from './styles';
import {CacheManager, cacheTypeEnumerate} from '@aofl/cache-manager';

class ExampleComponent extends AoflElement {
  constructor() {
    super();
    this.cacheManager = new CacheManager('cacheManagerExample', cacheTypeEnumerate.Memory);
    this.data = this.cacheManager.getCollection();
  }

  static get is() {
    return 'example-component';
  }

  static get properties() {
    return {
      data: {
        type: String
      }
    };
  }

  render() {
    return super.render(template, [styles]);
  }

  submitted(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    this.cacheManager.setItem(formData.get('key'), formData.get('value'));
    this.data = this.cacheManager.getCollection();
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
