const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = (projectRoot, projectInfo, commit = false) => {
  const configPath = path.join(projectRoot, '.wctrc.json');
  const templateFilePath = path.join(__dirname, 'templates', '.wctrc.json.sample');
  const template = fs.readFileSync(templateFilePath, {encoding: 'utf-8'});

  const result = {
    skip: true,
    message: chalk.yellow(`${configPath} will be generated`),
    label: chalk.cyan(`Generating ${configPath}`)
  };

  try {
    fs.lstatSync(configPath);
  } catch (e) {
    result.skip = false;
  }

  if (commit) {
    fs.writeFileSync(configPath, template, {encoding: 'utf-8'});
  }

  return result;
};
