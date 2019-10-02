/**
 * Implements AoflMultiselectList
 *
 * @summary aofl-multiselect-list
 * @version 1.0.0
 * @author Daniel Belisle <daniel.belisle@aofl.com>
 *
 * @requires AoflElement
 */
import {template} from './template';
import {AoflElement} from '../aofl-element';

/**
 * @extends {AoflElement}
 * @fires AoflMultiselectList.change
 */
class AoflMultiselectList extends AoflElement {
  /**
   * @readonly
   */
  static get is() {
    return 'aofl-multiselect-list';
  }

  /**
   * @readonly
   */
  static get properties() {
    return {
      options: {type: Array, attribute: false},
      selected: {type: Array, attribute: false}
    };
  }

  /**
   *
   */
  constructor() {
    super();
    this.options = [];
    this.selected = [];
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
   * Handle the tab and arrow focus logic within the list
   *
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
   * Focus list options that are hovered over
   *
   * @param {Event} e
   */
  mouseoverCallback(e) {
    const index = this.options.indexOf(e.target);
    if (index > -1) {
      this.focusIndex = index;
    }
  }

  /**
   * Toggle selected on list element and dispatch custom change event
   *
   * @param {Boolean} dispatch
   */
  updateSelected(option, dispatch = true) {
    const selected = [];
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i] === option) {
        if (option.selected) {
          option.selected = false;
        } else {
          option.selected = true;
          if (selected.indexOf(option.value) === -1) {
            selected.push(option.value);
          }
        }
      } else {
        if (this.options[i].selected && selected.indexOf(this.options[i].value) === -1) {
          selected.push(this.options[i].value);
        }
      }
    }

    this.selected = selected;

    if (dispatch) {
      this.dispatchEvent(new CustomEvent('change'));
    }
  }

  /**
   * Remove all items from selected array and remove selected attributes from all list options
   *
   */
  clearSelected() {
    this.selected.length = 0;
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].removeAttribute('selected');
    }

    this.dispatchEvent(new CustomEvent('change'));
  }

  /**
   * Add an option to be selected
   *
   * @param {String} option
   */
  addOption(option) {
    this.options.push(option);
    if (option.selected && this.selected.indexOf(option.value) === -1) {
      this.selected.push(option.value);
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

if (window.customElements.get(AoflMultiselectList.is) === void 0) {
  window.customElements.define(AoflMultiselectList.is, AoflMultiselectList);
}
