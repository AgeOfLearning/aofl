const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const jscodeshift = require('jscodeshift/dist/Runner');
const glob = require('fast-glob');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: chalk.yellow(`Change routerInstance.matchedRoute to routerInstance.currentRoute.matchedRoute`),
    label: chalk.cyan(`Refactoring routerInstance.matchedRoute...`)
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
