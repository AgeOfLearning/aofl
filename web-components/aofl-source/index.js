import {template} from './template';
import {html, LitElement} from '@polymer/lit-element';

/**
 * @summary AoflSource
 * @class AoflSource
 * @extends {LitElement}
 */
class AoflSource extends LitElement {
  /**
   *
   *
   * @readonly
   * @static
   * @memberof AoflSource
   */
  static get is() {
    return 'aofl-source';
  }

  /**
   *
   *
   * @readonly
   * @static
   * @memberof AoflSource
   */
  static get properties() {
    return {
      media: String,
      aoflSrcset: String,
      srcset: String,
      dataViewbox: String,
      dataWidth: String,
      dataHeight: String,
      group: String
    };
  }

  /**
   * Creates an instance of AoflSource.
   * @memberof AoflSource
   */
  constructor() {
    super();
    if (typeof this.parentNode.addSource === 'function') {
      this.parentNode.addSource(this);
    }
  }

  /**
   *
   *
   * @return {Object}
   * @memberof AoflSource
   */
  _render() {
    return html`${template(this)}`;
  }
}

window.customElements.define(AoflSource.is, AoflSource);
