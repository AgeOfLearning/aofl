const chalk = require('chalk');
const {Git, Npm} = require('@aofl/cli-lib');
const path = require('path');
const fs = require('fs');
const {repos} = require('./js/repo-enumerate');
const os = require('os');
const {v4} = require('uuid');
const glob = require('fast-glob');
const rimraf = require('rimraf');

/**
 *
 *
 */
class InitProject {
  /**
   * Creates an instance of InitProject.
   *
   * @param {String} target
   * @param {String} base
   * @param {String} ref
   * @param {String} repo
   * @memberof InitProject
   */
  constructor(target = '.', base = 'default', ref, repo) {
    this.target = path.resolve(target);
    this.repo = repos[base];

    if (typeof repo !== 'undefined') {
      this.repo = {
        url: repo,
        ref: 'master'
      };
    }

    if (typeof ref !== 'undefined') {
      this.repo.ref = ref;
    }

    this.cloneDir = path.resolve(os.tmpdir(), v4());
  }

  static removeExcludedFromFiles(files = []) {
    return files.filter((item) => ['.git', 'README.md'].indexOf(item) === -1);
  }

  /**
   *
   *
   * @return {Promise}
   * @memberof InitProject
   */
  cloneRepo() {
    return Git.clone(this.repo.url, this.cloneDir, this.repo.ref);
  }

  emptyDir(target) {
    fs.mkdirSync(target, {recursive: true});
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
          const files = InitProject.removeExcludedFromFiles(_files);
          if (files && files.length) {
            return reject(chalk.red(`fatal: destination path ${this.target} already exists and is not an empty directory.
            `));
          }
          return resolve();
        });
      });

      this.emptyDir(this.target);
      rimraf.sync(this.cloneDir);
      await this.cloneRepo();

      const files = glob.sync('**/*', {
        ignore: ['.git', 'package-lock.json'],
        dot: true,
        cwd: this.cloneDir
      });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const target = path.join(this.target, file);
        fs.mkdirSync(path.dirname(target), {recursive: true});
        fs.copyFileSync(path.join(this.cloneDir, file), target);
      }
      await Npm.install({cwd: this.target});
      process.stdout.write(chalk.green(`
Success :)

  cd ${this.target} && npm start
`));
    } catch (e) {
      process.stdout.write(e + '\n');
    } finally {
      await rimraf.sync(this.cloneDir);
    }
  }
}

module.exports = InitProject;
