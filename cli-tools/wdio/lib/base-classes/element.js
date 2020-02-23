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

  get queryCmd() {
    if (this.selectorType === CSS_SELECTOR) {
      return `document.querySelector('${this.selector}')`;
    }

    return `${this.selector}`;
  }

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
    return Boolean(this.query());
  }
  /**
   *
   * @return {Object}
   */
  waitForExist(ms, reverse, error) {
    ms = ms || browser.config.waitforTimeout;
    reverse = reverse || false;
    error = error || `expected element to render after ${ms}ms.`;

    browser.waitUntil(() => {
      const el = browser.execute(`try { return ${this.queryCmd}; } catch(e) { return null; }`);
      if (reverse) {
        return el === null;
      }
      return el !== null;
    }, ms, error);
    return this;
  }
}

module.exports.Element = Element;
