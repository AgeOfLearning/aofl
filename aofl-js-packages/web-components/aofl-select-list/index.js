/**
 * Implements AoflSelectList
 *
 * @summary aofl-select-list
 * @version 1.0.0
 * @author Daniel Belisle <daniel.belisle@aofl.com>
 *
 * @requires AoflElement
 */
import {template} from './template';
import {AoflElement} from '../aofl-element';

/**
 * @extends {AoflElement}
 * @fires AoflSelectList.change
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
    return {};
  }

  /**
   *
   */
  constructor() {
    super();
    this.options = [];
    this.value = '';
    this.focusIndex = 0;
  }


  /**
   *
   */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.keydownCallback);
    this.addEventListener('focusout', this.focusoutCallback);
    this.addEventListener('mouseover', this.mouseoverCallback);
  }

  /**
   * @return {Object}
   */
  render() {
    return super.render(template);
  }

  /**
   * If the element losing focus is not a child of the list reset the focusIndex
   *
   * @param {Event} e
   */
  focusoutCallback(e) {
    if (e.relatedTarget && e.relatedTarget.parentNode === this) { return; }

    this.focusIndex = 0;
  }

  /**
   * @param {Event} e
   */
  keydownCallback(e) {
    e.preventDefault();
    if (e.keyCode === 38 || (e.shiftKey && e.keyCode === 9)) { // up arrow or shift tab
      if (this.focusIndex > 0) {
        this.options[--this.focusIndex].focus();
      }
    } else if (e.keyCode === 40 || e.keyCode === 9) { // down arrow or tab
      if (this.focusIndex < this.options.length - 1) {
        this.options[++this.focusIndex].focus();
      }
    }
  }

  /**
   * @param {Event} e
   */
  mouseoverCallback(e) {
    const index = this.options.indexOf(e.target);
    if (index > -1) {
      this.focusIndex = index;
    }
  }

  /**
   * Updated selected value and dispatches a custom event with that value
   *
   * @param {Boolean} dispatch
   */
  updateSelected(option, dispatch = true, init = false) {
    option.setAttribute('selected', '');
    option.selected = true;
    this.value = option.value;
    if (dispatch) {
      this.dispatchEvent(new CustomEvent('change', {composed: true, bubbles: true}));
    }
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i] !== option) {
        this.options[i].selected = false;
      }
    }
  }

  /**
   * Add an option to be selected
   *
   * @param {String} option
   */
  addOption(option) {
    this.options.push(option);

    if (this.options.length === 1) {
      this.value = option.value;
    } else if (option.selected) {
      this.updateSelected(option, false);
    }
  }

  /**
   *
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.keydownCallback);
    this.removeEventListener('focusout', this.focusoutCallback);
    this.removeEventListener('mouseover', this.mouseoverCallback);
  }
}

if (window.customElements.get(AoflSelectList.is) === void 0) {
  window.customElements.define(AoflSelectList.is, AoflSelectList);
}
