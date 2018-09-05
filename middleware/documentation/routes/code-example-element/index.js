/**
 * @route /aofl-code/
 * @title AofL::aofl-code
 * @prerender false
 */
import styles from './styles.css';
import {template} from './template';
import AoflElement from '@aofl/web-components/aofl-element';
import '@aofl/aofl-samples/aofl-code-element';

/**
 * @summary CodeExample
 * @class CodeExample
 * @extends {AoflElement}
 */
class CodeExample extends AoflElement {
  /**
   * Creates an instance of CodeExample.
   * @memberof CodeExample
   */
  constructor() {
    super(); /** todo: import store instance */
  }

  /**
   * @readonly
   * @static
   * @memberof CodeExample
   */
  static get is() {
    return 'code-example';
  }

  /**
   *
   *
   * @return {Object}
   * @memberof CodeExample
   */
  _render() {
    return super._render(template, [window.globalStyles, styles]);
  }
}

window.customElements.define(CodeExample.is, CodeExample);

export default CodeExample;
