/**
 * @summary AoflDrawer
 * @class AoflDrawer
 * @extends {Polymer.Element}
 */
class AoflDrawer extends Polymer.Element {
  /**
   *
   */
  static get is() {
    return 'aofl-drawer';
  }

  /**
   *
   */
  static get properties() {
    return {
      open: {
        type: Boolean,
        value: false,
        observer: '__openObserver'
      }
    };
  }

  /**
   *
   */
  constructor() {
    super();
    this.addEventListener('animationend', this.__animationEndHandler);
    this.addEventListener('transitionend', this.__animationEndHandler);
    this.addEventListener('click', this.__stopPropagation);
    this.cancelOpen = null;
  }

  /**
   * @param {Function} callback
   * @return {Promise}
  */
  __startOpeningAnimation(callback) {
    let cancel = false;
    let max = 100;
    let testDisplayBlock = () => {
      let display = window.getComputedStyle(this).getPropertyValue('display');

      if (display === 'block') {
        callback();
      } else if (!cancel && max-- > 0) {
        Polymer.Async.animationFrame.run(() => {
          testDisplayBlock();
        });
      }
    };

    testDisplayBlock();
    return () => {
      cancel = true;
    };
  }
  /**
   * @param {Boolean} newVal
   * @param {Boolean} oldVal
   */
  __openObserver(newVal, oldVal) {
    if (newVal === true) {
      this.cancelOpen = this.__startOpeningAnimation(() => {
        this.classList.add('opening');
        this.classList.remove('closing');
      });
    } else if (typeof oldVal !== 'undefined') {
      if (typeof this.cancelOpen === 'function') {
        this.cancelOpen();
        this.cancelOpen = null;
      }

      this.classList.remove('opening');
      this.classList.remove('open');
      this.classList.add('closing');
    }
  }

  /**
   * @param {Event} e
   */
  __animationEndHandler(e) {
    if (this.classList.contains('opening')) {
      this.classList.replace('opening', 'open');
    } else {
      this.classList.remove('closing');
    }
  }

  /**
   *
   * @param {Event} e
   */
  __stopPropagation(e) {
    e.stopPropagation();
  }

  /**
   *
   */
  disconnectedCallback() {
    this.removeEventListener('animationend', this.__animationEndHandler);
    this.removeEventListener('transitionend', this.__animationEndHandler);
    this.removeEventListener('click', this.__stopPropagation);
  }
}

window.customElements.define(AoflDrawer.is, AoflDrawer);
