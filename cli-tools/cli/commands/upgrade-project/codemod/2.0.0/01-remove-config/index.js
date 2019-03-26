const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');


module.exports = (projectRoot, projectInfo, commit = false) => {
  const configPath = path.join(projectRoot, '__config');
  const result = {
    skip: false,
    message: chalk.yellow(`${projectRoot}/__config will be removed and replaced by dot files in the root of the project.`),
    label: chalk.cyan(`Removing ${projectRoot}/__config`)
  };

  try {
    fs.lstatSync(configPath);
  } catch (e) {
    result.skip = true;
  }

  if (commit) {
    rimraf.sync(configPath);
  }

  return result;
};
