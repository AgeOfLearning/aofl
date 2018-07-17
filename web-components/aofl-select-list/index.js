import {template} from './template';
import styles from './styles.css';
import {html, LitElement} from '@polymer/lit-element';

/**
 * @summary AoflSelectList
 * @class AoflSelectList
 * @extends {LitElement}
 */
class AoflSelectList extends LitElement {
  /**
   *
   */
  static get is() {
    return 'aofl-select-list';
  }

  /**
   *
   */
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        value: false
      },
      options: {
        type: Array
      }
    };
  }

  /**
   *
   */
  constructor() {
    super();
    this.options = [];
    this.selectedValue = '';
  }

  /**
   * @return {Object}
   */
  _render() {
    return html`${template(this)}`;
  }

  /**
   * Updated selected value and dispatches a custom event with that value
   *
   * @param {Object} option
   */
  updateSelected(option) {
    this.options.forEach((_option) => _option.removeAttribute('selected'));
    option.setAttribute('selected', 'true');
    this.selectedValue = option.value;
    this.dispatchEvent(new CustomEvent('select-list-change', {
      composed: true,
      detail: {
        selected: option.value
      }
    }));
  }

  /**
   * @param {String} option
   */
  addOption(option) {
    this.options.push(option);
  }
}

window.customElements.define(AoflSelectList.is, AoflSelectList);
