const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

module.exports = (dir) => {
  const files = fs.readdirSync(dir);
  const mods = files.reduce((acc, item) => {
    const itemPath = path.join(dir, item);
    // if (item.indexOf('10') !== 0) return acc;
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
    let changesDetected = false;
    for (let i = 0; i < mods.length; i++) {
      const mod = mods[i];
      const result = await mod.codeMod(projectRoot, projectInfo, false);
      mod.skip = result.skip;
      mod.label = result.label;
      if (mod.skip === false) {
        if (changesDetected === false) {
          process.stdout.write(chalk.yellow(`The following changes will apply during the upgrade...`) + '\n');
          changesDetected = true;
        }
        process.stdout.write('- ' + result.message + '\n');
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
        process.stdout.write(chalk.bold(mod.label) + '\n');
        await mod.codeMod(projectRoot, projectInfo, true);
      }
    }
  };

  return {
    analyze,
    upgrade
  };
};
