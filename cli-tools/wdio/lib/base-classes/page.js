/* eslint-disable */
const {Element} = require('./element');
/**
 *
 * @class Page
 */
class Page {
  /**
   *
   * Creates an instance of Page.
  */
  constructor(url, root = 'document', title = 'Test Page') {
    this.url = url;
    this.root = new Element(root);
    this.title = 'My Page';
    this.cache = {};
  }

  static maximize() {
    if (driver.isMobile === false) {
      try {
        browser.maximizeWindow();
      } catch (e) {}
    }
  }
  /**
   *
   * @return {Object}
   */
  waitForNavigation() {
    browser.waitUntil(() => {
      return browser.getUrl() !== browser.config.baseUrl + this.url;
    }, browser.config.waitforTimeout, 'Page didn\'t navigate in time', browser.config.waitforInterval);
    return this;
  }
  /**
   *
   * @param {String} selector
   */
  query(selector) {
    if (typeof this.cache[selector] === 'undefined') {
      this.cache[selector] = new Element(selector);
    }
    return this.cache[selector];
  }
  /**
   *
   * @param {String} path
   * @return {String}
   */
  open() {
    return browser.url(this.url);
  }
}

module.exports.Page = Page;
