const spawn = require('child_process').spawn;
const chalk = require('chalk');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
/**
 *
 *
 * @class Git
 */
class Git {
  /**
   *
   *
   * @static
   * @param {Array} [params=[]]
   * @param {Object} [options={}]
   * @return {Promise}
   * @memberof Git
   */
  static __run(params = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(chalk.cyan(`running... git ${params.join(' ')}\n`));
      let res = '';
      const git = spawn('git', params, Object.assign({stdio: 'inherit'}, options));

      if (git.stdout !== null) {
        git.stdout.on('data', (data) => {
          res += data;
        });
      }

      git.on('close', (code) => {
        if (code === 0) {
          resolve(res);
        } else {
          reject({
            code,
            command: 'git',
            subCommand: params[0]
          });
        }
      });
    });
  }


  /**
   *
   * @static
   * @param {String} dir
   * @return {String}
   * @memberof Git
   */
  static findGitDir(dir) {
    let tempDir = '';
    while (tempDir !== dir) {
      let gitDir = path.join(dir, '.git');
      try {
        fs.statSync(gitDir);
        console.log('gitDir', dir);
        return dir;
      } catch (e) {}

      tempDir = dir;
      dir = path.dirname(dir);
    }

    throw new Error('not a git directory');
  }

  /**
   *
   *
   * @see {@link https://git-scm.com/docs/git-ls-remote.html|git-ls-remote}
   * @static
   * @param {String} repository
   * @param {boolean} [heads=false]
   * @param {boolean} [tags=false]
   * @param {boolean} [refsFlag=false]
   * @param {string} [uploadPack='']
   * @param {boolean} [quiet=false]
   * @param {boolean} [exitCode=false]
   * @param {boolean} [getUrl=false]
   * @param {string} [sort='']
   * @param {boolean} [symref=false]
   * @param {Array} [refs=[]]
   * @param {Object} [options={}]
   * @return {Promise}
   * @memberof Git
   */
  static lsRemote(repository, heads = false, tags = false, refsFlag = false, uploadPack = '',
  quiet = false, exitCode = false, getUrl = false, sort = '', symref = false,
  refs = [], options = {}) {
    let params = ['ls-remote'];
    if (heads) params.push('--heads');
    if (tags) params.push('--tags');
    if (refsFlag) params.push('--refs');
    if (uploadPack && uploadPack !== '') params.push(`--upload-pack=${uploadPack}`);
    if (quiet) params.push('--quiet');
    if (exitCode) params.push('--exitCode');
    if (getUrl) params.push('--get-url');
    if (sort && sort !== '') params.push(`--sort=${sort}`);
    if (symref) params.push('--symref');
    params.push(repository);
    if (refs && refs.length) params.push(...refs);

    return Git.__run(params, options);
  }

  /**
   *
   * @static
   * @param {String} data
   * @param {String} ref
   * @return {Array}
   * @memberof Git
   */
  static filterRef(data, ref) {
    let reg = new RegExp(ref + '$');
    return data.split('\n').reduce((acc, item) => {
      if (reg.test(item)) {
        acc.push(item.split('\t'));
      }
      return acc;
    }, []);
  }


  /**
   *
   *
   * @static
   * @param {String} submodulePath
   * @param {String} url
   * @param {Object} [options={}]
   * @return {Promise}
   * @memberof Git
   */
  static addSubmodule(submodulePath, url, options = {}) {
    return Git.__run(['submodule', 'add', '--', url, submodulePath], {options});
  }


  /**
   *
   *
   * @static
   * @param {String} submodulePath
   * @param {Boolean} force
   * @param {Array} [options={}]
   * @return {Promise}
   * @memberof Git
   */
  static submoduleDeinit(submodulePath, force = false, options = {}) {
    let params = ['submodule', 'deinit'];

    if (force) params.push('-f');
    params.push('--');
    params.push(submodulePath);
    return Git.__run(params, options);
  }


  /**
   *
   * @static
   * @param {*} submodulePath
   * @param {*} [options={}]
   * @memberof Git
   */
  static async removeSubmodule(submodulePath, options = {}) {
    let fullPath = path.resolve(submodulePath);
    let gitDir = Git.findGitDir(process.cwd());
    let relativePath = path.relative(gitDir, fullPath);
    await Git.submoduleDeinit(submodulePath, true, options);
    await Git.rm([submodulePath], false, true);
    await new Promise((resolve, reject) => {
      let rmPath = path.join(gitDir, '.git', 'modules', relativePath);
      console.log(chalk.cyan(`running... rm -r ${rmPath}\n`));
      rimraf(rmPath, (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }


  /**
   *
   * @static
   * @param {*} paths
   * @param {boolean} [recursive=false]
   * @param {boolean} [force=false]
   * @param {boolean} [cached=false]
   * @param {boolean} [ignoreUnmatch=false]
   * @param {boolean} [dryrun=false]
   * @param {boolean} [quiet=false]
   * @param {*} [options={}]
   * @return {Promise}
   * @memberof Git
   */
  static rm(paths, recursive = false, force = false, cached = false, ignoreUnmatch = false,
  dryrun = false, quiet = false, options = {}) {
    let params = ['rm'];
    if (force) params.push('-f');
    if (dryrun) params.push('-n');
    if (recursive) params.push('-r');
    if (cached) params.push('--cached');
    if (ignoreUnmatch) params.push('--ignore-unmatch');
    if (quiet) params.push('--quiet');
    params.push('--');
    params.push(...paths);

    return Git.__run(params, options);
  }

  /**
   *
   *
   * @static
   * @param {String} [ref='master']
   * @param {Object} [options={}]
   * @return {Promise}
   * @memberof Git
   */
  static checkout(ref = 'master', options = {}) {
    return Git.__run(['checkout', ref], options);
  }

  /**
   *
   *
   * @static
   * @param {*} repo
   * @param {string} [directory='']
   * @param {*} [options={}]
   * @return {Promise}
   * @memberof Git
   */
  static clone(repo, directory = '', options = {}) {
    return Git.__run(['clone', repo, directory], options);
  }
}

module.exports = Git;
