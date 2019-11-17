const chalk = require('chalk');
const {Npm} = require('@aofl/cli-lib');
/** @todo bote -> 3.0.0 */
module.exports = async (projectRoot, projectInfo, commit = false) => {
  const toRemove = [
    '@aofl/web-components',
    '@aofl/jsdoc-template'
  ];

  const aoflDependencies = [
    ...Object.keys(projectInfo.package.devDependencies).filter((item) => item.indexOf('@aofl/') === 0 && toRemove.indexOf(item) === -1),
    ...Object.keys(projectInfo.package.dependencies).filter((item) => item.indexOf('@aofl/') === 0 && toRemove.indexOf(item) === -1),
  ];
  const prodDependencies = [
    ...aoflDependencies.map((item) => item + '@3'),
    'isomorphic-fetch@2.2.1',
    'lit-element@2.2.1',
    'lit-html@1.1.2',
    'core-js@3',
    '@aofl/element@3',
    '@aofl/drawer@3',
    '@aofl/select@3',
    '@aofl/picture@3',
    '@aofl/middleware@3',
    '@aofl/object-utils@3',
    '@aofl/polyfill-service@3',
    '@aofl/register-callback@3',
    '@aofl/router@3',
    '@aofl/server-environment@3',
    '@aofl/store@3',
    '@aofl/component-utils@3',
    '@aofl/cli@3',
    '@aofl/cli-lib@3'
  ].filter((item, index, arr) => arr.indexOf(item) === index);

  const devDependencies = [
    'eslint-config-aofl',
    'cross-env@6.0.3',
    'eslint@6.5.1',
    'ink-docstrap',
    'jsdoc@3.6.3',
    'tsd-jsdoc@2.4.0'
  ];

  const result = {
    skip: false,
    message: `Installing prod/devDependencies`,
    info: `
    dev:
    ${devDependencies.join(', ')}

    prod:
    ${prodDependencies.join(', ')}

    ${chalk.bold(chalk.red(`Update polyfills to use 'core-js' instead of @babel/polyfill as it's deprecated. To detect IE11 use Proxy. Finally, object.assign no longer needs to be polyfilled.

      // sample polyfills.js
      export default {
        'fetch': () => import('isomorphic-fetch'),
        'Proxy': () => import('core-js')
      }

      **Note: Proxy cannot be implemented in es5 (https://github.com/zloirock/core-js#missing-polyfills). Which makes it a safe method to detect IE11**
    `))}
    `,
    label: chalk.bgMagenta(`Updating dependencies`)
  };

  if (commit) {
    await Npm.installDependency(devDependencies, '-D', false, true);
    await Npm.installDependency(prodDependencies, '-S', false, true);
  }

  return result;
};
