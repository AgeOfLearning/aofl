import {AoflElement} from '@aofl/web-components/aofl-element';
import template from './template';
import styles from './styles';
import {i18nMixin} from '@aofl/i18n-mixin';
import {translations} from '../__config/translation';

class ExampleComponent extends i18nMixin(AoflElement) {
  constructor() {
    super();

    this.user = 'Mike';
    this.messageCount = 0;
    this.translations = translations;
  }

  static get is() {
    return 'example-component';
  }

  static get properties() {
    return {
      messageCount: {type: Number},
      user: {type: String}
    };
  }

  incrementMessages() {
    this.messageCount += 1;
  }
  decrementMessages() {
    this.messageCount -= 1;
  }

  toggleLanguage() {
    if (document.documentElement.getAttribute('lang') === 'en-US') {
      document.documentElement.setAttribute('lang', 'es-US');
    } else {
      document.documentElement.setAttribute('lang', 'en-US');
    }
  }
  render() {
    return super.render({
      default: {
        template,
        styles: [styles]
      }
    });
  }
}

window.customElements.define(ExampleComponent.is, ExampleComponent);
