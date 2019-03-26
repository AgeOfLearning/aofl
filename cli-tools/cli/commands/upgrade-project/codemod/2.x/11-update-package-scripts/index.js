const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: chalk.yellow(`Update package.json scripts {dev, prod, start:dev, start}`),
    label: chalk.cyan(`Updating package.json`)
  };

  if (commit) {
    projectInfo.package.scripts.test = 'npm run env:test -- npx aofl test';
    projectInfo.package.scripts.prod = 'npm run env:prod -- npx aofl build';
    projectInfo.package.scripts.dev = 'npm run env:dev -- npx aofl build';
    projectInfo.package.scripts['start:dev'] = 'npm run env:dev -- npx aofl serve';
    projectInfo.package.scripts.start = 'npm run env:prod -- npx aofl serve';
    fs.writeFileSync(path.join(projectRoot, 'package.json'), JSON.stringify(projectInfo.package, null, 2), {encoding: 'utf-8'});
  }

  return result;
};
