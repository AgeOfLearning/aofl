const chalk = require('chalk');
const Git = require('../../lib/git');
const Npm = require('../../lib/npm');
const path = require('path');
const fs = require('fs-extra');
const {repos} = require('./js/repo-enumerate');
const os = require('os');
const md5 = require('tiny-js-md5');
const glob = require('fast-glob');

/**
 *
 *
 */
class InitProject {
  /**
   * Creates an instance of InitProject.
   *
   * @param {String} target
   * @param {String} repo
   * @param {String} base
   * @memberof InitProject
   */
  constructor(target = '.', repo = repos.default, base) {
    this.target = path.resolve(target);
    this.base = base;
    this.repo = repo;

    if (typeof repos[base] !== 'undefined') {
      this.repo = repos[base];
    }

    this.cloneDir = path.resolve(os.tmpdir(), md5(this.repo));
  }

  static removeGitFromFiles(files) {
    const index = files.indexOf('.git');
    if (index > -1) {
      return [
        ...files.slice(0, index),
        ...files.slice(index + 1)
      ]
    }

    return [...files];
  }

  /**
   *
   *
   * @return {Promise}
   * @memberof InitProject
   */
  cloneRepo() {
    return Git.clone(this.repo, this.cloneDir);
  }

  /**
   *
   *
   * @memberof InitProject
   */
  async init() {
    try {
      await new Promise((resolve, reject) => {
        fs.readdir(this.target, (err, _files) => {
          const files = InitProject.removeGitFromFiles(_files);
          console.log(files);
          if (files && files.length) {
            return reject(chalk.red(`fatal: destination path ${this.target} already exists and is not an empty directory.
            `));
          } else {
            return resolve();
          }
        });
      });
      await fs.emptyDir(this.target);
      await fs.remove(this.cloneDir);
      await fs.ensureDir(this.target);
      await this.cloneRepo();

      const files = glob.sync('**/*', {
        ignore: ['.git', 'package-lock.json'],
        dot: true,
        cwd: this.cloneDir
      });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const target = path.resolve(this.target, file);
        await fs.ensureDir(path.dirname(target));
        await fs.copy(path.resolve(this.cloneDir, file), target);
      }
      await Npm.install({cwd: this.target});
      console.log(chalk.green(`
Success :)

  cd ${this.target} && npm start
      `));
    } catch (e) {
      console.log(e);
    } finally {
      await fs.remove(this.cloneDir);
    }
  }
}

module.exports = InitProject;
