const path = require('path');
const jscodeshift = require('jscodeshift/dist/Runner');
const glob = require('fast-glob');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: `Refactor routerInstance.navigate to used the new meta object notation.`,
    info: '\trouterInstance.navigate(route, true, true) => routerInstance.navigate(path, {forceReload: true, poppedState: true})',
    label: `Refactoring routerInstance.navigate(...)`
  };

  const files = glob.sync(['**/*.js'], {
    ignore: ['node_modules'],
    onlyFiles: true,
    cwd: projectRoot
  });

  if (commit) {
    await jscodeshift.run(path.join(__dirname, 'transform.js'), files, {verbose: false, parser: 'flow'});
  }

  return result;
};
