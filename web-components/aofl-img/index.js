import {template} from './template';
import {html, LitElement} from '@polymer/lit-element';

/**
 * @summary AoflImg
 * @class AoflImg
 * @extends {LitElement}
 */
class AoflImg extends LitElement {
  /**
   *
   *
   * @readonly
   * @static
   * @memberof AoflImg
   */
  static get is() {
    return 'aofl-img';
  }

  /**
   *
   *
   * @readonly
   * @static
   * @memberof AoflImg
   */
  static get properties() {
    return {
      aoflSrc: String,
      src: String,
      width: String,
      height: String,
      alt: String
    };
  }

  /**
   * Creates an instance of AoflImg.
   * @memberof AoflImg
   */
  constructor() {
    super();
    this.img = null;
    this.imgLoaded = false;
  }


  /**
   *
   *
   * @memberof AoflImg
   */
  connectedCallback(...args) {
    super.connectedCallback(...args);
    this.setSourceBound = this.setSource.bind(this);
    this.aoflSrc = this.aoflSrc || '';
    window.addEventListener('scroll', this.setSourceBound);
    window.addEventListener('resize', this.setSourceBound);

    window.requestAnimationFrame(() => {
      let compatibleParent = this.getCompatibleParent();
      if (compatibleParent) {
        compatibleParent.setImg(this);
      } else {
        this.setSource();
      }
    });
  }

  /**
   *
   *
   * @return {Object}
   * @memberof AoflDrawer
   */
  _render() {
    return html`${template(this)}`;
  }

  /**
   *
   *
   * @param {String} name
   * @param {Boolean} oldVal
   * @param {Boolean} newVal
   * @memberof AoflImg
   */
  attributeChangedCallback(name, oldVal, newVal) {
    super.attributeChangedCallback(name, oldVal, newVal);

    if (name === 'src' || name === 'aoflSrc') {
      this.sourceChange(newVal, oldVal);
    }
  }

  /**
   *
   *
   * @return {HTMLElement}
   * @memberof AoflImg
   * @private
   */
  getCompatibleParent() {
    let elem = this;
    while (elem && typeof elem.setImg !== 'function') {
      elem = elem.parentNode;
    }
    return elem;
  }

  /**
   * @return {Promise}
   */
  waitForImg() {
    let _this = this;
    return new Promise((resolve, reject) => {
      (function getImgElement() {
        let imgElement = _this.shadowRoot.querySelector('#img');
        if (imgElement) return resolve();
        setTimeout(getImgElement, 30);
      })();
    });
  }

  /**
   *
   * @param {String} newVal
   * @param {String} oldVal
   */
  _sourceChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      let imgElement = this.shadowRoot.querySelector('#img');
      if (this.elementInViewport()) {
        if (imgElement) {
          this.setSource();
        } else {
          this.waitForImg().then(this.setSource);
        }
      }
    }
  }

  /**
   *
   *
   * @memberof AoflImg
   */
  setSource() {
    let imgElement = this.shadowRoot.querySelector('#img');
    if (!this.imgLoaded) {
      imgElement.style.opacity = '0';
      this.imgLoaded = true;
    }
    if (imgElement && this.elementInViewport()) {
      let src = this.src || this.aoflSrc;
      if (this.img === null || src !== this.img.src) {
        this.img = new Image();
        let imageLoadedHandler = (e) => {
          this.width = e.target.width;
          this.height = e.target.height;
          imgElement.style.background = 'rgba(0,0,0,0)';
          imgElement.style.opacity = '1';
          this.img.removeEventListener('load', imageLoadedHandler);
          imgElement.setAttribute('src', this.img.src);
        };
        this.img.addEventListener('load', imageLoadedHandler);
        this.img.setAttribute('src', src);
      }
    }
  }

  /**
   *
   *
   * @return {Boolean}
   * @memberof AoflImg
   */
  elementInViewport() {
    let {top, right, bottom, left} = this.getBoundingClientRect();
    let vWidth = window.innerWidth || document.documentElement.clientWidth;
    let vHeight = window.innerHeight || document.documentElement.clientHeight;
    let wThreshold = vWidth * 0.25;
    let hThreshold = vHeight * 0.25;

    return bottom > -hThreshold && right > -vWidth && left < (vWidth + wThreshold) && top < (vHeight + hThreshold);
  }


  /**
   *
   *
   * @memberof AoflImg
   */
  disconnectedCallback(...args) {
    super.disconnectedCallback(...args);
    window.removeEventListener('scroll', this.setSourceBound);
    window.removeEventListener('resize', this.setSourceBound);
  }
}

window.customElements.define(AoflImg.is, AoflImg);
