const parse5 = require('parse5');
const {getStyleNodes, purifyStyles, getStyleFreeHtml, getScriptNodes} = require('../purify-internal-style');
const {defaultsDeep} = require('@aofl/cli-lib');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      level: 'auto' || 'safelist' || 'all' || 'none',
      purgeCss: {
        rejected: false,
        output: false,
        safelist: []
      }
    });

    this.options.purgeCss.output = false; // force

    if (this.options.level === 'all') {
      this.options.purgeCss.safelist = [];
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
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit
          .tapAsync(PurifycssPlugin.name + '#beforeEmit', async (data, cb) => {
            try {
              if (this.options.level !== 'none') {
                const document = parse5.parse(data.html);
                const styles = await getStyleNodes(document);
                const scripts = await getScriptNodes(document);
                let html = '';
                if (this.options.level === 'auto') {
                  html = getStyleFreeHtml(document, styles, scripts);
                }
                try {
                  await purifyStyles(html, styles, this.options.purgeCss);
                  data.html = parse5.serialize(document);
                } catch (e) {
                  cb(e, null);
                }
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
