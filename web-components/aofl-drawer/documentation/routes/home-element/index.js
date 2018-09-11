/**
 * @route /
 * @title AofL::Home
 * @prerender false
 */
import {template} from './template';
import styles from './styles.css';
import langMap from './i18n/language';
import jsExample from '!raw-loader!./examples/no-animate/index';
import cssExample from '!raw-loader!./examples/no-animate/index.css';
import htmlExample from '!raw-loader!./examples/no-animate/template';
import jsExample2 from '!raw-loader!./examples/fade-in/index';
import cssExample2 from '!raw-loader!./examples/fade-in/index.css';
import htmlExample2 from '!raw-loader!./examples/fade-in/template';
import jsExample3 from '!raw-loader!./examples/side-panel/index';
import cssExample3 from '!raw-loader!./examples/side-panel/index.css';
import htmlExample3 from '!raw-loader!./examples/side-panel/template';
import jsExample4 from '!raw-loader!./examples/accordion/index';
import cssExample4 from '!raw-loader!./examples/accordion/index.css';
import htmlExample4 from '!raw-loader!./examples/accordion/template';
import AoflElement from '@aofl/web-components/aofl-element';
import {i18nMixin} from '@aofl/i18n-mixin';
import '@aofl/web-components/aofl-list-option';
import '@aofl/aofl-samples/aofl-preview-element';
import {mapStatePropertiesMixin} from '@aofl/map-state-properties-mixin';
import {storeInstance} from '@aofl/store';
import {tabsSdoEnumerate} from '@aofl/aofl-samples/tab-element';
import Prism from 'prismjs';

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
    this.jsExample = jsExample;
    this.cssExample = cssExample;
    this.htmlExample = htmlExample;
    this.jsExample2 = jsExample2;
    this.cssExample2 = cssExample2;
    this.htmlExample2 = htmlExample2;
    this.jsExample3 = jsExample3;
    this.cssExample3 = cssExample3;
    this.htmlExample3 = htmlExample3;
    this.jsExample4 = jsExample4;
    this.cssExample4 = cssExample4;
    this.htmlExample4 = htmlExample4;
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
