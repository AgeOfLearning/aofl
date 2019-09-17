const chalk = require('chalk');
const {Git, Npm} = require('@aofl/cli-lib');
const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');
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
  init() {
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
        let version = '';
        if (this.revert) {
          version = '@' + m.package.version;
        } else {
          const updatedPackage = this.getModulePackage(m.localPath, m.name);
          if (typeof updatedPackage.version !== 'undefined') {
            version = '@' + updatedPackage.version;
          }
        }
        await Npm.removeDependency([m.name], m.type.flag, true);
        await Git.removeSubmodule(m.localPath);
        await Npm.installDependency([m.name + version], m.type.flag, true);
        const index = this.config.modules.findIndex((item) => item.name === m.name);
        this.config.modules.splice(index, 1);
      } catch (e) {
        process.stdout.write('caught' + '\n');
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
      process.stdout.write(chalk.yellow(`Could not load .aofl.json in ${path.dirname(this.configPath)} a new config file will be generated`) + '\n');
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
}

module.exports = ConcludeModule;
