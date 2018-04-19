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
   * Creates an instance of AoflImg.
   * @memberof AoflImg
   */
  constructor() {
    super();
    this.img = null;
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
      let compatibleParent = this._getCompatibleParent();
      if (compatibleParent) {
        compatibleParent.setImg(this);
      } else {
        this._setSource();
      }
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
   * @return {HTMLElement}
   */
  _getCompatibleParent() {
    let elem = this;
    while (elem && typeof elem.setImg !== 'function') {
      elem = elem.parentNode;
    }
    return elem;
  }

  /**
   * @return {Object}
   */
  _getAbsoluteParent() {
    let elems = null;
    let elem = this.parentNode;
    while (elem && elem.parentNode) {
      if (elems !== null && elems.absolute !== null && ['relative', 'absolute', 'fixed'].indexOf(window.getComputedStyle(elem, null).getPropertyValue('position')) > -1) {
        elems.relative = elem;
        break;
      }
      if (elems === null && window.getComputedStyle(elem, null).getPropertyValue('position') === 'absolute') {
        elems = {
          absolute: elem,
          relative: null
        };
      }
      elem = elem.parentNode;
    }
    return elems;
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
      if (this.img === null || src !== this.img.src) {
        this.img = new Image();
        let imageLoadedHandler = (e) => {
          this.width = e.target.width;
          this.height = e.target.height;
          imgElement.style.background = 'rgba(0,0,0,0)';
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
    let wThreshold = vWidth * 0.25;
    let hThreshold = vHeight * 0.25;

    return bottom > -hThreshold && right > -vWidth && left < (vWidth + wThreshold) && top < (vHeight + hThreshold);
  }
}

window.customElements.define(AoflImg.is, AoflImg);
