import {template} from './template';
import {html, LitElement} from '@polymer/lit-element';

/**
 * @summary AoflDrawer
 * @class AoflDrawer
 * @extends {LitElement}
 */
class AoflDrawer extends LitElement {
  /**
   *
   *
   * @readonly
   * @static
   * @memberof AoflDrawer
   */
  static get is() {
    return 'aofl-drawer';
  }

  /**
   *
   *
   * @readonly
   * @static
   * @property {Boolean} open - state of drawer
   * @property {String} trigger - className that triggers animations
   * @property {String} opening - className of opening animation
   * @property {String} closing - className of closing animation
   * @memberof AoflDrawer
   */
  static get properties() {
    return {
      open: Boolean,
      trigger: String,
      opening: String,
      closing: String
    };
  }

  /**
   * Creates an instance of AoflDrawer.
   * @memberof AoflDrawer
   */
  constructor() {
    super();
  }

  /**
   *
   *
   * @memberof AoflDrawer
   */
  connectedCallback(...args) {
    super.connectedCallback(...args);

    // Set defaults
    this.cancelOpen = null;
    this.trigger = this.trigger || 'animate';

    // Initialize class to prepare for next animation
    this.className = this.open ? this.closing : this.opening;

    this.addEventListener('animationend', this.animationEndHandler);
    this.addEventListener('transitionend', this.animationEndHandler);
  }

  /**
   *
   *
   * @return {Object}
   * @memberof AoflDrawer
   */
  _render() {
    return html`${template()}`;
  }

  /**
   *
   *
   * @param {String} name
   * @param {Boolean} oldVal
   * @param {Boolean} newVal
   * @memberof AoflDrawer
   */
  attributeChangedCallback(name, oldVal, newVal) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (typeof this.opening === 'undefined' || typeof this.closing === 'undefined') {
      return;
    }

    let callBack = name + 'Changed';
    if (typeof this[callBack] === 'function') {
      this[callBack](newVal, oldVal);
    }
  }

  /**
   *
   *
   * @param {Boolean} newVal
   * @param {Boolean} oldVal
   * @memberof AoflDrawer
   * @private
   */
  openChanged(newVal, oldVal) {
    if (newVal === 'true') {
      this.cancelOpen = this.startOpeningAnimation(() => {
        this.classList.replace(this.closing, this.opening);
        this.classList.add(this.trigger);
      });
    } else if (typeof oldVal !== 'undefined') {
      if (typeof this.cancelOpen === 'function') {
        this.cancelOpen();
        this.cancelOpen = null;
      }
      this.classList.replace(this.opening, this.closing);
      this.classList.add(this.trigger);
      this.classList.add('closing');
    }
  }

  /**
   * Waits for display block to be present before adding animation
   *
   * @param {Function} callback
   * @return {Function}
   * @memberof AoflDrawer
   * @private
   */
  startOpeningAnimation(callback) {
    let cancel = false;
    let max = 100;

    let testDisplayBlock = () => {
      let display = window.getComputedStyle(this).getPropertyValue('display');
      if (display === 'block') {
        callback();
      } else if (!cancel && max-- > 0) {
        window.requestAnimationFrame(testDisplayBlock);
      }
    };

    testDisplayBlock();
    return () => {
      cancel = true;
    };
  }

  /**
   * Removes closed after drawer closes so display: none can be applied
   *
   * @memberof AoflDrawer
   * @private
   */
  animationEndHandler() {
    this.classList.remove(this.trigger);
    let drawerState = 'open';
    if (this.classList.contains(this.opening)) {
      this.classList.replace(this.opening, this.closing);
      drawerState = 'closed';
    } else {
      this.classList.replace(this.closing, this.opening);
      this.classList.remove('closing');
    }
    this.dispatchEvent(new CustomEvent('aofl-drawer-change', {
      composed: true,
      detail: {
        drawerState
      }
    }));
  }

  /**
   *
   *
   * @memberof AoflDrawer
   */
  disconnectedCallback(...args) {
    super.disconnectedCallback(...args);
    this.removeEventListener('animationend', this.animationEndHandler);
    this.removeEventListener('transitionend', this.animationEndHandler);
  }
}

window.customElements.define(AoflDrawer.is, AoflDrawer);
