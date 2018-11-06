const puppeteer = require('puppeteer');

module.exports = async (url, timeout = 0) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  page.evaluateOnNewDocument(`
    window.aofljsConfig = window.aofljsConfig || {};
    window.aofljsConfig.__prerender__ = true;
  `);

  await page.goto(url, {waitUntil: 'networkidle2'});
  let str = await page.evaluate(async (timeout) => {
    let selfClosingTags = [
      'area',
      'base',
      'br',
      'col',
      'command',
      'embed',
      'hr',
      'img',
      'input',
      'keygen',
      'link',
      'menuitem',
      'meta',
      'param',
      'source',
      'track',
      'wbr'
    ];

    const getDocType = () => {
      let node = document.doctype;
      return '<!DOCTYPE '
         + node.name
         + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
         + (!node.publicId && node.systemId ? ' SYSTEM' : '')
         + (node.systemId ? ' "' + node.systemId + '"' : '')
         + '>';
    };

    const tagNameWithAttributes = (elem) => {
      if (elem instanceof Text || elem instanceof Comment) return '';
      let str = '<' + elem.localName;
      let attrs = Array.from(elem.attributes);
      for (let i = 0; i < attrs.length; i++) {
        str += ' ' + attrs[i].nodeName + '="' + attrs[i].value + '"';
      }
      return str + '>';
    };

    const closingTag = (elem) => {
      if (elem instanceof Text || elem instanceof Comment || selfClosingTags.indexOf(elem.localName) > -1) return '';
      return '</' + elem.localName + '>';
    };

    let skipStyle = false;

    replaceChildren = (elem) => {
      let children = [];
      if (elem.tagName === 'BODY') {
        skipStyle = true;
      }
      if (elem.tagName === 'SLOT') {
        children = elem.assignedNodes() || [];
      } else {
      children = Array.from(elem.childNodes || []);
      }

      let str = '';
      for (let i = 0; i < children.length; i++) {
        if (skipStyle && children[i] instanceof HTMLStyleElement) {
          continue;
        }
        let openTag = tagNameWithAttributes(children[i]);
        let closeTag = closingTag(children[i]);
        if (customElements.get(children[i].localName)) {
          str += openTag + replaceChildren(children[i].shadowRoot) + closeTag;
        } else if (children[i].tagName === 'SLOT') {
          str += replaceChildren(children[i]);
        } else if (children[i] instanceof Text || children[i] instanceof Comment) {
          str += children[i].textContent;
        } else if (children[i].children.length > 0) {
          str += openTag + replaceChildren(children[i]) + closeTag;
        } else {
          str += openTag + children[i].innerText + closeTag;
        }
      }
      return str;
    };

    return await new Promise((resolve) => {
      let getContent = () => {
        setTimeout(() => {
          return resolve((tagNameWithAttributes(document.body) + replaceChildren(document.body) + closingTag(document.body)));
        }, timeout);
      };

      return getContent();
    });
  }, timeout);
  await browser.close();
  return str;
};
