/**
 * @summary AoflListOption
 * @class AoflListOption
 * @extends {Polymer.Element}
 */
class AoflListOption extends Polymer.Element {
  /**
   *
   */
  constructor() {
    super();
  }

  /**
   *
   */
  addToParent() {
    let parent = this;
    while (parent = parent.parentNode) {
      if (typeof parent.addOption === 'function') {
        parent.addOption(this);
        break;
      }
    }
  }

  /**
   *
   */
  connectedCallback() {
    super.connectedCallback();
    this.value = this.value || this.textContent;
    this.addToParent();
    if (this.selected) {
      this.parentNode.updateSelected(this);
    }
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
  select() {
    this.parentNode.updateSelected(this);
  }
}

window.customElements.define(AoflListOption.is, AoflListOption);
