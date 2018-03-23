/**
 * @summary AoflImg
 * @class AoflImg
 * @extends {Polymer.Element}
 */
class AoflImg extends Polymer.Element {
  /**
   *
   */
  static get is() {
    return 'aofl-img';
  }

  /**
   *
   */
  static get properties() {
    return {
      viewBox: {
        type: String,
        value: '',
        observer: '_viewboxChange'
      },
      aoflSrc: {
        type: String,
        value: '',
        observer: '_sourceChange'
      },
      src: {
        type: String,
        observer: '_sourceChange'
      },
      width: String,
      height: String,
      alt: String
    };
  }

  /**
   *
   */
  constructor() {
    super();
    if (typeof this.parentNode.setImg === 'function') {
      this.parentNode.setImg(this);
    }
  }

  /**
   *
   */
  connectedCallback() {
    super.connectedCallback();
    this._setSourceBound = this._setSource.bind(this);
    window.addEventListener('scroll', this._setSourceBound);
    window.addEventListener('resize', this._setSourceBound);

    Polymer.Async.animationFrame.run(() => {
      this._setSource();
    });
  }

  /**
   *
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._setSourceBound);
    window.removeEventListener('resize', this._setSourceBound);
  }

  /**
   *
   * @param {*} newVal
   * @param {*} oldVal
   */
  _viewboxChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      let svgElement = this.shadowRoot.querySelector('#svg');
      if (svgElement) {
        this._renderSvgElement(svgElement);
      }
    }
  }

  /**
   *
   * @param {*} newVal
   * @param {*} oldVal
   */
  _sourceChange(newVal, oldVal) {
    if (newVal !== oldVal) {
      let imgElement = this.shadowRoot.querySelector('#img');
      if (imgElement && this.elementInViewport()) {
        this._setSource();
      }
    }
  }
  /**
   *
  */
  _setSource() {
    let svgElement = this.shadowRoot.querySelector('#svg');
    let imgElement = this.shadowRoot.querySelector('#img');
    if (this.viewBox && svgElement) {
      this._renderSvgElement(svgElement);
    } else if (imgElement && this.elementInViewport()) {
      let src = this.src || this.aoflSrc;
      if (src !== imgElement.getAttribute('src')) {
        let imageLoadedHandler = () => {
          imgElement.style.background = 'rgba(0,0,0,0)';
          imgElement.style.width = '100%';
          imgElement.style.height = 'auto';
          imgElement.removeEventListener('load', imageLoadedHandler);
        };
        imgElement.addEventListener('load', imageLoadedHandler);
        imgElement.setAttribute('src', src);
      }
    }
  }
  /**
   *
   * @param {*} svgElement
   */
  _renderSvgElement(svgElement) {
    let src = this.src || this.aoflSrc;
    let imageElement = svgElement.querySelector('#svg-img');
    svgElement.setAttribute('viewBox', this.viewBox);

    imageElement.setAttribute('width', this.width);
    imageElement.setAttribute('height', this.height);
    if (this.elementInViewport() && imageElement.getAttribute('xlink:href') !== src) {
      imageElement.setAttribute('xlink:href', src);
      imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src);
    }

    this._setViewBoxDimension(this.viewBox);
    this.async(() => {
      svgElement.innerHTML = svgElement.innerHTML;
    }, this);
  }
  /**
   *
   * @param {*} viewBoxValue
   */
  _setViewBoxDimension(viewBoxValue) {
    let dims = viewBoxValue.split(' ');
    if (dims.length === 4) {
      this.viewBoxWidth = dims[2];
      this.viewBoxHeight = dims[3];
    }
  }
  /**
   *
   * @return {Boolean}
   */
  elementInViewport() {
    let {top, right, bottom, left} = this.getBoundingClientRect();
    let vWidth = window.innerWidth || document.documentElement.clientWidth;
    let vHeight = window.innerHeight || document.documentElement.clientHeight;

    return bottom > 0 && right > 0 && left < vWidth && top < vHeight;
  }
}

window.customElements.define(AoflImg.is, AoflImg);
