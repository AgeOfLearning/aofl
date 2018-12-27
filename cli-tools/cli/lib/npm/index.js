const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
/**
 *
 *
 * @class Npm
 */
class Npm {
  /**
   *
   *
   * @static
   * @param {Array} params
   * @param {Object} [options={}]
   * @return {Promise}
   * @memberof Npm
   */
  static __run(params = [], options = {}) {
    return new Promise((resolve, reject) => {
      if (typeof options.stdio === 'undefined' || options.stdio === 'inherit') {
        console.log(chalk.cyan(`running... npm ${params.join(' ')}\n`));
      }
      let res = '';
      let optionsData = {
        stdio: 'inherit',
        shell: process.platform === "win32" ? true : false,
      }
      const npm = spawn('npm', params, Object.assign(optionsData, options));

      if (npm.stdout !== null) {
        npm.stdout.on('data', (data) => {
          res += data;
        });
      }

      npm.on('close', (code) => {
        if (code === 0) {
          resolve(res);
        } else {
          reject({
            code,
            command: 'npm',
            subCommand: params[0]
          });
        }
      });
    });
  }


  /**
   *
   * @static
   * @param {*} dir
   * @return {String}
   * @memberof Npm
   */
  static findPackageDir(dir) {
    let tempDir = '';
    while (tempDir !== dir) {
      let packageFile = path.join(dir, 'package.json');
      try {
        fs.statSync(packageFile);
        return dir;
      } catch (e) {}

      tempDir = dir;
      dir = path.dirname(dir);
    }

    return '';
  }

  /**
   *
   * @static
   * @param {*} moduleNames
   * @param {string} [type='-D']
   * @param {Boolean} force
   * @param {*} [options={}]
   * @return {Promise}
   * @memberof Npm
   */
  static installDependency(moduleNames, type = '-D', force = false, options = {}) {
    if (!Array.isArray(moduleNames) && moduleNames.length === 0) {
      return Promise.reject(new Error('you need to pass modules to installDependency'));
    }
    return Npm.__run(['i', type, ...moduleNames], options);
  }

  /**
   *
   * @static
   * @param {*} moduleNames
   * @param {string} [type='-D']
   * @param {Boolean} force
   * @param {*} [options={}]
   * @return {Promise}
   * @memberof Npm
   */
  static removeDependency(moduleNames, type = '-D', force = false, options = {}) {
    if (!Array.isArray(moduleNames) && moduleNames.length === 0) {
      return Promise.reject(new Error('you need to pass modules to removeDependency'));
    }
    const params = ['r', type, ...moduleNames];
    if (force) {
      params.push('-f');
    }
    return Npm.__run(params, options);
  }


  /**
   *
   * @static
   * @param {Object} [options={}]
   * @return {Promise}
   * @memberof Npm
   */
  static install(options = {}) {
    let packageDir = Npm.findPackageDir(options.cwd || process.env.PWD);
    let installType = 'i';
    if (packageDir !== '') {
      try {
        fs.statSync(path.join(packageDir, 'package-lock.json'));
        installType = 'ci';
      } catch (e) {}
    }
    return Npm.__run([installType], options);
  }

  /**
   *
   *
   * @static
   * @param {string} [packageName='']
   * @param {Boolean} [global='']
   * @param {string} [depth='']
   * @param {string} [parseable='']
   * @param {string} [json='']
   * @param {*} [options={}]
   * @return {Promise}
   */
  static list(packageName = '', global = false, depth = '', parseable = false, json = false, options = {}) {
    const params = ['list'];
    if (packageName !== '') {
      params.push(packageName);
    }

    if (global) {
      params.push('-g');
    }

    if (depth !== '') {
      params.push('--depth', depth);
    }

    if (parseable) {
      params.push('--parseable');
    }

    if (json) {
      params.push('--json');
    }

    return Npm.__run(params, options);
  }
}

module.exports = Npm;
