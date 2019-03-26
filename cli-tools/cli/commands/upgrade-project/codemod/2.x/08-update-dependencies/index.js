const chalk = require('chalk');
const Npm = require('../../../../../lib/npm');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const aoflDependencies = [
    ...Object.keys(projectInfo.package.devDependencies).filter((item) => item.indexOf('@aofl/') === 0 && item !== '@aofl/jsdoc-template'),
    ...Object.keys(projectInfo.package.dependencies).filter((item) => item.indexOf('@aofl/') === 0 && item !== '@aofl/jsdoc-template'),
    '@aofl/cli'
  ];
  const prodDependencies = [
    ...aoflDependencies.map((item) => item + '@next'),
    '@babel/polyfill@7.4.0',
    '@babel/runtime@7.4.2',
    'isomorphic-fetch@2.2.1',
    'lit-element@2.1.0',
    'lit-html@1.0.0'
  ];
  const devDependencies = [
    '@aofl/jsdoc-template@3.4.0',
    'cross-env@5.2.0',
    'eslint@5.15.0',
    'eslint-config-aofl@1.0.0-alpha.1',
    'jsdoc@3.5.5'
  ];

  const result = {
    skip: false,
    message: chalk.yellow(`Following devDependencies will be updated:

    ${devDependencies.join(', ')}

The following prod dependencies will be updated:
    ${prodDependencies.join(', ')}
`),
    label: chalk.cyan(`Updating dependencies`)
  };

  if (commit) {
    await Npm.installDependency(devDependencies, '-D', false, true);
    await Npm.installDependency(prodDependencies, '-S', false, true);
  }

  return result;
};
