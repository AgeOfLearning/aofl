const parseImports = require('parse-es6-imports');
const {getOptions} = require('loader-utils');
const validationOptions = require('schema-utils');
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

  validationOptions(schema, options, {name: 'Aofl HMR Loader'});

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

  const results = parseImports(source);

  if (results.length > 0) {
    const importPaths = [];
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      if (importPaths.indexOf(res.fromModule)) {
        importPaths.push('\'' + res.fromModule + '\'');
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

          if (typeof Ctor === 'undefined' || typeof Ctor.is === 'undefined') {
            if (module !== void 0 && module.__proto__ !== void 0 && module.__proto__.exports !== void 0 && module.__proto__.exports.default !== void 0)
            Ctor = module.__proto__.exports.default;
          }
          if (typeof Ctor === 'undefined' || typeof Ctor.is === 'undefined') {
            module.hot.decline([${importPaths.join(', ')}]);
            return;
          }
          walk(document.body, async (node) => {
            if (node.localName === Ctor.is) {
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
                node.shouldUpdate(Ctor._classProperties);
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
