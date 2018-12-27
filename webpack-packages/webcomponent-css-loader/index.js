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
    test: {
      type: 'string'
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
  /* eslint-disable */
  const callback = this.async();
  const options = getOptions(this);
  /* eslint-enable */
  validationOptions(schema, options, 'Web components css loader');
  const globalStyles = fs.readFileSync(options.path);
  const rPath = this.resourcePath;
  const cssFileName = rPath.substr(rPath.lastIndexOf(path.sep) + 1);
  const templateName = cssFileName.replace('css', 'js');
  const templatePath = rPath.replace(cssFileName, templateName);
  const indexPath = rPath.replace(cssFileName, 'index.js');
  if (fs.existsSync(templatePath)) {
    let content = fs.readFileSync(templatePath);
    const indexContent = fs.existsSync(indexPath).toString() ? fs.readFileSync(indexPath) : '';
    content = indexContent + content;
    this.addDependency(templatePath);

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

    try {
      const globalCss = await postcss()
      .use(atImport({
        root: path.dirname(options.path)
      }))
      .use(url({
        url: 'rebase'
      }))
      .process(globalStyles.toString(), {
        from: options.path,
        to: rPath,
        map: false
      });

      addDependencies(globalCss.messages);
      const localCss = await postcss()
      .use(atImport({
        root: path.dirname(rPath)
      }))
      .use(url({
        url: 'rebase'
      }))
      .process(source.toString(), {
        from: rPath,
        map: false
      });

      addDependencies(localCss.messages);
      const combinedCss = globalCss.css + localCss.css;

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
  } else {
    callback(null, source);
  }
};
