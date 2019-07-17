const parse5 = require('parse5');
const {getStyleNodes, purifyStyles, getStyleFreeHtml, getScriptNodes} = require('../purify-internal-style');
const defaultsDeep = require('lodash.defaultsdeep');

/**
 *
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 */
class PurifycssPlugin {
  /**
   * Creates an instance of PurifycssPlugin.
   *
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.setOptions(options);
  }

  /**
   *
   *
   * @readonly
   */
  static get name() {
    return 'HtmlWebpackPurifyInternalCssPlugin';
  }


  /**
   *
   * @param {Object} options
   */
  setOptions(options) {
    this.options = defaultsDeep({}, options, {
      level: 'auto' || 'whitelist' || 'all' || 'none',
      purifyCSS: {
        minify: true,
        rejected: false,
        info: false,
        whitelist: []
      }
    });

    this.options.purifyCSS.output = false; // force

    if (this.options.level === 'all') {
      this.options.purifyCSS.whitelist = [];
    }
  }
  /**
   *
   *
   * @param {Object} compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap(PurifycssPlugin.name,
      (compilation) => {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing
          .tapAsync(PurifycssPlugin.name + '#befeHtmlGeneration', async (data, cb) => {
            try {
              if (this.options.level !== 'none') {
                const document = parse5.parse(data.html);
                const styles = await getStyleNodes(document);
                const scripts = await getScriptNodes(document);
                let html = '';
                if (this.options.level === 'auto') {
                  html = getStyleFreeHtml(document, styles, scripts);
                }

                await purifyStyles(html, styles, this.options.purgeCss);
                data.html = parse5.serialize(document);
              }

              cb(null, data);
            } catch (e) {
              cb(e);
            }
          });
      });
  }
}

module.exports = PurifycssPlugin;
