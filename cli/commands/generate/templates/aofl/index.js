import styles from '../styles.css';
import template from '../template';

const {AoflElement} = aofljs;
/**
 * @summary __uppercamelcase__placeholder__
 * @class __uppercamelcase__placeholder__
 * @extends {AoflElement}
 */
class __uppercamelcase__placeholder__ extends AoflElement {
  /**
   * Creates an instance of __uppercamelcase__placeholder__.
   * @memberof __uppercamelcase__placeholder__
   */
  constructor() {
    super(storeInstance); /** todo: import store instance */
  }

  /**
   * @readonly
   * @static
   * @memberof __uppercamelcase__placeholder__
   */
  static get is() {
    return '__placeholder__';
  }

  /**
   *
   *
   * @return {Object}
   * @memberof __uppercamelcase__placeholder__
   */
  _render() {
    return super._render(template, [styles]);
  }
}

if (!customElements.get(__uppercamelcase__placeholder__.is)) {
  window.customElements.define(__uppercamelcase__placeholder__.is, __uppercamelcase__placeholder__);
}

export default __uppercamelcase__placeholder__;
