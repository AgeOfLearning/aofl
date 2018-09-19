import styles from '../styles.css';
import template from '../template';
import AoflElement from '@aofl/web-components/aofl-element';

/**
 * @summary __uppercamelcase__placeholder__
 * @class __uppercamelcase__placeholder__
 * @extends {AoflElement}
 */
class __uppercamelcase__placeholder__ extends AoflElement {
  /**
   * Creates an instance of __uppercamelcase__placeholder__.
   */
  constructor() {
    super();
  }

  /**
   * @readonly
   */
  static get is() {
    return '__placeholder__';
  }

  /**
   *
   * @return {Object}
   */
  _render() {
    return super._render(template, [styles]);
  }
}

window.customElements.define(__uppercamelcase__placeholder__.is, __uppercamelcase__placeholder__);

export default __uppercamelcase__placeholder__;
