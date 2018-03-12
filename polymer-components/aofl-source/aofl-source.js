/**
 * @summary AoflSource
 * @class AoflSource
 * @extends {Polymer.Element}
 */
class AoflSource extends Polymer.Element {
  /**
   *
   */
  static get is() {
    return 'aofl-source';
  }

  /**
   *
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
   *
   */
  constructor() {
    super();
    if (typeof this.parentNode.matchMedia === 'function') {
      this.parentNode.addSource(this);
    }
  }
}

window.customElements.define(AoflSource.is, AoflSource);
