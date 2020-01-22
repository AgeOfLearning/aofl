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
  constructor(selector) {
    this.selector = selector;
  }
  /**
   *
   * @return {Object}
   */
  waitUntilRender() {
    browser.waitUntil(() => {
      const el = browser.execute(`try {return ${this.selector};}catch(e) {return null;}`);
      return el !== null;
    }, browser.config.waitforTimeout, 'expected element to render after 5s', browser.config.waitforInterval);
    return this;
  }
  /**
   *
   * @return {Object}
   */
  query() {
    browser.execute(`return ${this.selector};`);
    return this;
  }
  /**
   *
   * @return {Object}
   */
  click() {
    browser.execute(`return ${this.selector}.click();`);
    return this;
  }
  /**
   *
   * @return {Object}
   */
  focus() {
    browser.execute(`return ${this.selector}.focus();`);
    return this;
  }
  /**
   *
   * @param {String} val
   * @return {Object}
   */
  setValue(val) {
    browser.execute(`const el = ${this.selector}; el.value = "${val}"; el.dispatchEvent(new CustomEvent('input', {composed: true, bubbles: true}));`);
    return this;
  }
  /**
   *
   * @return {String}
   */
  getValue() {
    return browser.execute(`return ${this.selector}.value;`);
  }
  /**
   *
   * @param {String} val
   * @return {Object}
   */
  addValue(val) {
    const value = this.getValue();
    this.setValue(`${value}${val}`);
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
    this.click();
    setTimeout(() => this.click());
    return this;
  }
  /**
   *
   * @param {String} attr
   * @return {String}
   */
  getAttribute(attr) {
    return browser.execute(`return ${this.selector}.getAttribute('${attr}');`);
  }
  /**
   *
   * @param {String} prop
   * @return {String}
   */
  getCSSProperty(prop) {
    return browser.execute(`return window.getComputedStyle(${this.selector}).getPropertyValue('${prop}');`);
  }
  /**
   *
   * @return {String}
   */
  getHTML() {
    return browser.execute(`return ${this.selector}.innerHTML;`);
  }
  /**
   *
   * @param {String} prop
   * @return {String}
   */
  getLocation(prop) {
    return browser.execute(`return ${this.selector}.getBoundingClientRect()['${prop}'];`);
  }
  /**
   *
   * @param {String} prop
   * @return {Object}
   */
  getProperty(prop) {
    return browser.execute(`return ${this.selector}['${prop}'];`);
  }
  /**
   *
   * @param {String} prop
   * @return {Mixed}
   */
  getSize(prop) {
    if (typeof prop !== 'undefined') {
      return browser.execute(`return ${this.selector}.getBoundingClientRect()['${prop}'];`);
    }

    return browser.execute(`const rect = ${this.selector}.getBoundingClientRect(); return {width: rect.width, height: rect.height};`);
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
    return browser.execute(`return ${this.selector}.innerText;`);
  }
  /**
   *
   * @return {Boolean}
   */
  isExisting() {
    return Boolean(this.query());
  }
}

module.exports.Element = Element;
