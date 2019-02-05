const parse5 = require('parse5');
const purify = require('purify-css');

/**
 *
 * @static
 * @param {Object} docFrag
 * @param {Function} op
 */
const traverseChildNodes = async (docFrag, op) => {
  await op(docFrag);
  if (Array.isArray(docFrag.childNodes)) {
    for (let i = 0; i < docFrag.childNodes.length; i++) {
      await traverseChildNodes(docFrag.childNodes[i], op);
    }
  }
};


/**
 *
 * @param {Object} docFrag
 * @return {Array}
 */
const getStyleNodes = async (docFrag) => {
  const styles = [];

  await traverseChildNodes(docFrag, (docFrag) => {
    if (docFrag.tagName === 'style' && Array.isArray(docFrag.childNodes)) {
      for (let i = 0; i < docFrag.childNodes.length; i++) {
        styles.push(docFrag.childNodes[i]);
      }
    }
  });

  return styles;
};


/**
 *
 * @param {Object} document
 * @param {Array} styles
 * @return {String}
 */
const getStlyeFreeHtml = (document, styles) => {
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    style.cachedValue = style.value;
    style.value = '';
  }

  const stlyeFreeHtml = parse5.serialize(document);

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    style.value = style.cachedValue;
    delete style.cachedValue;
  }

  return stlyeFreeHtml;
};

/**
 *
 * @param {String} html
 * @param {Array} styles
 * @param {Object} options
 */
const purifyStyles = async (html, styles, options) => {
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    await new Promise((resolve) => {
      purify(html, style.value, options, (purified) => {
        style.value = purified;
        resolve();
      });
    });
  }
};

module.exports = {
  traverseChildNodes,
  getStyleNodes,
  getStlyeFreeHtml,
  purifyStyles
};
