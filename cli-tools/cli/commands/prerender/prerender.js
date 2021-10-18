const puppeteer = require('puppeteer-core');
const ChromeLauncher = require('chrome-launcher');

const installPaths = ChromeLauncher.Launcher.getInstallations();
if (installPaths.length === 0) {
  throw new Error('Chrome is not installed');
}
const chromePath = installPaths[0];

module.exports = async (url, config = {timeout: 0}) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: chromePath,
  });
  const page = await browser.newPage();

  page.evaluateOnNewDocument(`
    window.aofljsConfig = window.aofljsConfig || {};
    window.aofljsConfig.__prerender__ = true;
  `);

  await page.goto(url, {waitUntil: 'networkidle2'});
  const str = await page.evaluate((timeout) => {
    const selfClosingTags = [
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

    // const getDocType = () => {
    //   const node = document.doctype;
    //   return '<!DOCTYPE '
    //      + node.name
    //      + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
    //      + (!node.publicId && node.systemId ? ' SYSTEM' : '')
    //      + (node.systemId ? ' "' + node.systemId + '"' : '')
    //      + '>';
    // };

    const tagNameWithAttributes = (elem) => {
      if (elem instanceof Text || elem instanceof Comment) { return ''; }
      let str = '<' + elem.localName;
      const attrs = Array.from(elem.attributes);
      for (let i = 0; i < attrs.length; i++) {
        str += ' ' + attrs[i].nodeName + '="' + attrs[i].value + '"';
      }
      return str + '>';
    };

    const closingTag = (elem) => {
      if (elem instanceof Text || elem instanceof Comment || selfClosingTags.indexOf(elem.localName) > -1) { return ''; }
      return '</' + elem.localName + '>';
    };

    let skipStyle = false;

    const replaceChildren = (elem) => {
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
        const openTag = tagNameWithAttributes(children[i]);
        const closeTag = closingTag(children[i]);
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

    return new Promise((resolve) => {
      const getContent = () => {
        setTimeout(() => {
          return resolve((tagNameWithAttributes(document.body) + replaceChildren(document.body) +
          closingTag(document.body)));
        }, timeout);
      };

      return getContent();
    });
  }, config.timeout);
  await browser.close();
  return str;
};
