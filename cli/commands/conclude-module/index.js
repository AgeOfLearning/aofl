const chalk = require('chalk');
const Git = require('../../lib/git');
const Npm = require('../../lib/npm');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
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
    this.configPath = path.resolve(this.cwd, 'aofl-sourced.json');
    this.targetPackageJson = require(path.resolve(this.cwd, 'package.json'));
    this.config = this.getConfig();
    this.modules = this.getModules(modules);
  }

  /**
   *
   *
   * @memberof ConcludeModule
   */
  init() {
    let modules = [].concat(this.modules);
    let gen = function* gen() {
      yield* modules;
    }();

    let concludeModule = async () => {
      let next = gen.next();
      if (next.done) {
        this.config.modules = this.modules;
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), {encoding: 'utf-8'});
        return;
      }
      let m = next.value;
      try {
        let version = '';
        if (this.revert) {
          version = '@' + m.package.version;
        } else {
          let updatedPackage = this.getModulePackage(m.localPath, m.name);
          if (typeof updatedPackage.version !== 'undefined') {
            version = '@' + updatedPackage.version;
          }
        }
        await Npm.removeDependency([m.name], m.type.flag);
        await Git.removeSubmodule(m.localPath);
        await Npm.installDependency([m.name + version], m.type.flag);
        let index = this.modules.findIndex((item) => item.name === m.name);
        this.modules.splice(index, 1);
      } catch (e) {
        console.log('caught');
        console.log(e);
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
      console.log(chalk.yellow(`Could not load aofl-sourced.json in ${path.dirname(this.configPath)} a new config file will be generated`));
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
    let files = glob.sync(path.join(modulePath, '**', 'package.json'));
    console.log();
    for (let i = 0; i < files.length; i++) {
      try {
        let p = require(path.resolve(files[i]));
        if (p.name === name) {
          return p;
        }
      } catch (e) {}
    }
    return {};
  }
}

module.exports = ConcludeModule;
