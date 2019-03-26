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
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), {encoding: 'utf-8'}));
    packageJson.scripts.test = 'npm run env:test -- npx aofl test';
    packageJson.scripts.prod = 'npm run env:prod -- npx aofl build';
    packageJson.scripts.dev = 'npm run env:dev -- npx aofl build';
    packageJson.scripts['start:dev'] = 'npm run env:dev -- npx aofl serve';
    packageJson.scripts.start = 'npm run env:prod -- npx aofl serve';
    fs.writeFileSync(path.join(projectRoot, 'package.json'), JSON.stringify(packageJson, null, 2), {encoding: 'utf-8'});
  }

  return result;
};
