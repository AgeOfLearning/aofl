const path = require('path');
const jscodeshift = require('jscodeshift/dist/Runner');
const glob = require('fast-glob');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: `Move previously exported lit-html modules from @aofl/web-components/element to lit-html`,
    label: `Refactoring import {render} from '@aofl/web-components/element.`
  };

  const files = glob.sync(['**/*.js'], {
    ignore: ['node_modules', 'coverage', 'api-docs', '__build', '__build_tests'],
    onlyFiles: true,
    cwd: projectRoot
  });

  if (commit) {
    await jscodeshift.run(path.join(__dirname, 'transform.js'), files, {parser: 'flow'});
  }

  return result;
};
