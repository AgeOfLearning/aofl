const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const titleCase = require('title-case');


module.exports = (projectRoot, projectInfo, commit = false) => {
  const configPath = path.join(projectRoot, '.aofl.js');
  const templateFilePath = path.join(__dirname, 'templates', '.aofl.js.sample');
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
    const projectName = titleCase(projectInfo.package.name);
    const content = template.replace(/__application_name__/g, projectName);
    fs.writeFileSync(configPath, content, {encoding: 'utf-8'});
  }

  return result;
};
