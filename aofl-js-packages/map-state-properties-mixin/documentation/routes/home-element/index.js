/**
 * @route /
 * @title AofL::Home
 * @prerender false
 */
import {template} from './template';
import styles from './styles.css';
import langMap from './i18n/language';
import * as manualExample from './examples/manual';
import * as manualFixedExample from './examples/manual-fixed';
import * as mixinExample from './examples/mixin';
import AoflElement from '@aofl/web-components/aofl-element';
import {i18nMixin} from '@aofl/i18n-mixin';
import '@aofl/web-components/aofl-list-option';
import '@aofl/aofl-samples/aofl-preview-element';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {storeInstance, Store} from '@aofl/store';
import {tabsSdoEnumerate} from '@aofl/aofl-samples/tab-element';
import Prism from 'prismjs';

window.Store = Store;
window.mapStatePropertiesMixin = mapStatePropertiesMixin;
window.AoflElement = AoflElement;

storeInstance.commit({
  namespace: tabsSdoEnumerate.NAMESPACE,
  mutationId: tabsSdoEnumerate.ADD_GROUP,
  payload: {
    groupId: 'contentTabs',
    tabs: {
      overview: true,
      examples: false
    }
  }
});
/**
 *
 * @class HomePage
 * @extends {AoflElement}
 */
const HomePage = class HomePage extends mapStatePropertiesMixin(i18nMixin(AoflElement)) {
  /**
   *
   * Creates an instance of HomePage.
   * @memberof HomePage
   */
  constructor() {
    super();
    this.storeInstance = storeInstance;
    this.langMap = langMap;
    this.manualExample = manualExample;
    this.manualFixedExample = manualFixedExample;
    this.mixinExample = mixinExample;
    this.mapStateProperties();
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
   * @readonly
   * @static
   */
  static get properties() {
    return {
      selectedContentTab: String
    };
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
   *
   */
  mapStateProperties() {
    const state = this.storeInstance.getState();
    this.selectedContentTab = state[tabsSdoEnumerate.NAMESPACE].contentTabs.$selected;
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
