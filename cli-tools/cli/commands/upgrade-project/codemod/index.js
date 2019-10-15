const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

let total = 0;
let totalApplied = 0;

module.exports = (dir) => {
  const files = fs.readdirSync(dir);
  const mods = files.reduce((acc, item) => {
    const itemPath = path.join(dir, item);
    if (fs.lstatSync(itemPath).isDirectory()) {
      const codeMod = require(itemPath);
      acc.push({
        skip: false,
        codeMod
      });
    }
    return acc;
  }, []);

  const analyze = async (projectRoot, projectInfo) => {
    for (let i = 0; i < mods.length; i++) {
      const mod = mods[i];
      const result = await mod.codeMod(projectRoot, projectInfo, false);
      mod.skip = result.skip;
      mod.label = result.label;
      mod.info = result.info;
      if (mod.skip === false) {
        if (total === 0) {
          process.stdout.write(chalk.yellow(`The following changes will apply during the upgrade...`) + '\n\n');
        }
        process.stdout.write(chalk.bold(chalk.yellow(`${++total}) ${result.message}\n`)));
        if (result.info) {
          process.stdout.write(chalk.cyan(result.info) + '\n');
        }
        process.stdout.write('\n');
      }
    }

    if (mods.some((item) => item.skip === false)) {
      return true;
    }
    return false;
  };

  const upgrade = async (projectRoot, projectInfo) => {
    for (let i = 0; i < mods.length; i++) {
      const mod = mods[i];

      if (mod.skip === false) {
        process.stdout.write(chalk.bold(chalk.bgMagenta(`${++totalApplied}) ${mod.label}`)) + '\n');
        if (mod.info) {
          process.stdout.write(chalk.magenta(mod.info) + '\n');
        }
        process.stdout.write('\n');
        await mod.codeMod(projectRoot, projectInfo, true);
      }
    }
  };

  return {
    analyze,
    upgrade
  };
};
