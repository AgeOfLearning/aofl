/**
 * @summary AoflSelectList
 * @class AoflSelectList
 * @extends {Polymer.Element}
 */
class AoflSelectList extends Polymer.Element {
  /**
   *
   */
  constructor() {
    super();
    this.options = [];
    this.selectedValue = '';
  }

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
