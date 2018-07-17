/**
 * @summary AoflSvg
 * @class AoflSvg
 * @extends {Polymer.Element}
 */
class AoflSvg extends Polymer.Element {
  /**
   * constructor
  */
  constructor() {
    super();
  }
  /**
   *
   */
  static get is() {
    return 'aofl-svg';
  }

  /**
   *
   */
  static get properties() {
    return {
      width: {
        type: String,
        value: ''
      },
      height: {
        type: String,
        value: ''
      },
      data: {
        type: String,
        value: '',
        observer: '__dataChange'
      }
    };
  }

  /**
   *
   * @param {String} newVal
   * @param {String} oldVal
   */
  __dataChange(newVal, oldVal) {
    this.$['svg-wrapper'].innerHTML = newVal;
  }

  /**
   * connectedCallback
   */
 connectedCallback() {
    super.connectedCallback();
  }
}

window.customElements.define(AoflSvg.is, AoflSvg);
