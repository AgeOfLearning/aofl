/**
 * Implements AoflElement
 *
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @requires polymer/lit-element:LitElement
 * @requires polymer/lit-element:html
 */
import {LitElement, html} from 'lit-element';

/**
 * Base class for all aofl-js elements.
 */
class AoflElement extends LitElement {
  /**
   *
   * @param {Function} template
   * @param {Array} [styles=[]]
   * @param {Array} args
   * @return {Object}
   */
  render(template, styles = []) {
    const s = html`<style>${styles.reduce((acc, item) => {
      if (item && item.length) {
        acc += `${String(item)}`;
      }
      return acc;
    }, '')}</style>`;

    return html`${s} ${template(this, html)}`;
  }
}

export {
  AoflElement
};
