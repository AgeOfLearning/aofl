const parse5 = require('parse5');
const Purgecss = require('purgecss');

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
 * @param {Object} docFrag
 * @return {Array}
 */
const getScriptNodes = async (docFrag) => {
  const scripts = [];

  await traverseChildNodes(docFrag, (docFrag) => {
    if (docFrag.tagName === 'script' && Array.isArray(docFrag.childNodes)) {
      for (let i = 0; i < docFrag.childNodes.length; i++) {
        scripts.push(docFrag.childNodes[i]);
      }
    }
  });

  return scripts;
};


/**
 *
 * @param {Object} document
 * @param {Array} styles
 * @return {String}
 */
const getStyleFreeHtml = (document, styles, scripts) => {
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    style.cachedValue = style.value;
    style.value = '';
  }

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    script.cachedValue = script.value;
    script.value = '';
  }

  const stlyeFreeHtml = parse5.serialize(document);

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    style.value = style.cachedValue;
    delete style.cachedValue;
  }

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    script.value = script.cachedValue;
    delete script.cachedValue;
  }
  return stlyeFreeHtml;
};

/**
 *
 * @param {String} html
 * @param {Array} styles
 * @param {Object} options
 */
const purifyStyles = (html, styles, options) => {
  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];

    const purgeCss = new Purgecss({
      content: [
        {
          raw: html,
          extension: 'html'
        }
      ],
      css: [
        {
          raw: style.value
        }
      ],
      rejected: false,
      ...options
    });

    const purged = purgeCss.purge();
    style.value = purged[0].css;
  }
};

module.exports = {
  traverseChildNodes,
  getStyleNodes,
  getStyleFreeHtml,
  purifyStyles,
  getScriptNodes
};
