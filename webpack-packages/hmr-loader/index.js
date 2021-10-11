const {parse, init} = require('es-module-lexer');
const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const {parseClass} = require('./src/parse-class');

const schema = {
  'type': 'object',
  'properties': {
    'cache': {
      'type': 'boolean'
    },
    'decorators': {
      'type': 'array'
    },
    'baseClasses': {
      type: 'array'
    }
  }
};

module.exports = async function(source) {
  const callback = this.async();
  const options = Object.assign({
    cache: true,
    decorators: [],
    baseClasses: []
  }, getOptions(this));

  validate(schema, options, {name: 'Aofl HMR Loader'});

  if (options.cache === false) {
    this.cacheable(false);
  }

  if (process.env.NODE_ENV === 'production' || !this.hot) {
    callback(null, source);
    return;
  }
  const classInfo = parseClass(source, this.resourcePath);
  const patch = [];

  for (let i = 0; i < classInfo.length; i++) {
    const ci = classInfo[i];
    if (ci.decorators.filter((item) => options.decorators.includes(item)).length) {
      patch.push(ci);
    } else if (ci.heritageClasses.filter((item) => options.baseClasses.includes(item)).length) {
      patch.push(ci);
    }
  }

  await init;
  const [imports] = parse(source);
  let importAdoptStyles = true;

  if (imports.length > 0) {
    const importPaths = [];
    for (let i = 0; i < imports.length; i++) {
      const res = imports[i];
      const importPath = '\'' + res.n + '\'';
      if (importPaths.indexOf(importPath)) {
        importPaths.push(importPath);
      }

      const importStatement = source.substring(res.ss, res.se);
      if (importStatement.indexOf('adoptStyles') > -1) {
        importAdoptStyles = false;
      }
    }

    const ctors = `[${patch.map((item) => item.className).join(', ')}]`;

    const tmpSource = `
        ${importAdoptStyles? `import {adoptStyles} from 'lit';`: ''};
        ${source}
        const walk = function walk(root, call) {
          call(root);
          if (root.shadowRoot) {
            walk(root.shadowRoot, call);
          }

          Array.from(root.children).forEach((child) => {
            walk(child, call);
          });
        }

        const hmr = function hmr() {
          if (!module.hot) {
            return;
          }


          const ctors = ${ctors};
          const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
            (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
            ('adoptedStyleSheets' in Document.prototype) &&
            ('replace' in CSSStyleSheet.prototype);

          const patch = () => {
            for (let i = 0; i < ctors.length; i++) {
              const Ctor = ctors[i];

              // static callback
              Ctor.hotReplacedCallback = function hotReplacedCallback() {
                this.finalize();
              };
              // instance callback
              Ctor.prototype.hotReplacedCallback = function hotReplacedCallback() {
                if (!supportsAdoptingStyleSheets) {
                  const nodes = Array.from(this.renderRoot.children);
                  for (const node of nodes) {
                    if (node.tagName.toLowerCase() === 'style') {
                      node.remove();
                    }
                  }
                }
                this.constructor.finalizeStyles();
                if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
                  adoptStyles(
                    this.renderRoot,
                    this.constructor.styles
                  );
                }
                this.requestUpdate();
              };

              walk(document.body, (node) => {
                if (node instanceof Ctor) {
                  const descriptorsS = Object.getOwnPropertyDescriptors(Ctor);
                  const descriptorsI = Object.getOwnPropertyDescriptors(Ctor.prototype);

                  for (const name in descriptorsS) {
                    if (name !== 'length' && name !== 'name' && name !== 'prototype') {
                      Object.defineProperty(node.constructor, name, descriptorsS[name]);
                    }
                  }

                  for (const name in descriptorsI) {
                    Object.defineProperty(node, name, descriptorsI[name]);
                  }

                  if (node.hotReplacedCallback) {
                    node.constructor.hotReplacedCallback();
                    node.hotReplacedCallback();
                  }
                }
              });
            }
          };

          if (ctors.length > 0) {
            patch();
            module.hot.accept([${importPaths.join(', ')}], function (deps) {
              patch();
            });
            module.hot.accept((err, {moduleId, module}) => {
              console.log('self error', err);
            });
          }
        };

        hmr();
    `;

    source = tmpSource;
  }

  callback(null, source);
};
