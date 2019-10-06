/**
 * @summary list-option
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {AoflElement} from '@aofl/element';
import {findParent} from '@aofl/component-utils';

/**
 * Similar to option tag can be combined with <aofl-select-list> or <aofl-multi-select-list>
 *
 * @memberof module:@aofl/select
 * @extends {AoflElement}
 */
class AoflListOption extends AoflElement {
  /**
   * Creates an instance of AoflListOption.
   */
  constructor() {
    super();
  }
  /**
   *
   * @readonly
   */
  static get is() {
    return 'aofl-list-option';
  }
  /**
   *
   * @readonly
   */
  static get properties() {
    return {
      selected: {type: Boolean, reflect: true},
      disabled: {type: Boolean},
      value: {type: String}
    };
  }
  /**
   * @param {Event} e
   */
  keydownCallback(e) {
    if (e.keyCode === 13 || e.keyCode === 32) { // If user hits enter or space
      this.select();
    }
  }

  /**
   * Update selected value in the parent list
   */
  select(e) {
    this.listElement.updateSelected(this, true);
  }
  /**
   *
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.select);
    this.addEventListener('keydown', this.keydownCallback);

    this.updateComplete.then(() => {
      this.value = this.value || this.textContent;
      this.listElement = findParent(this, 'addOption');
      this.listElement.addOption(this);
    });
  }
  /**
   * @return {Object}
   */
  render() {
    return super.render((ctx, html) => html`<slot></slot>`, [
      `
      :host {
        display: inline-block;
      }
    `
    ]);
  }
  /**
   *
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.select);
    this.removeEventListener('keydown', this.keydownCallback);
  }
}

if (window.customElements.get(AoflListOption.is) === void 0) {
  window.customElements.define(AoflListOption.is, AoflListOption);
}

export default AoflListOption;
