/**
 * @summary AoflPicture
 * @class AoflPicture
 * @extends {Polymer.Element}
 */
class AoflPicture extends Polymer.Element {
  /**
   *
   */
  static get is() {
    return 'aofl-picture';
  }
  /**
   *
   */
  constructor() {
    super();
    this.img = null;
    this.defaultSrc = null;
    this.sources = [];
    this.boundMediaQueryListener = this._mediaQueryListener.bind(this);
  }

  /**
   * @param {HTMLElement} img
   */
  setImg(img) {
    if (this.img !== null) return;
    this.img = img;
    this.defaultSrc = {
      src: this.img.src || this.img.aoflSrc,
      viewbox: this.img.viewBox,
      height: this.img.height,
      width: this.img.width
    };
    this._mediaQueryListener();
  }

  /**
   * @param {*} source
   */
  addSource(source) {
    if (!document.documentElement.classList.contains('page-mobile')) return;
    let mediaQuery = window.matchMedia(source.getAttribute('media'));
    let src = source.getAttribute('srcset') || source.getAttribute('aofl-srcset');
    let sourceAttributes = {
      src,
      viewbox: source.getAttribute('data-viewbox'),
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
   */
  _mediaQueryListener() {
    let matchedSource = undefined;
    matchedSource = this._mqFind(this.sources);
    this._setMediaSrc(matchedSource);
  }
  /**
   * @param {*} source
   */
  _setMediaSrc(source = this.defaultSrc) {
    if (!this.img) return;
    let imgSrc = this.img.src;
    let imgVB = this.img.viewBox;

    if (imgSrc !== source.src || (imgVB && imgVB !== source.viewbox)) {
      this.img.src = source.src;

      if (source.width) {
        this.img.setAttribute('width', source.width);
      }

      if (source.height) {
        this.img.setAttribute('height', source.height);
      }

      if (source.viewbox) {
        this.img.setAttribute('viewBox', source.viewbox);
      } else {
        this.img.removeAttribute('view-box');
      }
    }
  }

  /**
   * @param {*} sources
   * @return {*}
   */
  _mqFind(sources = []) {
    for (let i = 0; i < sources.length; i++) {
      if (sources[i].mediaQuery.matches === true) {
        return sources[i];
      }
    }
  }

  /**
   *
   */
  disconnectedCallback() {
    for (let i = 0; i < this.sources.length; i++) {
      this.sources[i].mediaQuery.removeListener(this.boundMediaQueryListener);
    }
  }
}

window.customElements.define(AoflPicture.is, AoflPicture);
