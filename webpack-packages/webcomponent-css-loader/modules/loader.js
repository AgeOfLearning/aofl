const fs = require('fs');
const path = require('path');
const {getOptions} = require('loader-utils');
const validationOptions = require('schema-utils');
const Purgecss = require('purgecss');
const purgeJs = require('purgecss-from-js');
const Stylis = require('stylis');
const importPlugin = require('./replace-url-plugin');
const schema = require('./__config/schema.json');

/**
 *
 * @param {*} source
 * @param {*} map
 * @param {*} meta
 */
module.exports = function(source) {
  const callback = this.async();
  const options = Object.assign({
    cache: true,
    path: '',
    force: false,
    whitelist: []
  }, getOptions(this)); // eslint-disable-line

  validationOptions(schema, options, '@aofl/webcomponent-css-loader');
  if (options.cache === false) {
    this.cacheable(false);
  }

  this.cacheable(true);

  const cssFileName = this.resourcePath.substr(this.resourcePath.lastIndexOf(path.sep) + 1);
  const templateName = cssFileName.replace('css', 'js');
  const templatePath = this.resourcePath.replace(cssFileName, templateName);
  const indexPath = this.resourcePath.replace(cssFileName, 'index.js');

  const globalStylesExists = fs.existsSync(options.path);
  const templateFileExists = fs.existsSync(templatePath);
  const indexFileExists = fs.existsSync(indexPath);
  let content = '';

  if (!templateFileExists && !indexFileExists && !options.force) {
    return callback(null, source);
  }

  try {
    if (templateFileExists) {
      content += fs.readFileSync(templatePath, {encoding: 'utf-8'});
      this.addDependency(templatePath);
    }

    if (indexFileExists) {
      content += fs.readFileSync(indexPath, {encoding: 'utf-8'});
      this.addDependency(indexPath);
    }

    if (globalStylesExists) {
      this.addDependency(options.path);
    }

    let combinedCss = '';
    if (globalStylesExists) {
      const globalStyles = fs.readFileSync(options.path, {encoding: 'utf-8'});
      const plugin = importPlugin.plugin(this.resourcePath, options.path, this.addDependency);
      const stylisGlobal = new Stylis();
      stylisGlobal.set({prefix: true, preserve: false, compress: true});
      stylisGlobal.use(plugin);

      const globalCss = stylisGlobal('', globalStyles.toString());
      combinedCss += globalCss;
    }

    const plugin = importPlugin.plugin(this.resourcePath, this.resourcePath, this.addDependency);
    const stylisLocal = new Stylis();
    stylisLocal.set({prefix: true, preserve: false, compress: true});
    stylisLocal.use(plugin);
    const localCss = stylisLocal('', source.toString());
    combinedCss += localCss;

    if (typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'development') {
      callback(null, combinedCss);
    } else {
      const purgeCss = new Purgecss({
        content: [
          {
            raw: content.toString(),
            extension: 'html'
          }
        ],
        css: [
          {
            raw: combinedCss
          }
        ],
        rejected: false,
        whitelist: options.whitelist,
        extractors: [
          {
            extractor: purgeJs,
            extensions: ['js']
          }
        ]
      });

      const purified = purgeCss.purge();
      callback(null, purified[0].css);
    }
  } catch (e) {
    callback(e);
  }
};
