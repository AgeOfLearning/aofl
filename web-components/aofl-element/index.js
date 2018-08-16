import {LitElement, html} from '@polymer/lit-element';

/**
 *
 *
 * @class AoflELement
 * @extends {LitElement}
 */
class AoflELement extends LitElement {
  /**
   * Creates an instance of AoflELement.
   *
   * @memberof AoflELement
   */
  constructor() {
    super();
  }

  /**
   *
   * @readonly
   * @static
   * @memberof AoflELement
   */
  static get is() {
    return 'aofl-element';
  }

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
    let s = styles.reduce((acc, item) => {
      if (item && item.length) {
        acc.push(html`<style>${String(item)}</style>`);
      }
      return acc;
    }, []);

    return html`${s}${template(this, html)}`;
  }
};

export default AoflELement;
