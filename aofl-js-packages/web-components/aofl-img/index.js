/**
 * AoflImg class implementation.
 *
 * @summary aofl-img
 * @version 1.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 *
 * @requires aofl-js/component-utils:isInViewportMixin
 */

import {template} from './template';
import {AoflElement} from '../aofl-element';
import {findParent, isInViewportMixin} from '@aofl/component-utils';

const BLANK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * aofl-img componont lazy loads images by default as they enter the viewport.
 *
 * @extends {AoflElement}
 * @fires AoflImg.load
 */
class AoflImg extends isInViewportMixin(AoflElement) {
  /**
   * Creates an instance of AoflImg
   */
  constructor() {
    super();
    this.imgSrc = BLANK_PIXEL;
    this.src = BLANK_PIXEL;
    this.widthThreshold = 1;
    this.heightThreshold = 1;
  }

  /**
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
      src: {type: String},
      imgSrc: {type: String, attribute: false},
      width: {type: String},
      height: {type: String},
      alt: {type: String}
    };
  }


  /**
   * @param {*} args
   */
  connectedCallback(...args) {
    super.connectedCallback(...args);
    setTimeout(() => {
      this.checkInViewport();
    });
    this.loadImage(this.src);
    try {
      const parent = findParent(this, 'setImg');
      /* istanbul ignore next */
      parent.setImg(this);
    } catch (e) {
      this.loadImage(this.src);
    }
  }

  /**
   * Stop checking isInViewStatus and load the image
   */
  firstWithinViewport() {
    this.stopIsInViewportCheck();
    this.loadImage(this.src);
  }

  /**
   *
   * @return {Object}
   */
  render() {
    return super.render(template);
  }

  /**
   *
   * @param {String} changedProperties
   * @return {Boolean}
   */
  shouldUpdate(changedProperties) {
    if (changedProperties.has('src') && typeof this.src === 'string') {
      this.loadImage(this.src);
    }
    return true;
  }


  /**
   *
   * @param {String} src
   */
  loadImage(src) {
    if (this.onceWithinViewport !== true) { return; }
    this.imgSrc = src;
    this.requestUpdate();
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
    this.dispatchEvent(new CustomEvent('load'));
  }
}

if (window.customElements.get(AoflImg.is) === void 0) {
  window.customElements.define(AoflImg.is, AoflImg);
}
