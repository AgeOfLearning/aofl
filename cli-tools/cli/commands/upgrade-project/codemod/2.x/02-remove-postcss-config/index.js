const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');


module.exports = (projectRoot, projectInfo, commit = false) => {
  const configPath = path.join(projectRoot, '.postcssrc.js');
  const result = {
    skip: false,
    message: chalk.yellow(`${configPath} will be removed.`),
    label: chalk.cyan(`Removing ${configPath}`)
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
