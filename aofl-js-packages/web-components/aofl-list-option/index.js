/**
 * Implements AoflListOption
 *
 * @summary AoflListOption
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 *
 *
 * @requires AoflElement
 * @requires aofl-js/ComponentUtils:findParent
 */
import {template} from './template';
import AoflElement from '../aofl-element';
import {findParent} from '@aofl/component-utils';

/**
 * @extends {AoflElement}
 */
class AoflListOption extends AoflElement {
  /**
   * Creates an instance of AoflListOption.
   */
  constructor() {
    super();
    this.clickCallback = () => this.select();
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
      selected: {type: String},
      disabled: {type: Boolean},
      value: {type: String}
    };
  }

  /**
   * @return {Object}
   */
  render() {
    return super.render(template);
  }

  /**
   *
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.clickCallback);
    this.updateComplete.then(() => {
      this.value = this.value || this.textContent;
      this.listElement = findParent(this, 'addOption');
      this.listElement.addOption(this);
      if (typeof this.selected !== 'undefined' && this.selected !== 'false') {
        this.select();
      }
    });
  }

  /**
   * Update selected value in the parent list
   */
  select() {
    this.listElement.updateSelected(this.value);
  }

  /**
   *
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.clickCallback);
  }
}

window.customElements.define(AoflListOption.is, AoflListOption);
