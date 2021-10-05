const fs = require('fs');
const path = require('path');
const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const {PurgeCSS} = require('purgecss');
const schema = require('./__config/schema.json');
const postcss = require('postcss');
const atImport = require('postcss-import');
const url = require('postcss-url');
const glob = require('fast-glob');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem');
const settingsParser = require('./settings-parser');
const sass = require('sass');
const findCacheDir = require('find-cache-dir');

const cacheDir = findCacheDir({name: 'webcomponent-css-loader'});
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, {recursive: true});
}
fs.mkdirSync(cacheDir, {recursive: true});

/**
 *
 * @param {*} source
 * @param {*} map
 * @param {*} meta
 */
module.exports = async function(source, sourceMap, meta) {
  const callback = this.async();
  const options = Object.assign({
    cache: true
  }, getOptions(this)); // eslint-disable-line

  const compilationOptions = this._compilation.options;

  validate(schema, options, {name: '@aofl/webcomponent-css-loader'});
  if (options.cache === false) {
    this.cacheable(false);
  }

  const srcFile = fs.readFileSync(this.resourcePath, 'utf-8');
  try {
    const sourceStr = source.toString();
    const userSettings = settingsParser(srcFile);

    if (userSettings === null || process.env.NODE_ENV === 'development') {
      callback(null, source);
      return;
    }

    const scssREGEX = /\.scss$/;
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
          // console.log('------>', id, basedir);
          const fileSystem = new CachedInputFileSystem(fs, 10000);
          const tildeAliases = Object.keys(compilationOptions.resolve.alias).reduce((acc, item) => {
            acc[`~${item}`] = compilationOptions.resolve.alias[item];
            return acc;
          }, {});

          const resolver = ResolverFactory.createResolver({
            fileSystem,
            ...compilationOptions.resolve,
            useSyncFileSystemCalls: true,
            mainFields: ['scss', 'sass', 'browser', 'main'],
            alias: {
              ...compilationOptions.resolve.alias,
              ...tildeAliases
            }
          });

          const importPath = resolver.resolveSync({}, basedir, id);

          if (scssREGEX.test(importPath)) {
            const cachePath = path.join(cacheDir, path.basename(importPath, 'scss') + 'css');
            try {
              if (!fs.existsSync(cachePath)) {
                const result = sass.renderSync({
                  file: importPath,
                  importer: (id, baserid) => {
                    try {
                      console.log('------->id,basedir', id, basedir);
                      const filePath = resolver.resolveSync({}, baserid, id.replace(/^~/, ''));
                      console.log('------->filepath', filePath);
                      return {file: filePath};
                    } catch (e) {
                      console.log(e);
                    }
                  }
                });
                fs.writeFileSync(cachePath, result.css);
              }
              return cachePath;
            } catch (e) {
              callback(e);
            }
          }

          return importPath;
        }
      }))
      .use(url({
        url: 'rebase'
      }))
      .process(sourceStr, {
        from: this.resourcePath,
        map: false,
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
        },
        {
          raw: rawContent,
          extension: 'html'
        }
      ],
      css: [
        {
          raw: combinedCss
        }
      ],
      rejected: false,
      ...userSettings
    };

    const purgeCss = new PurgeCSS();
    const purified = await purgeCss.purge(config);
    callback(null, purified[0].css, sourceMap, meta);
  } catch (e) {
    callback(e);
  }
};
