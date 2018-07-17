import {template} from './template';
import {html, LitElement} from '@polymer/lit-element';

/**
 * @summary AoflListOption
 * @class AoflListOption
 * @extends {LitElement}
 */
class AoflListOption extends LitElement {
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
      selected: {
        type: Boolean,
        value: false
      },
      disabled: {
        type: Boolean,
        value: false
      },
      value: String
    };
  }

  /**
   *
   */
  constructor() {
    super();
  }

  /**
   * @return {Object}
   */
  _render() {
    return html`${template(this)}`;
  }

  /**
   *
   */
  connectedCallback() {
    super.connectedCallback();
    this.value = this.value || this.textContent;
    this.list = null;
    this._addToParent();
    if (this.selected) {
      this._select();
    }
  }

  /**
   * Finds the parent list and adds itself to it
   */
  _addToParent() {
    let parent = this;
    while (parent = parent.parentNode) {
      if (typeof parent.addOption === 'function') {
        this.list = parent;
        parent.addOption(this);
        break;
      }
    }
  }

  /**
   * Update selected value in the parent list
   */
  _select() {
    this.list.updateSelected(this);
  }
}

window.customElements.define(AoflListOption.is, AoflListOption);
