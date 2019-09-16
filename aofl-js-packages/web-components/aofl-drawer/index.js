/**
 * Implements AoflDrawer.
 *
 * @summary aofl-drawer
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

import {template} from './template';
import {AoflElement} from '../aofl-element';
/**
 * @summary AoflDrawer
 * @fires AoflDrawer.change
 * @extends {AoflElement}
 */
class AoflDrawer extends AoflElement {
  /**
   * Creates an instance of AoflDrawer.
   */
  constructor() {
    super();
    this.open = null;
    this.transitionEndCount = 0;
    this['transition-count'] = 1;
  }

  /**
   * @readonly
   */
  static get is() {
    return 'aofl-drawer';
  }

  /**
   * @readonly
   * @property {Boolean} open - state of drawer
   * @property {String} trigger - className that triggers animations
   * @property {String} opening - className of opening animation
   * @property {String} closing - className of closing animation
   */
  static get properties() {
    return {
      'open': {type: Boolean},
      'trigger': {type: String},
      'opening': {type: String},
      'closing': {type: String},
      'transition-count': {type: Number}
    };
  }

  /**
   *
   */
  connectedCallback(...args) {
    super.connectedCallback(...args);
    // Set defaults
    this.cancelOpen = null;
    this.trigger = this.trigger || 'animate';
    this.animated = typeof this.opening !== 'undefined' && typeof this.closing !== 'undefined';

    // Initialize class to prepare for next animation
    if (this.animated) {
      if (this.open) {
        this.classList.remove(this.opening);
        this.classList.add(this.closing);
      } else {
        this.classList.remove(this.closing);
        this.classList.add(this.opening);
      }

      this.addEventListener('animationend', this.animationEndHandler);
      this.addEventListener('transitionend', this.animationEndHandler);
    }
  }

  /**
   * @return {Object}
   */
  render() {
    return super.render(template);
  }

  /**
   *
   * @param {*} name
   * @param {*} oldValue
   * @param {*} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    /* istanbul ignore else */
    if (name === 'open') {
      if (this.animated) {
        this.openChanged(this.open);
      } else {
        this.dispatchEvent(new CustomEvent('drawer-toggle', {
          composed: true
        }));
      }
    }
  }

  /**
   * @param {Boolean} newVal
   * @private
   */
  openChanged(newVal) {
    /* istanbul ignore else */
    if (newVal === true) {
      this.cancelOpen = this.startOpeningAnimation(() => {
        this.transitionEndCount = 0;
        this.classList.remove(this.closing);
        this.classList.add(this.opening);
        this.classList.add(this.trigger);
      });
    } else if (this.classList.contains(this.closing) || this.classList.contains(this.trigger)) {
      if (typeof this.cancelOpen === 'function') {
        this.cancelOpen();
        this.cancelOpen = null;
      }
      this.classList.remove(this.opening);
      this.classList.add(this.closing);
      this.classList.add(this.trigger);
      this.classList.add('closing');
    }
  }

  /**
   * Waits for display block to be present before adding animation
   *
   * @param {Function} callback
   * @return {Function}
   * @private
   */
  startOpeningAnimation(callback) {
    let cancel = false;
    let max = 100;

    const testDisplayBlock = () => {
      const display = window.getComputedStyle(this).getPropertyValue('display');
      /* istanbul ignore next */
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
   * @private
   */
  animationEndHandler(e) {
    if (e.target !== this) {
      return;
    }
    this.transitionEndCount += 1;
    if (this.transitionEndCount === this['transition-count']) {
      this.transitionEndCount = 0;
      this.classList.remove(this.trigger);
      if (this.classList.contains(this.opening)) {
        this.classList.remove(this.opening);
        this.classList.add(this.closing);
        this.cancelOpen = null;
      } else {
        this.classList.add(this.opening);
        this.classList.remove(this.closing);
        this.classList.remove('closing');
      }

      setTimeout(() => { // queue micro task
        this.dispatchEvent(new CustomEvent('drawer-toggle', {
          composed: true
        }));
      });
    }
  }

  /**
   *
   */
  disconnectedCallback(...args) {
    super.disconnectedCallback(...args);
    if (this.animated) {
      this.removeEventListener('animationend', this.animationEndHandler);
      this.removeEventListener('transitionend', this.animationEndHandler);
    }
  }
}

if (window.customElements.get(AoflDrawer.is) === void 0) {
  window.customElements.define(AoflDrawer.is, AoflDrawer);
}

export default AoflDrawer;
