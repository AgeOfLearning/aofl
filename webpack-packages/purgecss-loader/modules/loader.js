const fs = require('fs');
const path = require('path');
const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const {PurgeCSS} = require('purgecss');
const schema = require('./schema.json');
const postcss = require('postcss');
const atImport = require('postcss-import');
const url = require('postcss-url');
const glob = require('fast-glob');
const ResolverFactory = require('enhanced-resolve/lib/ResolverFactory');
const CachedInputFileSystem = require('enhanced-resolve/lib/CachedInputFileSystem');
const sass = require('sass');
const findCacheDir = require('find-cache-dir');
const {merge} = require('webpack-merge');

const cacheDir = findCacheDir({name: 'purge-css-loader'});
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
  const options = merge({}, {
    cache: true,
    settings: {
      fontFace: true,
      keyframes: true,
      variables: true,
      safelist: [':host'],
      blocklist: [],
    },
    files: {}
  }, getOptions(this)); // eslint-disable-line

  let userSettings = Object.assign({content: []}, options.settings);
  if (options.files[this.resourcePath] !== void 0) {
    userSettings = merge({}, userSettings, options.files[this.resourcePath]);
  }

  const compilationOptions = this._compilation.options;

  validate(schema, options, {name: 'purge-css-loader'});
  if (options.cache === false) {
    this.cacheable(false);
  }

  try {
    const sourceStr = source.toString();

    // if (process.env.NODE_ENV === 'development') {
    //   callback(null, source);
    //   return;
    // }

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
                      const filePath = resolver.resolveSync({}, baserid, id.replace(/^~/, ''));
                      return {file: filePath};
                    } catch (e) {
                      console.log(e);
                    }
                  },
                  sassOptions: {
                    fiber: require('fibers'),
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
      ignore: ['*.css', '*.scss'],
      absolute: true
    });

    dirs.push(...userSettings.content);
    delete userSettings.content;
    const rawContent = [];
    for (let i = 0; i < dirs.length; i++) {
      const file = dirs[i];
      rawContent.push({
        raw: fs.readFileSync(file, {encoding: 'utf-8'}),
        extension: 'ts'
      });
    }

    const config = {
      content: dirs,
      css: [
        {
          raw: combinedCss
        }
      ],
      ...userSettings,
      rejected: false,
    };

    const purgeCss = new PurgeCSS();
    const purified = await purgeCss.purge(config);

    callback(null, purified[0].css, sourceMap, meta);
  } catch (e) {
    callback(e);
  }
};
