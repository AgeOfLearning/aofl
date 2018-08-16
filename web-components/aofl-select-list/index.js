import {template} from './template';
// import styles from './styles.css';
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
      disabled: Boolean,
      options: Array
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
   * @param {String} value
   */
  updateSelected(value) {
    let selectedValue = '';
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].removeAttribute('selected');
      if (this.options[i].value === value) {
        let selected = this.options[i];
        selected.setAttribute('selected', 'true');
        selectedValue = selected.value;
      }
    }

    this.selectedValue = selectedValue;
    this.dispatchEvent(new CustomEvent('change'));
  }

  /**
   * @param {String} option
   */
  addOption(option) {
    this.options.push(option);
    if (option.getAttribute('selected') === 'true') {
      this.updateSelected(option.value);
    }
  }
}

window.customElements.define(AoflSelectList.is, AoflSelectList);
