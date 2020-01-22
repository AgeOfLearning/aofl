const path = require('path');
const {Git} = require('@aofl/cli-lib');
const glob = require('fast-glob');
const fs = require('fs');


module.exports = async (projectRoot, projectInfo, commit = false) => {
  const routes = glob.sync('routes-*', {
    cwd: projectRoot,
    absolute: true,
    deep: 0,
    onlyDirectories: true
  });

  const assets = path.join(projectRoot, 'assets');
  const modules = path.join(projectRoot, 'modules');
  const templates = path.join(projectRoot, 'templates');
  const mainRoutes = path.join(projectRoot, 'routes');


  const result = {
    skip: false,
    message: `Move assets, modules, routes, templates to src`,
    info: `
    * ${assets} -> ./src/assets
    * ${modules} -> ./src/modules
    * ${templates} -> ./src/templates
    * ${mainRoutes} -> ./src/routes
    ${routes.map((item) => `* ${item} -> ./src/${path.basename(item)}`)}
    `,
    label: `Moving assets, modules, routes, templates to src`
  };


  if (commit) {
    fs.mkdirSync(path.join(projectRoot, 'src'), {recursive: true});
    try {
      fs.statSync(assets);
      await Git.mv(assets, path.join(projectRoot, 'src', 'assets'), true);
    } catch (e) {}

    try {
      fs.statSync(modules);
      await Git.mv(modules, path.join(projectRoot, 'src', 'modules'), true);
    } catch (e) {}

    try {
      fs.statSync(templates);
      await Git.mv(templates, path.join(projectRoot, 'src', 'template'), true);
    } catch (e) {}

    try {
      fs.statSync(path.join(projectRoot, 'src', 'template', 'main', 'template.ejs'));
      await Git.mv(
        path.join(projectRoot, 'src', 'template', 'main', 'template.ejs'),
        path.join(projectRoot, 'src', 'template', 'template.ejs'),
        true
      );
    } catch (e) {}

    try {
      fs.statSync(mainRoutes);
      await Git.mv(mainRoutes, path.join(projectRoot, 'src', 'routes'), true);
    } catch (e) {}

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      try {
        fs.statSync(route);
        await Git.mv(route, path.join(projectRoot, 'src', path.basename(route)), true); // eslint-disable-line
      } catch (e) {}
    }
  }

  return result;
};
