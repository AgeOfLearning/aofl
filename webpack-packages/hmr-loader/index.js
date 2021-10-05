const {parse} = require('es-module-lexer');
const {getOptions} = require('loader-utils');
const {validate} = require('schema-utils');
const schema = {
  'type': 'object',
  'properties': {
    'cache': {
      'type': 'boolean'
    }
  }
};

module.exports = function(source) {
  const callback = this.async();
  const options = Object.assign({
    cache: true,
  }, getOptions(this));

  validate(schema, options, {name: 'Aofl HMR Loader'});

  if (options.cache === false) {
    this.cacheable(false);
  }

  if (options.cache === false) {
    this.cacheable(false);
  }

  if (process.env.NODE_ENV === 'production' || !this.hot) {
    callback(null, source);
    return;
  }

  const [imports] = parse(source);
  if (imports.length > 0) {
    const importPaths = [];
    for (let i = 0; i < imports.length; i++) {
      const res = imports[i];
      if (importPaths.indexOf(res.n)) {
        importPaths.push('\'' + res.n + '\'');
      }
    }

    const tmpSource = `${source}
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
                if (typeof Ctor.is !== 'undefined') {
                  break;
                }
              }
            }
            const ctors = [];

            if (typeof Ctor === 'undefined' || typeof Ctor.is === 'undefined') {
              for (const key in module.__proto__.exports) {
                if (!Object.prototype.hasOwnProperty.call(module.__proto__.exports, key)) continue;
                Ctor = module.__proto__.exports[key];
                if (typeof Ctor.is !== 'undefined') {
                  break;
                }
              }
              if (module !== void 0 && module.__proto__ !== void 0 && module.__proto__.exports !== void 0 && module.__proto__.exports.default !== void 0) {
                Ctor = module.__proto__.exports.default;
              }
            }
            if (typeof Ctor === 'undefined' || typeof Ctor.is === 'undefined') {
              module.hot.decline([${importPaths.join(', ')}]);
              return;
            }

            walk(document.body, async (node) => {
              if (node.localName === Ctor.is) {
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

                if (node.connectedCallback) {
                  node.connectedCallback();
                  node.shouldUpdate(Ctor.__attributeToPropertyMap);
                  node.requestUpdate();
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
