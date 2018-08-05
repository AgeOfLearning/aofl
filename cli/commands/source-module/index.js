const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const Git = require('../../lib/git');
const Npm = require('../../lib/npm');
const glob = require('glob');
const moduleRefRegex = /(.+)@(.*)/;
/**
 *
 *
 * @class SourceModule
 */
class SourceModule {
  /**
   * Creates an instance of SourceModule.
   * @param {*} modules
   * @param {String} repo
   * @memberof SourceModule
   */
  constructor(modules = [], repo) {
    this.cwd = process.cwd();
    this.configPath = path.resolve(this.cwd, 'aofl.json');
    this.targetPackageJson = require(path.resolve(this.cwd, 'package.json'));
    this.config = this.getConfig();
    this.modules = this.getModules(modules);
    this.repo = modules.length === 1? repo: undefined;
  }

  /**
   *
   *
   * @memberof SourceModule
   */
  async init() {
    let modules = this.modules;
    let sourceFailed = [];
    let gen = function* gen() {
      yield* modules;
    }();

    let addSubmodules = async () => {
      let next = gen.next();
      if (next.done) {
        this.config.modules = this.modules.filter((item) => sourceFailed.indexOf(item.name) === -1);
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), {encoding: 'utf-8'});
        return;
      }

      let m = next.value;
      let inConfig = this.config.modules.some((item) => {
        return item.name === m.name;
      });

      let repo = this.repo || m.repository;
      if (repo && repo !== '' && !inConfig) {
        try {
          let lsRemoteData = await Git.lsRemote(repo, false, false, false, '', false, false, false, '', false, [], {stdio: 'pipe'});
          let fullModulePath = path.join(this.cwd, m.localPath);
          await Git.addSubmodule(m.localPath, repo);
          let ref = Git.filterRef(lsRemoteData, m.ref);
          if (ref.length) {
            await Git.checkout(ref[0][0], {
              cwd: fullModulePath
            });
          } else {
            console.log(chalk.bgYellow.black.underline(`Could not match ref ${m.ref}. Make sure to checkout correct branch/tag in ${m.localPath}`));
          }

          await Npm.removeDependency([m.name], m.type.flag);
          let moduleLocation = this.findModuleLocation(m.name);

          await Npm.installDependency([moduleLocation], m.type.flag);
        } catch (e) {
          sourceFailed.push(m.name);
          console.log(e);
          console.log(chalk.red(`Could not source ${m.name}`));
          if (e.command === 'git' && e.subCommand === 'ls-remote') {
            console.log(chalk.yellow(`Failed to talk to repo [${repo}]`));
            console.log(chalk.yellow(`try`));
            console.log(chalk.yellow(`\t$ aofl source ${m.name} --repo [url]\n`));
          }
        }
      };
      addSubmodules();
    };
    addSubmodules();
  }

  /**
   *
   * @return {Object}
   * @memberof SourceModule
   */
  getConfig() {
    let config = {modules: []};
    try {
      config = require(this.configPath);
    } catch (e) {
      console.log(chalk.yellow(`Could not load aofl.json in ${path.dirname(this.configPath)} a new config file will be generated`));
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), {encoding: 'utf-8'});
    }
    return config;
  }

  /**
   *
   * @param {*} _modules
   * @param {*} config
   * @return {Array}
   * @memberof SourceModule
   */
  getModules(_modules) {
    let modules = [].concat(this.config.modules);
    for (let i = 0; i < _modules.length; i++) {
      let currModule = this.parseModuleName(_modules[i]);
      let packageInfo = this.getModulePagckage(currModule.name);
      let index = modules.findIndex((item) => {
        return item.name === currModule.name;
      });
      if (typeof currModule.ref === 'undefined') {
        currModule.ref = this.cleanPackageVersion(packageInfo.package.version);
      }
      currModule.localPath = path.normalize(path.join('node_modules_sourced', currModule.name));
      let moduleConfig = Object.assign(currModule, packageInfo);
      if (index > -1) {
        modules.splice(index, 1, moduleConfig);
      } else {
        modules.push(Object.assign(currModule, packageInfo));
      }
    }
    return modules;
  }


  /**
   *
   * @param {*} moduleName
   * @return {Oject}
   * @memberof SourceModule
   */
  parseModuleName(moduleName) {
    let matches = moduleRefRegex.exec(moduleName);
    if (matches !== null) {
      return {
        name: matches[1],
        ref: matches[2]
      };
    }
    return {
      name: moduleName
    };
  }


  /**
   *
   * @param {*} name
   * @return {String}
   * @memberof SourceModule
   */
  findModuleLocation(name) {
    let files = glob.sync(path.join('node_modules_sourced', name, '**', 'package.json'));
    for (let i = 0; i < files.length; i++) {
      try {
        let p = require(path.resolve(files[i]));
        if (p.name === name) {
          return path.relative(this.cwd, path.dirname(files[i]));
        }
      } catch (e) {}
    }
    return '';
  }

  /**
   *
   *
   * @param {*} version
   * @return {String}
   * @memberof SourceModule
   */
  cleanPackageVersion(version) {
    let regex = /^\D?([^\*\n~^]+)$/;
    let matches = regex.exec(version);
    if (matches && matches.length > 1) {
      return matches[1];
    }
    return '';
  }

  /**
   *
   *
   * @param {*} data
   * @return {String}
   * @memberof SourceModule
   */
  getRepoFromPackage(data) {
    let repoRegex = /(.*)\/tree\//;
    let url = '';
    if (typeof data === 'object' && typeof data.url === 'string') {
      url = data.url;
    } else if (typeof data === 'string') {
      url = data;
    }
    let matches = repoRegex.exec(url);
    if (matches && matches.length > 1) {
      url = matches[1];
    }
    return url;
  }

  /**
   *
   *
   * @param {*} moduleName
   * @return {Object}
   * @memberof SourceModule
   */
  getModulePagckage(moduleName) {
    let deps = [{
        name: 'devDependencies',
        flag: '-D'
      }, {
        name: 'dependencies',
        flag: '-S'
      }
    ];
    for (let i = 0; i < deps.length; i++) {
      if (typeof this.targetPackageJson[deps[i].name] !== 'undefined' &&
      typeof this.targetPackageJson[deps[i].name][moduleName] !== 'undefined') {
        try {
          let modulePackagePath = path.resolve(this.cwd, 'node_modules', ...moduleName.split('/'), 'package.json');
          fs.statSync(modulePackagePath);
          let packageConfig = require(modulePackagePath);
          let repository = this.getRepoFromPackage(packageConfig.repository);
          return {
            type: deps[i],
            repository,
            path: path.dirname(modulePackagePath),
            package: packageConfig
          };
        } catch (e) {
          console.log(e);
        }
      }
    }
    return {};
  }
}

module.exports = SourceModule;
