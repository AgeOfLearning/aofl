const {CSS_SELECTOR, JS_PATH} = require('./selector-types');
/**
 *
 * @class Element
 */
class Element {
  /**
   *
   * Creates an instance of Element.
   * @param {*} selector
   */
  constructor(selector, type = JS_PATH) {
    this.selector = selector;
    this.selectorType = type;
  }
  /**
   *
   */
  get queryCmd() {
    if (this.selectorType === CSS_SELECTOR) {
      return `document.querySelector('${this.selector}')`;
    }

    return `${this.selector}`;
  }
  /**
   *
   */
  query() {
    browser.execute(`return ${this.queryCmd};`);
  }
  /**
   *
   * @return {Object}
   */
  click() {
    browser.execute(`${this.queryCmd}.click();`);
    return this;
  }
  /**
   *
   * @return {Boolean}
   */
  isDisplayed() {
    return browser.execute(`return !(window.getComputedStyle(${this.queryCmd}).getPropertyValue('display') === 'none' && window.getComputedStyle(${this.queryCmd}).getPropertyValue('visibility') === 'hidden' && window.getComputedStyle(${this.queryCmd}).getPropertyValue('opacity') === 0)`);
  }
  /**
   *
   * @return {Boolean}
   */
  isDisplayedInViewport() {
    const inViewport = browser.execute(`var bd = ${this.queryCmd}.getBoundingClientRect(); console.log(bd); return (bd.top >= 0 && bd.left >= 0 && bd.bottom <= (window.innerHeight || document.documentElement.clientHeight) && bd.right <= (window.innerWidth || document.documentElement.clientWidth));`);
    return (inViewport && this.isDisplayed());
  }
  /**
   *
   * @return {Boolean}
   */
  isEnabled() {
    return browser.execute(`return ${this.queryCmd}.disabled`);
  }
  /**
   *
   * @param {Element} elem
   * @return {Boolean}
   */
  isEqual(elem) {
    return browser.execute(`return ${this.queryCmd} === ${elem.selector};`);
  }
  /**
   *
   * @return {Boolean}
   */
  isSelected() {
    return browser.execute(`return (${this.queryCmd}['selected'] || ${this.queryCmd}['checked'])`);
  }
  /**
   * @param {String} attribute
   * @param {String} value
   * @return {Object}
   */
  selectByAttribute(attribute, value) {
    browser.execute(`var elem = null; for (var i = 0; i < ${this.queryCmd}.options.length; i++) {var opt = ${this.queryCmd}.options[i]; try {if (opt.getAttribute('${attribute}') === '${value}') {elem = opt; opt.selected = true; break;}} catch (e) {} };if (!elem) {throw new Error('Option with attribute ${attribute}=${value} not found')};`);
    return this;
  }
  /**
   * @param {String} index
   * @return {Object}
   */
  selectByIndex(index) {
    browser.execute(`if(${index} < 0) {throw new Error('Index needs to be 0 or any other positive number')}; if(${this.queryCmd}.options.length === 0) {throw new Error('Select element does not contain any option element')}; if(${this.queryCmd}.options.length -1 < ${index}) {throw new Error('Option with index ${index} not found.')}; ${this.queryCmd}.options[${index}].selected = true;`);
    return this;
  }
  /**
   * @param {String} text
   * @return {Object}
   */
  selectByVisible(text) {
    browser.execute(`var elem = null; var str = '${text}'; var normalized = str.trim().replace(/\\s+/, ' '); for (var i = 0; i < ${this.queryCmd}.options.length; i++) {var opt = ${this.queryCmd}.options[i]; if(opt.innerText === normalized) {opt.selected = true; elem = opt; break;}}; if (!elem) {throw new Error('Option with text ${text} not found.')};`);
    return this;
  }
  /**
   * @param {Object} options
   * @return {Object}
   */
  scrollIntoView(options = {}) {
    options = typeof options === 'object' ? JSON.stringify(options) : options;
    browser.execute(`${this.queryCmd}.scrollIntoView(${options})`);
    return this;
  }
  /**
   *
   * @return {Object}
   */
  focus() {
    browser.execute(`${this.queryCmd}.focus();`);
    return this;
  }
  /**
   *
   * @param {String} val
   * @return {Object}
   */
  setValue(val) {
    browser.execute(`var el = ${this.queryCmd}; el.value = '${val}'; el.dispatchEvent(new CustomEvent('input', {composed: true, cancelable: true, bubbles: true}));`);
    return this;
  }
  /**
   *
   * @return {String}
   */
  getValue() {
    return browser.execute(`return ${this.queryCmd}.value;`);
  }
  /**
   *
   * @param {String} val
   * @return {Object}
   */
  addValue(val) {
    this.setValue(`var value = ${this.queryCmd}.value; ${this.queryCmd}.value = String(value) + '${val}'; el.dispatchEvent(new CustomEvent('input', {composed: true, cancelable: true, bubbles: true}));`);
    return this;
  }
  /**
   *
   * @return {Object}
   */
  clearValue() {
    this.setValue('');
    return this;
  }
  /**
   *
   * @return {Object}
   */
  doubleClick() {
    browser.execute(`${this.queryCmd}.dispatchEvent(new CustomEvent('dblclick', {
      bubbles: true,
      cancelable: true,
      composed: true
    }))`);
    return this;
  }
  /**
   *
   * @param {String} attr
   * @return {String}
   */
  getAttribute(attr) {
    return browser.execute(`return ${this.queryCmd}.getAttribute('${attr}');`);
  }
  /**
   *
   * @param {String} prop
   * @return {String}
   */
  getCSSProperty(prop) {
    return browser.execute(`return window.getComputedStyle(${this.queryCmd}).getPropertyValue('${prop}');`);
  }
  /**
   *
   * @return {String}
   */
  getHTML() {
    return browser.execute(`return ${this.queryCmd}.innerHTML;`);
  }
  /**
   *
   * @param {String} prop
   * @return {String}
   */
  getLocation(prop) {
    return browser.execute(`return ${this.query()}.getBoundingClientRect()['${prop}'];`);
  }
  /**
   *
   * @param {String} prop
   * @return {Object}
   */
  getProperty(prop) {
    return browser.execute(`return ${this.queryCmd}['${prop}'];`);
  }
  /**
   *
   * @param {String} prop
   * @return {Mixed}
   */
  getSize(prop) {
    if (typeof prop !== 'undefined') {
      return browser.execute(`return ${this.queryCmd}.getBoundingClientRect()['${prop}'];`);
    }

    return browser.execute(`const rect = ${this.queryCmd}.getBoundingClientRect(); return {width: rect.width, height: rect.height};`);
  }
  /**
   *
   * @return {String}
   */
  getTagName() {
    return this.getProperty('tagName').toLowerCase();
  }
  /**
   *
   * @return {String}
   */
  getText() {
    return browser.execute(`return ${this.queryCmd}.innerText;`);
  }
  /**
   *
   * @return {Boolean}
   */
  isExisting() {
    return browser.execute(`try { return Boolean(${this.queryCmd}); } catch(e) { return false; }`);
  }
  /**
   *
   * @return {Boolean}
   */
  isClickable() {
    return browser.execute(`function isElementClickable (elem) {if (!elem.getBoundingClientRect || !elem.scrollIntoView || !elem.contains || !elem.getClientRects || !document.elementFromPoint) {return false} const isOldEdge = !!window.StyleMedia; const scrollIntoViewFullSupport = !(window.safari || isOldEdge); function getOverlappingElement (elem, context) { context = context || document;const elemDimension = elem.getBoundingClientRect();const x = elemDimension.left + (elem.clientWidth / 2);const y = elemDimension.top + (elem.clientHeight / 2);return context.elementFromPoint(x, y);} function getOverlappingRects (elem, context) {context = context || document;const elems = [];const rects = elem.getClientRects();const rect = rects[0];const x = rect.left + (rect.width / 2);const y = rect.top + (rect.height / 2);elems.push(context.elementFromPoint(x, y));return elems;}function getOverlappingElements (elem, context) {return [getOverlappingElement(elem, context)].concat(getOverlappingRects(elem, context))} function nodeContains (elem, otherNode) {if (isOldEdge) {let tmpElement = otherNode;while (tmpElement) {if (tmpElement === elem) {return true;}tmpElement = tmpElement.parentNode;if (tmpElement && tmpElement.nodeType === 11 && tmpElement.host) {tmpElement = tmpElement.host;}}return false;}return elem.contains(otherNode);}function isOverlappingElementMatch (elementsFromPoint, elem) {if (elementsFromPoint.some(function (elementFromPoint) {return elementFromPoint === elem || nodeContains(elem, elementFromPoint);})) {return true;}let elemsWithShadowRoot = [].concat(elementsFromPoint);elemsWithShadowRoot = elemsWithShadowRoot.filter(function (x) {return x && x.shadowRoot && x.shadowRoot.elementFromPoint}); let shadowElementsFromPoint = [];for (let i = 0; i < elemsWithShadowRoot.length; ++i) {let shadowElement = elemsWithShadowRoot[i];shadowElementsFromPoint = shadowElementsFromPoint.concat(getOverlappingElements(elem, shadowElement.shadowRoot));}shadowElementsFromPoint = [].concat(shadowElementsFromPoint);shadowElementsFromPoint = shadowElementsFromPoint.filter(function (x) {return !elementsFromPoint.includes(x)});if (shadowElementsFromPoint.length === 0) {return false} return isOverlappingElementMatch(shadowElementsFromPoint, elem);}function isElementInViewport (elem) {if (!elem.getBoundingClientRect) {return false} const rect = elem.getBoundingClientRect();const windowHeight = (window.innerHeight || document.documentElement.clientHeight);const windowWidth = (window.innerWidth || document.documentElement.clientWidth);const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) > 0);const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) > 0);return (vertInView && horInView);}function isClickable (elem) {return (isElementInViewport(elem) && elem.disabled !== true &&isOverlappingElementMatch(getOverlappingElements(elem), elem))} if (!isClickable(elem)) {elem.scrollIntoView(scrollIntoViewFullSupport ? { block: 'nearest', inline: 'nearest' } : false); if (!isClickable(elem)) {elem.scrollIntoView(scrollIntoViewFullSupport ? { block: 'center', inline: 'center' } : true); return isClickable(elem);}}return true;}; return isElementClickable(${this.queryCmd})`);
  }
  /**
   *
   * @return {Object}
   */
  waitForExist(ms, error) {
    ms = ms || browser.config.waitforTimeout;
    error = error || `Expected element to render after ${ms}ms.\nElement: ${this.queryCmd}\nPage: ${browser.getUrl()}`;

    browser.waitUntil(() => {
      const el = browser.execute(`try { return ${this.queryCmd}; } catch(e) { return null; }`);
      return el !== null;
    }, {timeout: ms, timeoutMsg: error, interval: browser.config.waitforInterval});
    return this;
  }
  /**
   *
   * @return {Object}
   */
  waitForNotExist(ms, error) {
    ms = ms || browser.config.waitforTimeout;
    error = error || `Expected element to not exist after ${ms}ms.\nElement: ${this.queryCmd}\nPage: ${browser.getUrl()}`;

    browser.waitUntil(() => {
      const el = browser.execute(`try { return ${this.queryCmd}; } catch(e) { return null; }`);
      return el === null;
    }, {timeout: ms, timeoutMsg: error, interval: browser.config.waitforInterval});
    return this;
  }
  /**
   *
   * @return {Object}
   */
  waitForClickable(timeout, interval, reverse, timeoutMsg) {
    timeout = timeout || browser.config.waitforTimeout;
    interval = interval || browser.config.waitforInterval;
    reverse = reverse || false;
    timeoutMsg = timeoutMsg || `element ("${this.queryCmd}") still ${reverse ? '' : 'not '}clickable after ${timeout}ms`;

    browser.waitUntil(() => {
      return reverse !== this.isClickable();
    }, {timeout, timeoutMsg, interval});
    return this;
  }
  /**
   *
   * @return {Object}
   */
  waitForEnabled(timeout, interval, reverse, timeoutMsg) {
    timeout = timeout || browser.config.waitforTimeout;
    interval = interval || browser.config.waitforInterval;
    reverse = reverse || false;
    timeoutMsg = timeoutMsg || `element ("${this.queryCmd}") still ${reverse ? '' : 'not '}enabled after ${timeout}ms`;

    browser.waitUntil(() => {
      return reverse !== this.isEnabled();
    }, {timeout, timeoutMsg, interval});
    return this;
  }
  /**
   *
   * @return {Object}
   */
  waitForDisplayed(timeout, interval, reverse, timeoutMsg) {
    timeout = timeout || browser.config.waitforTimeout;
    interval = interval || browser.config.waitforInterval;
    reverse = reverse || false;
    timeoutMsg = timeoutMsg || `element ("${this.queryCmd}") still ${reverse ? '' : 'not '}displayed after ${timeout}ms`;

    browser.waitUntil(() => {
      return reverse !== this.isDisplayed();
    }, {timeout, timeoutMsg, interval});
    return this;
  }
}

module.exports.Element = Element;
