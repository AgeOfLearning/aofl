/**
 * Implements AoflElement
 *
 * @version 4.0.0
 * @since 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {get, has} from '@aofl/object-utils';
import {html, css, LitElement, adoptStyles} from 'lit';

/**
  * @private
  * @memberof module:@aofl/element
  * @type {Symbol}
  */
const cachedStyles = Symbol('cachedStyles');
/**
 * Base class for all aofl-js elements.
 *
 * @memberof module:@aofl/element
 * @extends LitElement
 */
class AoflElement extends LitElement {
  /**
    * Creates an instance of AoflElement.
    */
  constructor() {
    super();
    this[cachedStyles] = [];
    this._mapStatePropertiesUnsub = new Map();
  }
  /**
    * Check if styles have been updated
    *
    * @private
    * @param {Array} styles
    * @return {Boolean}
    */
  stylesUpdated(styles) {
    if (this[cachedStyles].length !== styles.length) {
      return true;
    }

    /* istanbul ignore next */
    for (let i = 0; i < styles.length; i++) {
      if (styles[i] !== this[cachedStyles][i]) {
        return true;
      }
    }


    return false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (typeof this._mapStateProperties === 'undefined') return;
    this._mapStateProperties.forEach((value, property) => {
      const updateValue = () => {
        const state = value.store.state;
        if (has(state, value.path)) {
          this[property] = get(state, value.path);
        } else {
          this[property] = get(value.store, value.path);
        }
      };

      updateValue();
      const unsubscribe = value.store.subscribe(updateValue);
      this._mapStatePropertiesUnsub.set(property, unsubscribe);
    });
  }
  /**
    * @protected
    * @param {Function} template
    * @param {Array} [styles=[]]
    * @param {Array} args
    * @return {Object}
    */
  render(template, styles = []) {
    if (this.stylesUpdated(styles)) {
      this[cachedStyles] = styles;
      const s = [
        css([
          styles.reduce((acc, item) => {
            acc = acc + item;
            return acc;
          }, '')
        ])
      ];

      this.constructor._styles = s;
      const renderedStyles = this.renderRoot.querySelectorAll('style');

      for (const rStyle of renderedStyles) {
        /* istanbul ignore next */
        if (rStyle.parentNode === this.renderRoot) {
          rStyle.parentNode.removeChild(rStyle);
        }
      }

      adoptStyles(this.renderRoot, s);
    }

    return template(this, html);
  }
  /**
   * disconnectedCallback
   * @protected
   */
  disconnectedCallback() {
    this._mapStatePropertiesUnsub.forEach((unsubscribe) => {
      unsubscribe();
    });
    this._mapStatePropertiesUnsub.clear();
    super.disconnectedCallback();
  }
}

export {
  AoflElement
};
