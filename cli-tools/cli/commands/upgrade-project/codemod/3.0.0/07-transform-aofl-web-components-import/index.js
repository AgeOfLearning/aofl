const path = require('path');
const jscodeshift = require('jscodeshift/dist/Runner');
const glob = require('fast-glob');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: `Refactor deprecated @aofl/web-components/*`,
    label: `Refactoring '@aofl/web-components/element imports`
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
