import {template} from './template';
import {html, LitElement} from '@polymer/lit-element';

/**
 * @summary AoflPicture
 * @class AoflPicture
 * @extends {LitElement}
 */
class AoflPicture extends LitElement {
  /**
   *
   *
   * @readonly
   * @static
   * @memberof AoflPicture
   */
  static get is() {
    return 'aofl-picture';
  }

  /**
   * Creates an instance of AoflPicture.
   * @memberof AoflPicture
   */
  constructor() {
    super();
    this.img = null;
    this.defaultSrc = null;
    this.sources = [];
    this.boundMediaQueryListener = this._mediaQueryListener.bind(this);
  }

  /**
   *
   *
   * @return {Object}
   * @memberof AoflPicture
   */
  _render() {
    return html`${template(this)}`;
  }

  /**
   *
   *
   * @param {HTMLElement} img
   * @memberof AoflPicture
   */
  setImg(img) {
    if (this.img !== null) return;
    this.img = img;
    this.defaultSrc = {
      src: this.img.src || this.img.aoflSrc,
      height: this.img.height,
      width: this.img.width
    };
    this._mediaQueryListener();
  }

  /**
   *
   *
   * @param {String} source
   * @memberof AoflPicture
   */
  addSource(source) {
    if (!document.documentElement.classList.contains('page-mobile')) return;
    let mediaQuery = window.matchMedia(source.getAttribute('media'));
    let src = source.getAttribute('srcset') || source.getAttribute('aofl-srcset');
    let sourceAttributes = {
      src,
      height: source.getAttribute('data-height'),
      width: source.getAttribute('data-width'),
      mediaQuery
    };

    this.sources.push(sourceAttributes);
    mediaQuery.addListener(this.boundMediaQueryListener);

    this._mediaQueryListener();
  }

  /**
   *
   *
   * @memberof AoflPicture
   */
  _mediaQueryListener() {
    let matchedSource = this._findMediaQuery(this.sources);
    this._setMediaSrc(matchedSource);
  }

  /**
   *
   *
   * @param {String} [source=this.defaultSrc]
   * @memberof AoflPicture
   */
  _setMediaSrc(source = this.defaultSrc) {
    if (!this.img) return;
    let imgSrc = this.img.src;

    if (imgSrc !== source.src) {
      this.img.src = source.src;

      if (source.width) {
        this.img.setAttribute('width', source.width);
      }

      if (source.height) {
        this.img.setAttribute('height', source.height);
      }
    }
  }

  /**
   *
   *
   * @param {Array} [sources=[]]
   * @return {String}
   * @memberof AoflPicture
   */
  _findMediaQuery(sources = []) {
    for (let i = 0; i < sources.length; i++) {
      if (sources[i].mediaQuery.matches === true) {
        return sources[i];
      }
    }
  }

  /**
   *
   *
   * @memberof AoflPicture
   */
  disconnectedCallback() {
    for (let i = 0; i < this.sources.length; i++) {
      this.sources[i].mediaQuery.removeListener(this.boundMediaQueryListener);
    }
  }
}

window.customElements.define(AoflPicture.is, AoflPicture);
