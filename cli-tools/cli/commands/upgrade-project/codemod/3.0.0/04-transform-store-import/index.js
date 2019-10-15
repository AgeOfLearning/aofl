const chalk = require('chalk');
const path = require('path');
const jscodeshift = require('jscodeshift/dist/Runner');
const glob = require('fast-glob');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: `Deprecated @aofl/store will be updated to @aofl/store/dist/legacy. ` + chalk.red(`Don't forget to upgrade to new store`),
    label: `Refactoring @aofl/store import`
  };

  const files = glob.sync(['**/*.js'], {
    ignore: ['node_modules', 'coverage', 'api-docs', '__build', '__build_tests', '**/test'],
    onlyFiles: true,
    cwd: projectRoot
  });

  if (commit) {
    await jscodeshift.run(path.join(__dirname, 'transform.js'), files, {parser: 'flow'});
  }

  return result;
};
