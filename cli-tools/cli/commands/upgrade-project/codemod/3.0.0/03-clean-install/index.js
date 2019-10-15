const {Npm} = require('@aofl/cli-lib');
const rimraf = require('rimraf');
const path = require('path');

module.exports = async (projectRoot, projectInfo, commit = false) => {
  const nodeMdolues = path.join(process.cwd(), 'node_modules');
  const packageLock = path.join(process.cwd(), 'package-lock.json');

  const result = {
    skip: false,
    message: `After updating dependencies it will remove node_modules and package-lock.json and npm install again to remove any artifacts`,
    info: `
      * ${nodeMdolues}
      * ${packageLock}
    `,
    label: `Clean Install`
  };

  if (commit) {
    rimraf.sync(nodeMdolues);
    rimraf.sync(packageLock);
    await Npm.install();
  }

  return result;
};
