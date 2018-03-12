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
    window.requestAnimationFrame(this._setSourceBound);
    window.addEventListener('scroll', this._setSourceBound);
    window.addEventListener('resize', this._setSourceBound);
  }

  /**
   *
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.__setSource);
    window.removeEventListener('resize', this.__setSource);
  }

  /**
   *
   * @param {*} newVal
   * @param {*} oldVal
   */
  _viewboxChange(newVal, oldVal) {
    let svgElement = this.shadowRoot.querySelector('#svg');
    if (newVal && svgElement) {
      this._renderSvgElement(svgElement);
    }
  }

  /**
   *
   * @param {*} newVal
   * @param {*} oldVal
   */
  _sourceChange(newVal, oldVal) {
    let imgElement = this.shadowRoot.querySelector('#img');
    if (newVal && imgElement && this.elementInViewport()) {
      this._setSource();
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
      imgElement.setAttribute('src', this.src || this.aoflSrc);
      if (this.width && this.height) {
        imgElement.style.width = this.offsetWidth + 'px';
        imgElement.style.height = (this.offsetWidth * this.height / this.width) + 'px';
      }
      imgElement.addEventListener('load', () => {
        imgElement.style.width = '100%';
        imgElement.style.height = 'auto';
        imgElement.style.background = 'rgba(0,0,0,0)';
      });
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
    if (this.elementInViewport()) {
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
    let el = this;
    let top = el.offsetTop;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  }
}

window.customElements.define(AoflImg.is, AoflImg);
