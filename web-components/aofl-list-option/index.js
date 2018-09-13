import {template} from './template';
import AoflElement from '../aofl-element';
import {findParent} from '@aofl/component-utils';

/**
 * @summary AoflListOption
 * @class AoflListOption
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
   */
  static get is() {
    return 'aofl-list-option';
  }

  /**
   *
   */
  static get properties() {
    return {
      selected: String,
      disabled: Boolean,
      value: String
    };
  }

  /**
   * @return {Object}
   */
  _render() {
    return super._render(template);
  }

  /**
   *
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.clickCallback);
    this.renderComplete.then(() => {
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
   *
   * @memberof AoflListOption
   */
  disconnectedCallback() {
    this.removeEventListener('click', this.clickCallback);
  }
}

window.customElements.define(AoflListOption.is, AoflListOption);
