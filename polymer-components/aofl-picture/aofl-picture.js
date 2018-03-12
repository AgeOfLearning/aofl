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
    this.mqImages = [];
    this.sourcesToAdd = [];
    this.mediaQueries = [];
  }

  /**
   * @param {*} img
   */
  setImg(img) {
    this.img = img;
    this.setDefaultSrc();
    this.sourcesToAdd.forEach((source) => this.matchMedia(source));
    this.sourcesToAdd.length = 0;
  }

  /**
   *
   */
  setDefaultSrc() {
    this.defaultSrc = {
      src: this.img.src || this.img.aoflSrc,
      viewbox: this.img.viewBox,
      height: this.img.height,
      width: this.img.width
    };
  }

  /**
   * @param {*} source
   */
  addSource(source) {
    if (this.img) {
      this.matchMedia(source);
    } else {
      this.sourcesToAdd.push(source);
    }
  }

  /**
   *@param {*} source
   */
  matchMedia(source) {
    let initSource = null;

    let mediaQuery = window.matchMedia(source.getAttribute('media'));
    let srcset = source.getAttribute('srcset') || source.getAttribute('aofl-srcset');
    let sourceAttributes = {
      src: srcset,
      viewbox: source.getAttribute('data-viewbox'),
      height: source.getAttribute('data-height'),
      width: source.getAttribute('data-width'),
      mediaQuery
    };

    this.mqImages.push(sourceAttributes);
    if (document.documentElement
      .classList.contains('page-mobile')) { // @todo: change
      if (mediaQuery.matches) {
        initSource = sourceAttributes;
      }
      let listener = this._selectMediaSrc.bind(this);
      this.mediaQueries.push({
        mediaQuery,
        listener
      });
      mediaQuery.addListener(listener);
    }

    this._setMediaSrc(initSource);
  }

  /**
   * @param {*} e
   */
  _selectMediaSrc(e) {
    if (typeof e === 'undefined' || !e.matches) {
      if (!this.mqImages.some(this._mqMatches)) {
        this._setMediaSrc();
      }
      return;
    }

    this._setMediaSrc(this.mqImages.find(this._mqFind.bind(null, e)));
  }
  /**
   * @param {*} _source
   */
  _setMediaSrc(_source) {
    let source = _source || this.defaultSrc;
    let imgSrc = this.img.src;
    let imgVB = this.img.viewBox;

    if (imgSrc !== source.src || (imgVB && imgVB !== source.viewbox)) {
      this.img.src = source.src;
      if (source.width) {
        this.img.width = source.width;
      }
      if (source.height) {
        this.img.height = source.height;
      }
      if (source.viewbox) {
        this.img.viewBox = source.viewbox;
      } else {
        this.img.removeAttribute('view-box');
      }
    }
  }

  /**
   * @param {*} item
   * @return {*}
   */
  _mqMatches(item) {
    return item.mediaQuery.matches;
  }
  /**
   * @param {*} e
   * @param {*} item
   * @return {*}
   */
  _mqFind(e, item) {
    return item.mediaQuery.media === e.media;
  }

  /**
   *
   */
  disconnectedCallback() {
    this.mediaQueries.forEach((mq) => mq.mediaQuery.removeListener(mq.listener));
    this.mediaQueries.length = 0;
  }
}

window.customElements.define(AoflPicture.is, AoflPicture);
