const chalk = require('chalk');
const {Git, Npm} = require('@aofl/cli-lib');
const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');
const {exitOnUncommittedChanges} = require('../../lib/uncommitted-changes');
/**
 *
 *
 * @class ConcludeModule
 */
class ConcludeModule {
  /**
   *Creates an instance of ConcludeModule.
   * @param {*} [modules=[]]
   * @param {*} all
   * @param {*} revert
   * @memberof ConcludeModule
   */
  constructor(modules = [], all, revert) {
    this.cwd = process.cwd();
    this.all = all;
    this.revert = revert;
    this.configPath = path.resolve(this.cwd, '.aofl.json');
    this.config = this.getConfig();
    this.modules = this.getModules(modules);
  }

  /**
   *
   *
   * @memberof ConcludeModule
   */
  async init() {
    await exitOnUncommittedChanges();
    const modules = [].concat(this.modules);
    const gen = function* gen() {
      yield* modules;
    }();

    const concludeModule = async () => {
      const next = gen.next();
      if (next.done) {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), {encoding: 'utf-8'});
        return;
      }
      const m = next.value;
      try {
        await this.checkOtherInstalledPackages(m);
        let version = '';
        if (this.revert) {
          version = '@' + m.package.version;
        } else {
          const updatedPackage = this.getModulePackage(m.localPath, m.name);
          if (typeof updatedPackage.version !== 'undefined') {
            version = '@' + updatedPackage.version;
          }
        }
        process.stdout.write(chalk.yellow(`\nUninstalling ${m.name}\n`) + '\n');
        await Npm.removeDependency([m.name], m.type.flag);
        process.stdout.write(chalk.yellow(`\nRemoving submodule ${m.localPath}\n`) + '\n');
        await Git.removeSubmodule(m.localPath);
        process.stdout.write(chalk.yellow(`\nInstalling ${m.name}@${version}\n`) + '\n');
        await Npm.installDependency([m.name + version], m.type.flag);
        const index = this.config.modules.findIndex((item) => item.name === m.name);
        this.config.modules.splice(index, 1);
      } catch (e) {
        process.stdout.write(chalk.red('Conclude Failed') + '\n');
        process.stdout.write(e + '\n');
      }
      concludeModule();
    };

    concludeModule();
  }

  /**
   *
   * @return {Object}
   * @memberof ConcludeModule
   */
  getConfig() {
    let config = {modules: []};
    try {
      config = require(this.configPath);
    } catch (e) {
      process.stdout.write(chalk.yellow(`Could not load .aofl.json in ${path.dirname(this.configPath)} a new config file will be generated\n`) + '\n');
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), {encoding: 'utf-8'});
    }
    return config;
  }

  /**
   *
   * @param {*} _modules
   * @param {*} config
   * @return {Array}
   * @memberof ConcludeModule
   */
  getModules(_modules) {
    if (this.all === true) {
      return [].concat(this.config.modules);
    }

    return this.config.modules
      .reduce((curr, item) => {
        if (_modules.indexOf(item.name) > -1) {
          curr.push(item);
        }
        return curr;
      }, []);
  }

  /**
   *
   *
   * @param {*} modulePath
   * @param {*} name
   * @return {Object}
   * @memberof ConcludeModule
   */
  getModulePackage(modulePath, name) {
    const files = glob.sync([path.join(modulePath, '**', 'package.json')]);
    for (let i = 0; i < files.length; i++) {
      try {
        const p = require(path.resolve(files[i]));
        if (p.name === name) {
          return p;
        }
      } catch (e) {}
    }
    return {};
  }

  async checkOtherInstalledPackages(m) {
    const otherModules = [];
    const moduleLocation = 'file:' + this.findModuleLocation(m.name);
    const submodule = 'file:' + m.localPath;

    process.stdout.write(chalk.yellow(`\nChecking installed packages from ${m.localPath}\n`) + '\n');
    const listStr = await Npm.__run(['list', '--depth', '0', '--json', '--parseable', '--link', '--long'], {stdio: 'pipe'});
    const list = JSON.parse(listStr);
    for (const key in list._dependencies) {
      if (!Object.prototype.hasOwnProperty.call(list._dependencies, key)) continue;
      const path = list._dependencies[key];
      if (path === moduleLocation) continue;
      if (path.indexOf(submodule) === 0) {
        otherModules.push(key);
      }
    }

    if (otherModules.length) {
      process.stdout.write(chalk.red(`Uninstall the following modules to continue`) + '\n');
      process.stdout.write(otherModules.join('\n') + '\n\n');
      throw new Error(`Found other packages installed from ${m.localPath}`);
    }
  }

  /**
   *
   * @param {*} name
   * @return {String}
   * @memberof SourceModule
   */
  findModuleLocation(name) {
    const files = glob.sync([path.join('node_modules_sourced', name, '**', 'package.json')]);
    for (let i = 0; i < files.length; i++) {
      try {
        const p = require(path.resolve(files[i]));
        if (p.name === name) {
          return path.relative(this.cwd, path.dirname(files[i]));
        }
      } catch (e) {}
    }
    return '';
  }
}

module.exports = ConcludeModule;
