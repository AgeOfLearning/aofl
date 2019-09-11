/**
 * Implements AoflElement
 *
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @requires polymer/lit-element:LitElement
 * @requires polymer/lit-element:html
 */
import {LitElement, html, css} from 'lit-element';

const cachedStyles = Symbol('cachedStyles');
/**
 * Base class for all aofl-js elements.
 */
class AoflElement extends LitElement {
  /**
   * Creates an instance of AoflElement.
   */
  constructor() {
    super();
    this[cachedStyles] = [];
    this._observedPropertiesMap = new Map();
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

    for (let i = 0; i < styles.length; i++) {
      if (styles[i] !== this[cachedStyles][i]) {
        return true;
      }
    }


    return false;
  }
  /**
   *
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
        if (rStyle.parentNode === this.renderRoot) {
          rStyle.parentNode.removeChild(rStyle);
        }
      }

      this.adoptStyles();
    }

    return template(this, html);
  }
  /**
   * disconnectedCallback
   */
  disconnectedCallback() {
    this._observedPropertiesMap.forEach((cb) => {
      cb();
    });
    this._observedPropertiesMap.clear();
    super.disconnectedCallback();
  }
}

export {
  AoflElement
};
