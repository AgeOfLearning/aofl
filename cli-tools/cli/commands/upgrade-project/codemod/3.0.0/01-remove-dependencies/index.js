const {Npm}= require('@aofl/cli-lib');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const toRemoveDev = ['@aofl/jsdoc-template'];

  const toRemoveProd = [
    '@aofl/web-components',
    '@babel/polyfill',
    '@babel/runtime',
    'ajv'
  ];

  const result = {
    skip: false,
    message: `Removing the following devDependencies as they have been deprecated or no longer needed`,
    info: `\t${[...toRemoveDev, ...toRemoveProd].join(', ')}`,
    label: `Removing dependencies`
  };

  if (commit) {
    await Npm.removeDependency(toRemoveDev, '-D');
    await Npm.removeDependency(toRemoveProd, '-S');
  }

  return result;
};
