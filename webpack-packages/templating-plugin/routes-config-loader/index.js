const getRoutes = require('../get-routes');
const {getOptions} = require('loader-utils');

module.exports = async function() {
  const callback = this.async();
  const options = getOptions(this);

  if (options.cache === false) {
    this.cacheable(false);
  }

  let content = '';

  try {
    const routes = [];
    for (let i = 0; i < options.configs.length; i++) {
      routes.push(...(await getRoutes(options.configs[i], this.resourcePath)));
    }

    const routeConfigObj = {};
    for (let i = 0; i < routes.length; i++) {
      const {dependencyPath, rotation, routeConfig} = routes[i];
      if (typeof routeConfigObj[rotation] === 'undefined') {
        routeConfigObj[rotation] = [];
      }
      routeConfigObj[rotation].push(routeConfig);
      this.addDependency(dependencyPath);
    }

    const resolveRegex = /(resolve":\s)"(.*)"/g;
    const quoteRegex = /"/g;

    content = '/* eslint-disable */\nexport default ' + JSON.stringify(routeConfigObj, null, 2).replace(resolveRegex, (match, p1, p2) => {
      return p1 + p2;
    })
      .replace(quoteRegex, '\'') + ';';

    const hmrDeps = routeConfigObj.routes.map((item) => {
      let str = item.resolve.replace(/\(\)\s*=>\s*import\('/gi, '\'');
      str = str.replace(/'\)/g, '\'');
      return str;
    });

    if (process.env.NODE_ENV !== 'production' && this.hot) {
      content += `
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

        module.hot.accept([${hmrDeps.join(', ')}], function (deps) {
          const comp = __webpack_require__(deps[0]);
          const Ctor = comp.default;

          walk(document.body, (node) => {
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
                node.shouldUpdate(Ctor._classProperties);
                node.requestUpdate();
              }
            }
          });
        });
      }

      hmr();
      `;
    }
    callback(null, content);
  } catch (e) {
    callback(e);
  }
};
