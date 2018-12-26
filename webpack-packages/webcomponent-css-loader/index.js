const fs = require('fs');
const path = require('path');
const purify = require('purify-css');
const {getOptions} = require('loader-utils');
const validationOptions = require('schema-utils');
const postcss = require('postcss');
const atImport = require('postcss-import');
const url = require('postcss-url');

const schema = {
  type: 'object',
  properties: {
    path: {
      type: 'string'
    },
    force: {
      type: 'boolean'
    }
  }
};

/**
 *
 * @param {*} source
 * @param {*} map
 * @param {*} meta
 */
module.exports = async function(source) {
  const callback = this.async();
  const options = Object.assign({
    force: false,
    path: ''
  }, getOptions(this)); // eslint-disable-line

  validationOptions(schema, options, 'Web components css loader');

  const resourcePath = this.resourcePath;
  const cssFileName = resourcePath.substr(resourcePath.lastIndexOf(path.sep) + 1);
  const templateName = cssFileName.replace('css', 'js');
  const templatePath = resourcePath.replace(cssFileName, templateName);
  const indexPath = resourcePath.replace(cssFileName, 'index.js');

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

    const addDependencies = (messages) => {
      if (Array.isArray(messages)) {
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          if (typeof message.type === 'string' && message.type === 'dependency') {
            this.addDependency(message.file);
          };
        }
      }
    };

    let combinedCss = '';
    if (globalStylesExists) {
      const globalStyles = fs.readFileSync(options.path, {encoding: 'utf-8'});
      const globalCss = await postcss()
      .use(atImport({
        root: path.dirname(options.path)
      }))
      .use(url({
        url: 'rebase'
      }))
      .process(globalStyles.toString(), {
        from: options.path,
        to: resourcePath,
        map: false
      });

      addDependencies(globalCss.messages);
      combinedCss += globalCss.css;
    }

    const localCss = await postcss()
    .use(atImport({
      root: path.dirname(resourcePath)
    }))
    .use(url({
      url: 'rebase'
    }))
    .process(source.toString(), {
      from: resourcePath,
      map: false
    });

    addDependencies(localCss.messages);
    combinedCss += localCss.css;

    if (typeof process.env.NODE_ENV !== 'undefined' && process.env.NODE_ENV === 'development') {
      callback(null, combinedCss);
    } else {
      const purified = purify(content.toString(), combinedCss, {
        info: false,
        rejected: false,
        whitelist: []
      });

      callback(null, purified);
    }
  } catch (e) {
    callback(e);
  }
};
