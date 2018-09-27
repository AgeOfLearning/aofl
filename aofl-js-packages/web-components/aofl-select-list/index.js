/**
 * Implements AoflSelectList
 *
 * @summary aofl-select-list
 * @version 1.0.0
 * @author Daniel Belisle <daniel.belisle@aofl.com>
 */
import {template} from './template';
import AoflElement from '../aofl-element';

/**
 * @class AoflSelectList
 * @extends {AoflElement}
 */
class AoflSelectList extends AoflElement {
  /**
   * @readonly
   */
  static get is() {
    return 'aofl-select-list';
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      disabled: String
    };
  }

  /**
   *
   */
  constructor() {
    super();
    this.options = [];
    this.value = '';
  }

  /**
   * @return {Object}
   */
  _render() {
    return super._render(template);
  }

  /**
   * Updated selected value and dispatches a custom event with that value
   *
   * @param {String} newValue
   */
  updateSelected(newValue) {
    let value = '';
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].removeAttribute('selected');
      if (this.options[i].value === newValue) {
        let selected = this.options[i];
        selected.setAttribute('selected', 'true');
        value = selected.value;
      }
    }

    this.value = value;
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