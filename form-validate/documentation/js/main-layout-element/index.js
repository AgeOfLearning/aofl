import styles from './styles.css';
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary MainLayoutElement
 * @class MainLayoutElement
 * @extends {AoflElement}
 */
class MainLayoutElement extends AoflElement {
  /**
   * Creates an instance of MainLayoutElement.
   * @memberof MainLayoutElement
   */
  constructor() {
    super(); /** todo: import store instance */
  }

  /**
   * @readonly
   * @static
   * @memberof MainLayoutElement
   */
  static get is() {
    return 'main-layout';
  }

  /**
   *
   *
   * @return {Object}
   * @memberof MainLayoutElement
   */
  _render() {
    return super._render(template, [window.globalStyles, styles]);
  }
}

window.customElements.define(MainLayoutElement.is, MainLayoutElement);

export default MainLayoutElement;
