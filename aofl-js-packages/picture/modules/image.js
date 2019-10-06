/**
 * AoflImg class implementation.
 *
 * @summary aofl-img
 * @version 3.0.0
 * @since 3.0.0
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
import {AoflElement} from '@aofl/element';
import {findParent, isInViewportMixin} from '@aofl/component-utils';

/**
 * @memberof module:@aofl/picture
 * @private
 * @type {String}
 */
const BLANK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * aofl-img componont lazy loads images by default as they enter the viewport.
 *
 * @memberof module:@aofl/picture
 * @extends {AoflElement}
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
   * @static
   */
  static get is() {
    return 'aofl-img';
  }
  /**
   *
   * @readonly
   * @static
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
    return super.render((ctx, html) => html`
      <canvas width="${ctx.width}" height="${ctx.height}"></canvas>
      <img alt="${ctx.alt}" height="${ctx.height}" width="${ctx.width}" src="${ctx.imgSrc}" @load="${(e) => ctx.imageLoaded(e)}">
    `, [
      `
        :host {
          display: inline-block;
          position: relative;
          line-height: 0;
        }

        :host canvas {
          width: 100%;
          height: 100%;
        }

        :host img {
          display: inline-block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
    `
    ]);
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
   * @param {Event} e
   * @fires AoflImg#load
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

export default AoflImg;
