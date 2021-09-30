const path = require('path');
const getRoutes = require('../get-routes');
const {getOptions} = require('loader-utils');

module.exports = async function() {
  const callback = this.async();
  const options = getOptions(this);


  this.cacheable(false);

  let content = '/* eslint-disable */\n';

  try {
    const routes = [];
    const dependencies = [];
    const importStatements = {};
    for (let i = 0; i < options.configs.length; i++) {
      routes.push(...(await getRoutes(options.configs[i], this.resourcePath))); // eslint-disable-line no-await-in-loop
    }

    const routeConfigObj = {};
    for (let i = 0; i < routes.length; i++) {
      const {index, dependencyPath, rotation, routeConfig} = routes[i];
      const relPath = path.relative(path.dirname(this.resourcePath), dependencyPath);
      const importVar = `routes${i}`;

      if (typeof importStatements[relPath] === 'undefined') {
        dependencies.push(relPath);
        importStatements[relPath] = importVar;
        const importStatement = `import {routes as ${importVar}} from '${relPath}';`;
        content += importStatement + '\n';
        routeConfig.resolve = `${importVar}[${index}].resolve`;
        routeConfig.middleware = `${importVar}[${index}].middleware`;
      } else {
        routeConfig.resolve = `${importStatements[relPath]}[${index}].resolve`;
        routeConfig.middleware = `${importStatements[relPath]}[${index}].middleware`;
      }
      if (typeof routeConfigObj[rotation] === 'undefined') {
        routeConfigObj[rotation] = [];
      }
      routeConfigObj[rotation].push(routeConfig);
      this.addDependency(dependencyPath);
    }

    const resolveRegex = /(resolve":\s|middleware":\s)"(.*)"/g;
    const quoteRegex = /"/g;

    const configJson = JSON.stringify(routeConfigObj, null, 2)
      .replace(resolveRegex, (match, p1, p2) => {
        return p1 + p2;
      })
      .replace(quoteRegex, '\'') + ';';

    content += `export default ${configJson};\n`;

    callback(null, content);
  } catch (e) {
    console.log(e);
    callback(e);
  }
};
