const path = require('path');
const fs = require('fs');

module.exports = (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: `Update package.json scripts {dev, prod, start:dev, start}`,
    label: `Updating package.json`
  };

  if (commit) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), {encoding: 'utf-8'}));
    packageJson.scripts.docs = 'jsdoc -c .jsdocrc.js';
    packageJson.scripts.types = 'jsdoc -c .jsdocrc-types.js';
    packageJson.types = 'types.d.ts';

    fs.writeFileSync(path.join(projectRoot, 'package.json'), JSON.stringify(packageJson, null, 2), {encoding: 'utf-8'});
  }

  return result;
};
