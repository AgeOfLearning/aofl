const chalk = require('chalk');
const path = require('path');
const jscodeshift = require('jscodeshift/dist/Runner');
const glob = require('fast-glob');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: chalk.yellow(`import AoflElement ... will be transformed to import {AoflElement}.`),
    label: chalk.cyan(`Refactoring import aoflElement...`)
  };

  const files = glob.sync(['**/*.js'], {
    ignore: ['node_modules'],
    onlyFiles: true,
    cwd: projectRoot
  });

  if (commit) {
    await jscodeshift.run(path.join(__dirname, 'transform.js'), files, {});
  }

  return result;
};
