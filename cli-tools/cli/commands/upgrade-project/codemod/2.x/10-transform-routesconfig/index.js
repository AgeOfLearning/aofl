const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const jscodeshift = require('jscodeshift/dist/Runner');
const glob = require('fast-glob');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: chalk.yellow(`import routesConfig from '@aofl/templating-plugin/routes.config; ... will be transformed to import routesConfig from './__config/routes';`),
    label: chalk.cyan(`Refactoring import routesConfig...`)
  };

  const files = glob.sync(['**/*.js'], {
    ignore: ['node_modules'],
    onlyFiles: true,
    cwd: projectRoot
  });

  if (commit) {
    fs.writeFileSync(path.join(projectRoot, 'modules', '__config', 'routes.js'), '', {encoding: 'utf-8'});
    await jscodeshift.run(path.join(__dirname, 'transform.js'), files, {verbose: false});
  }

  return result;
};
