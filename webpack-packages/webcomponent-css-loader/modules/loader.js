const fs = require('fs');
const path = require('path');
const {getOptions} = require('loader-utils');
const validationOptions = require('schema-utils');
const Purgecss = require('purgecss');
const schema = require('./__config/schema.json');
const postcss = require('postcss');
const atImport = require('postcss-import');
const url = require('postcss-url');
const glob = require('fast-glob');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');
const NodeJsInputFileSystem = require('enhanced-resolve/lib/NodeJsInputFileSystem');
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem');
const settingsParser = require('./settings-parser');


/**
 *
 * @param {*} source
 * @param {*} map
 * @param {*} meta
 */
module.exports = async function(source) {
  const callback = this.async();
  const options = Object.assign({
    cache: true
  }, getOptions(this)); // eslint-disable-line

  const compilationOptions = this._compilation.options;

  validationOptions(schema, options, '@aofl/webcomponent-css-loader');
  if (options.cache === false) {
    this.cacheable(false);
  }

  try {
    const sourceStr = source.toString();
    const userSettings = settingsParser(sourceStr);

    if (userSettings === null || process.env.NODE_ENV === 'development') {
      callback(null, source);
      return;
    }

    const addDependencies = (messages) => {
      if (Array.isArray(messages)) {
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          if (typeof message.type === 'string' && message.type === 'dependency') {
            this.addDependency(message.file);
          }
        }
      }
    };


    let combinedCss = '';

    const localCss = await postcss()
      .use(atImport({
        root: path.dirname(this.resourcePath),
        resolve: (id, basedir) => {
          const fileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), 60000);
          const tildeAliases = Object.keys(compilationOptions.resolve.alias).reduce((acc, item) => {
            acc[`~${item}`] = compilationOptions.resolve.alias[item];
            return acc;
          }, {});

          const resolver = ResolverFactory.createResolver({
            fileSystem,
            ...compilationOptions.resolve,
            useSyncFileSystemCalls: true,
            alias: {
              ...compilationOptions.resolve.alias,
              ...tildeAliases
            }
          });

          return resolver.resolveSync({}, basedir, id);
        }
      }))
      .use(url({
        url: 'rebase'
      }))
      .process(sourceStr, {
        from: this.resourcePath,
        map: false
      });

    addDependencies(localCss.messages);
    combinedCss += localCss;

    const cwd = path.dirname(this.resourcePath);
    const dirs = glob.sync('**', {
      cwd,
      onlyFiles: true,
      deep: 1,
      ignore: ['*.css', '*.scss']
    });

    let rawContent = '';
    for (let i = 0; i < dirs.length; i++) {
      rawContent += fs.readFileSync(path.join(cwd, dirs[i]), {encoding: 'utf-8'});
    }
    const config = {
      content: [
        {
          raw: rawContent,
          extension: 'js'
        }
      ],
      css: [
        {
          raw: combinedCss
        }
      ],
      rejected: true,
      ...userSettings
    };

    const purgeCss = new Purgecss(config);
    const purified = purgeCss.purge();

    callback(null, purified[0].css);
  } catch (e) {
    callback(e);
  }
};
