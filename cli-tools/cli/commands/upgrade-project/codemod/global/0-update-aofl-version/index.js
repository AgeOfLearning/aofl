const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const version = require('../../../../../package.json').version;

module.exports = (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: chalk.yellow(`Update AofL JS version`),
    label: chalk.cyan(`Updating AofL JS version`)
  };

  if (version === projectInfo.config.version) {
    result.skip = true;
  }

  if (commit) {
    projectInfo.config.version = version;
    fs.writeFileSync(path.join(projectRoot, '.aofl.json'), JSON.stringify(projectInfo.config, null, 2), {encoding: 'utf-8'});
  }

  return result;
};
