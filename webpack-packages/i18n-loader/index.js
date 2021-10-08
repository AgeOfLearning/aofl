const {parse, init} = require('es-module-lexer');
const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const {parseClass} = require('./src/parseclass');

const schema = {
  'type': 'object',
  'properties': {
    'cache': {
      'type': 'boolean'
    }
  }
};

module.exports = async function(source) {
  const callback = this.async();
  const options = Object.assign({
    cache: true,
  }, getOptions(this));

  validate(schema, options, {name: 'Aofl HMR Loader'});

  if (options.cache === false) {
    this.cacheable(false);
  }

  if (process.env.NODE_ENV === 'production' || !this.hot) {
    callback(null, source);
    return;
  }

  await init;

  const classInfo = parseClass(source, this.resourcePath);
  console.log(classInfo);
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

          module.hot.accept([${importPaths.join(', ')}], function (deps, ...args) {
            const comp = __webpack_require__(deps[0]);
            let Ctor = comp.default;
            if (typeof comp.default === 'undefined') {
              for (const key in comp) {
                if (!Object.prototype.hasOwnProperty.call(comp, key)) continue;
                Ctor = comp[key];
                if (typeof Ctor.tagName !== 'undefined') {
                  break;
                }
              }
            }
            const ctors = [];

            if (typeof Ctor === 'undefined' || typeof Ctor.tagName === 'undefined') {
              for (const key in module.__proto__.exports) {
                if (!Object.prototype.hasOwnProperty.call(module.__proto__.exports, key)) continue;
                Ctor = module.__proto__.exports[key];
                if (typeof Ctor.tagName !== 'undefined') {
                  break;
                }
              }
              if (module !== void 0 && module.__proto__ !== void 0 && module.__proto__.exports !== void 0 && module.__proto__.exports.default !== void 0) {
                Ctor = module.__proto__.exports.default;
              }
            }
            if (typeof Ctor === 'undefined' || typeof Ctor.tagName === 'undefined') {
              module.hot.decline([${importPaths.join(', ')}]);
              return;
            }

            console.log(Ctor);

            const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
              (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
              ('adoptedStyleSheets' in Document.prototype) &&
              ('replace' in CSSStyleSheet.prototype);
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

            walk(document.body, async (node) => {
              if (node.localName === Ctor.tagName) {
                Ctor.observedAttributes;
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
          });
        }

        hmr();
    `;

    source = tmpSource;
  }

  callback(null, source);
};
