import {LitElement, html} from '@polymer/lit-element';

/**
 *
 *
 * @class AoflELement
 * @extends {LitElement}
 */
class AoflElement extends LitElement {
  /**
   *
   *
   * @param {Function} template
   * @param {Array} [styles=[]]
   * @param {Array} args
   * @return {Object}
   * @memberof AoflELement
   */
  _render(template, styles = []) {
    let s = html`<style>\n${styles.reduce((acc, item) => {
      if (item && item.length) {
        acc += `${String(item)}\n`;
      }
      return acc;
    }, '')}\n</style>`;

    return html`${s} ${template(this, html)}`;
  }
};

export default AoflElement;
