/* eslint-disable */
class Element {
  constructor(selector) {
    this.selector = selector;
  }

  waitUntilRender() {
    browser.waitUntil(() => {
      const el = browser.execute(`try {return ${this.selector};}catch(e) {return null;}`);
      return el !== null;
    }, browser.config.waitforTimeout, 'expected element to render after 5s', browser.config.waitforInterval);
    return this;
  }

  query() {
    browser.execute(`return ${this.selector};`);
    return this;
  }

  click() {
    browser.execute(`return ${this.selector}.click();`);
    return this;
  }

  focus() {
    browser.execute(`return ${this.selector}.focus();`);
    return this;
  }

  value(val) {
    browser.execute(`const el = ${this.selector}; el.value = "${val}"; el.dispatchEvent(new CustomEvent('input', {composed: true, bubbles: true}));`);
    return this;
  }

  getValue() {
    return browser.execute(`return ${this.selector}.value;`);
  }
}

module.exports.Element = Element;
