const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = (projectRoot, projectInfo, commit = false) => {
  const configPath = path.join(projectRoot, '.eslintrc.js');
  const templateFilePath = path.join(__dirname, 'templates', '.eslintrc.js.sample');
  const template = fs.readFileSync(templateFilePath, {encoding: 'utf-8'});

  const result = {
    skip: false,
    message: chalk.yellow(`${configPath} will be updated to use https://www.npmjs.com/package/eslint-config-aofl`),
    label: chalk.cyan(`Generating ${configPath}`)
  };

  if (commit) {
    fs.writeFileSync(configPath, template, {encoding: 'utf-8'});
  }

  return result;
};
