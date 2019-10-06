/**
 * @summary aofl-source
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {AoflElement} from '@aofl/element';
import {findParent} from '@aofl/component-utils';
/**
 * AoflSource component must be used as a child of aofl-picture and specifies images
 * for different media queries.
 *
 * @memberof module:@aofl/picture
 * @extends {AoflElement}
 */
class AoflSource extends AoflElement {
  /**
   * @param {*} args
   */
  connectedCallback(...args) {
    super.connectedCallback(...args);
    const parent = findParent(this, 'addSource');
    /* istanbul ignore next */
    if (!parent) {
      throw new Error('aofl-source must be used inside of aofl-picture');
    }

    parent.addSource(this);
  }
  /**
   * @readonly
   */
  static get is() {
    return 'aofl-source';
  }
  /**
   * @readonly
   */
  static get properties() {
    return {
      media: {type: String},
      srcset: {type: String}
    };
  }
  /**
   * @return {Object}
   */
  render() {
    return super.render((ctx, html) => html``);
  }
}

if (window.customElements.get(AoflSource.is) === void 0) {
  window.customElements.define(AoflSource.is, AoflSource);
}

export default AoflSource;
