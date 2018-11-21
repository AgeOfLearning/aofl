const getRoutes = require('../get-routes');
const {getOptions} = require('loader-utils');

module.exports = async function(source) {
  this.cacheable(false);

  const callback = this.async();
  const options = getOptions(this);
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

    content = 'export default ' + JSON.stringify(routeConfigObj, null, 2).replace(resolveRegex, (match, p1, p2) => {
      return p1 + p2;
    }).replace(quoteRegex, '\'');

    callback(null, content);
  } catch (e) {
    callback(e);
  }
};
