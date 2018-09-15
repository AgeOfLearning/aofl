/**
 * AoflImg class implementation.
 *
 * @summary aofl-img
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */

import {template} from './template';
import AoflElement from '../aofl-element';
import {findParent, isInViewportMixin} from '@aofl/component-utils';

const BLANK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * aofl-img componont lazy loads images by default as they enter the viewport.
 *
 * @extends {AoflElement}
 */
class AoflImg extends isInViewportMixin(AoflElement) {
  /**
   * Creates an instance of AoflImg.
   */
  constructor() {
    super();
    this.imgSrc = BLANK_PIXEL;
    this.widthThreshold = 1;
    this.heightThreshold = 1;
  }

  /**
   *
   *
   * @readonly
   */
  static get is() {
    return 'aofl-img';
  }

  /**
   *
   * @readonly
   */
  static get properties() {
    return {
      src: String,
      width: String,
      height: String,
      alt: String
    };
  }


  /**
   * @param {*} args
   */
  connectedCallback(...args) {
    super.connectedCallback(...args);
    try {
      const parent = findParent(this, 'setImg');
      /* istanbul ignore next */
      parent.setImg(this);
    } catch (e) {
      this.loadImage(this.src);
    }
  }

  /**
   *
   *
   * @memberof AoflImg
   */
  firstWithinViewport() {
    this.stopIsInViewportCheck();
    this.loadImage(this.src);
  }

  /**
   *
   *
   * @return {Object}
   */
  _render() {
    return super._render(template);
  }

  /**
   *
   *
   * @param {String} name
   * @param {*} oldVal
   * @param {*} newVal
   */
  attributeChangedCallback(name, oldVal, newVal) {
    super.attributeChangedCallback(name, oldVal, newVal);

    if (name === 'src') { // handle src change
      this.loadImage(newVal);
    }
  }


  /**
   *
   * @param {String} src
   */
  loadImage(src) {
    if (this.onceWithinViewport !== true) return;
    this.imgSrc = src;
    this.requestRender();
  }

  /**
   *
   * @param {*} e
   */
  imageLoaded(e) {
    if (typeof this.width === 'undefined') {
      this.width = e.target.width;
    }

    if (typeof this.height === 'undefined') {
      this.height = e.target.height;
    }
  }
}

window.customElements.define(AoflImg.is, AoflImg);
