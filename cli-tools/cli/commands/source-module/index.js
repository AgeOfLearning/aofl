const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const {Git, Npm} = require('@aofl/cli-lib');
const glob = require('fast-glob');
const {exitOnUncommittedChanges} = require('../../lib/uncommitted-changes');

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
   * @param {Boolean} list
   * @memberof SourceModule
   */
  constructor(modules = [], repo, list) {
    this.cwd = process.cwd();
    this.configPath = path.resolve(this.cwd, '.aofl.json');
    this.targetPackageJson = require(path.resolve(this.cwd, 'package.json'));
    this.config = this.getConfig();
    this.modules = this.getModules(modules);
    this.repo = modules.length === 1? repo: void 0;
    this.list = list;
  }

  /**
   *
   *
   * @memberof SourceModule
   */
  async init() {
    await exitOnUncommittedChanges();
    if (this.list) {
      this.listModules();
      return;
    }
    const modules = this.modules;
    const sourceFailed = [];
    const gen = function* gen() {
      yield* modules;
    }();

    const addSubmodules = async () => {
      const next = gen.next();
      if (next.done) {
        this.config.modules = this.modules.filter((item) => sourceFailed.indexOf(item.name) === -1);
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), {encoding: 'utf-8'});
        return;
      }

      const m = next.value;
      const inConfig = this.config.modules.some((item) => {
        return item.name === m.name;
      });

      const repo = this.repo || m.repository;
      if (repo && repo !== '' && !inConfig) {
        try {
          const lsRemoteData = await Git.lsRemote(repo, false, false, false, '', false, false, false, '', false, [], {stdio: 'pipe'});
          const fullModulePath = path.join(this.cwd, m.localPath);
          process.stdout.write(chalk.yellow(`\nExporting ${m.name} as a local submodule ${m.localPath}\n`) + '\n');
          await Git.addSubmodule(m.localPath, repo);
          const ref = Git.filterRef(lsRemoteData, m.ref);
          if (ref.length) {
            process.stdout.write(chalk.yellow(`\nChecking out ${ref[0][0]} in ${m.localPath}...\n`) + '\n');
            await Git.checkout(ref[0][0], {
              cwd: fullModulePath
            });

            // await Npm.removeDependency([m.name], m.type.flag, true);
            const moduleLocation = this.findModuleLocation(m.name);

            process.stdout.write(chalk.yellow(`\nInstalling ${m.name} from ${moduleLocation}\n`) + '\n');
            await Npm.installDependency([moduleLocation], m.type.flag);
          } else {
            process.stdout.write(chalk.bgYellow.black.underline(`\nCould not match ref ${m.ref}. Make sure to checkout correct branch/tag in ${m.localPath} and install the package from ${m.localPath}`) + '\n');
          }
        } catch (e) {
          sourceFailed.push(m.name);
          process.stdout.write(chalk.red(`Could not source ${m.name}`) + '\n');
          process.stdout.write(e + '\n');
          if (e.command === 'git' && e.subCommand === 'ls-remote') {
            process.stdout.write(chalk.yellow(`\nFailed to talk to repo [${repo}]`) + '\n');
            process.stdout.write(chalk.yellow(`try`) + '\n');
            process.stdout.write(chalk.yellow(`\t$ aofl source ${m.name} --repo [url]\n\n`));
          } else {
            process.stdout.write(chalk.yellow(`\nReverting: Removing submodule ${m.localPath}...`) + '\n');
            await Git.removeSubmodule(m.localPath);
          }
        }
      }
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
   * @memberof SourceModule
   */
  getModules(_modules) {
    const modules = [].concat(this.config.modules);
    for (let i = 0; i < _modules.length; i++) {
      const currModule = this.parseModuleName(_modules[i]);
      const packageInfo = this.getModulePagckage(currModule.name);
      const index = modules.findIndex((item) => {
        return item.name === currModule.name;
      });
      if (typeof currModule.ref === 'undefined') {
        currModule.ref = this.cleanPackageVersion(packageInfo.package.version);
      }
      currModule.localPath = path.normalize(path.join('node_modules_sourced', currModule.name));
      const moduleConfig = Object.assign(currModule, packageInfo);
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
    const matches = moduleRefRegex.exec(moduleName);
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

  /**
   *
   *
   * @param {*} version
   * @return {String}
   * @memberof SourceModule
   */
  cleanPackageVersion(version) {
    const regex = /^\D?([^*\n~^]+)$/;
    const matches = regex.exec(version);
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
    const repoRegex = /(.*)\/tree\//;
    let url = '';
    if (typeof data === 'object' && typeof data.url === 'string') {
      url = data.url;
    } else if (typeof data === 'string') {
      url = data;
    }
    const matches = repoRegex.exec(url);
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
    const deps = [
      {
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
          const modulePackagePath = path.resolve(this.cwd, 'node_modules', ...moduleName.split('/'), 'package.json');
          fs.statSync(modulePackagePath);
          const packageConfig = require(modulePackagePath);
          const repository = this.getRepoFromPackage(packageConfig.repository);
          return {
            type: deps[i],
            repository,
            path: path.dirname(modulePackagePath),
            package: packageConfig
          };
        } catch (e) {
          process.stdout.write(e + '\n');
        }
      }
    }
    return {};
  }

  /**
   * list sourced packages
   */
  listModules() {
    const modules = this.config.modules || [];
    for (let i = 0; i < modules.length; i++) {
      process.stdout.write(modules[i].name + '@' + modules[i].ref + '\n');
    }

    process.stdout.write('\n');
    process.stdout.write(modules.length + ' package(s) sourced' + '\n');
    process.stdout.write('\n');
  }
}

module.exports = SourceModule;
