/**
 * @route /
 * @title AofL::Home
 * @prerender false
 */
import {template} from './template';
import styles from './styles.css';
import langMap from './i18n/language';
import AoflElement from '@aofl/web-components/aofl-element';
import {i18nMixin} from '@aofl/i18n-mixin';
import Prism from 'prismjs';

/**
 *
 * @class HomePage
 * @extends {AoflElement}
 */
class HomePage extends i18nMixin(AoflElement) {
  /**
   *
   * Creates an instance of HomePage.
   * @memberof HomePage
   */
  constructor() {
    super();
    this.langMap = langMap;
  }

  /**
   *
   * @readonly
   * @static
   * @memberof HomePage
   */
  static get is() {
    return 'home-page';
  }

  /**
   *
   *
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   *
   * @return {Object}
   * @memberof HomePage
   */
  _render() {
    const tempStyles = [window.globalStyles, styles];
    return super._render({
      default: {
        template,
        styles: tempStyles
      }
    });
  }

  /**
   *
   *
   */
  _didRender() {
    Prism.highlightAllUnder(this.shadowRoot);
  }
};

customElements.define(HomePage.is, HomePage);

export default HomePage;
