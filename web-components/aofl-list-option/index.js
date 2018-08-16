import {template} from './template';
import {html, LitElement} from '@polymer/lit-element';
import {parentDepMixin} from '@aofl/parent-dep-mixin';

/**
 * @summary AoflListOption
 * @class AoflListOption
 * @extends {LitElement}
 */
class AoflListOption extends parentDepMixin(LitElement) {
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
    console.dir(this);
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
    this.renderComplete.then(() => {
      this.value = this.value || this.textContent;
      this.listElement = this.findParent('addOption');
      this.listElement.addOption(this);
      if (this.selected) {
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
}

window.customElements.define(AoflListOption.is, AoflListOption);
