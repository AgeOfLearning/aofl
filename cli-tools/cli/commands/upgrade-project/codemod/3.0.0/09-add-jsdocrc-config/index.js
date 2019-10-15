const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

module.exports = (projectRoot, projectInfo, commit = false) => {
  const configPath = path.join(projectRoot, '.jsdocrc.js');
  const templateFilePath = path.join(__dirname, 'templates', '.jsdocrc.js.sample');
  const template = fs.readFileSync(templateFilePath, {encoding: 'utf-8'});

  const typesPath = path.join(projectRoot, '.jsdocrc-types.js');
  const typesFilePath = path.join(__dirname, 'templates', '.jsdocrc-types.js.sample');
  const typesTemplate = fs.readFileSync(typesFilePath, {encoding: 'utf-8'});

  const result = {
    skip: false,
    message: `${configPath} & ${typesPath} will be generated`,
    label: `Generating ${configPath} & ${typesPath}`
  };


  if (commit) {
    rimraf.sync(path.join(projectRoot, '.jsdocrc.json'));
    fs.writeFileSync(configPath, template, {encoding: 'utf-8'});
    fs.writeFileSync(typesPath, typesTemplate, {encoding: 'utf-8'});
  }

  return result;
};
