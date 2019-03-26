const path = require('path');
const ProjectHelper = require('../../lib/project-helper');
const semver = require('semver');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Npm = require('../../lib/npm');

const upgradeConfig = require('./upgrade-config');

class UpgradeProject {
  constructor(target = '.') {
    this.target = path.resolve(target);
    this.projectRoot = ProjectHelper.findProjectRoot(this.target);

    if (!this.projectRoot) {
      process.stdout.write(chalk.yellow('Could not locate an AofL JS project.') + '\n');
      process.exit(1);
    }

    const projectPackage = Npm.findPackageDir(this.projectRoot);
    this.projectInfo = {
      package: require(path.join(projectPackage, 'package.json')),
      config: ProjectHelper.getConfig(this.projectRoot)
    };
    this.eligibleUpgrades = upgradeConfig.reduce((acc, item) => {
      if (semver.satisfies(this.projectInfo.config.version, item.from)) {
        acc.push(item);
      }
      return acc;
    }, []);

    if (this.eligibleUpgrades.length === 0) {
      process.stdout.write(chalk.green('Nothing to upgrade...') + '\n');
      process.exit(0);
    }
  }

  async init() {
    const upgradeObject = await this.promptUpgradeVersion();

    process.stdout.write(chalk.green(`Analyzing required changes...`) + '\n');
    const upgradeAvailable = await upgradeObject.runner.analyze(this.projectRoot, this.projectInfo);

    if (upgradeAvailable) {
      const answer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'doUpgrade',
          message: 'Continue with the upgrade?'
        }
      ]);
      process.stdout.write(chalk.cyan(`Applying changes...`) + '\n');
      process.stdout.write('\n');
      if (answer.doUpgrade) {
        await upgradeObject.runner.upgrade(this.projectRoot, this.projectInfo);
        process.stdout.write(chalk.green(`Upgrade to ${upgradeObject.to} was successful :)`) + '\n');
      } else {
        process.stdout.write(chalk.red('upgrade canceled') + '\n');
      }
    } else {
      process.stdout.write(chalk.green('Nothing to upgrade...') + '\n');
    }
  }

  async promptUpgradeVersion() {
    process.stdout.write(chalk.green(`Upgrading from ${this.projectInfo.config.version}...\n`));
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'upgradeVersion',
        message: 'Choose a version to upgrade to ...',
        choices: this.eligibleUpgrades.map((item) => `${item.to}`),
      }
    ]);

    return this.eligibleUpgrades.find((item) => item.to === answer.upgradeVersion);
  }
}

module.exports = UpgradeProject;
