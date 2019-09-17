const chalk = require('chalk');
const {Npm} = require('@aofl/cli-lib');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const toRemove = [
    '@aofl/jsdoc-template',
    '@aofl/html-webpack-purify-internal-css-plugin',
    '@aofl/i18n-loader',
    '@aofl/templating-plugin',
    '@aofl/unit-testing-plugin',
    '@aofl/webcomponent-css-loader'
  ];
  const aoflDependencies = [
    ...Object.keys(projectInfo.package.devDependencies).filter((item) => item.indexOf('@aofl/') === 0 && toRemove.indexOf(item) === -1),
    ...Object.keys(projectInfo.package.dependencies).filter((item) => item.indexOf('@aofl/') === 0 && toRemove.indexOf(item) === -1),
    '@aofl/cli'
  ];
  const prodDependencies = [
    ...aoflDependencies.map((item) => item + '@2.0.0'),
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
