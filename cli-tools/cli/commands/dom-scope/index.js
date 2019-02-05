const glob = require('fast-glob');
const PathHelper = require('../../lib/path-helper');
const fs = require('fs');
const chalk = require('chalk');
const Table = require('cli-table');
const path = require('path');

const excludePatterns = [
  '**/node_modules/**',
  '**/bower_components/**',
  '**/*.php'
];

const domScopeRegex = /dom-scope="(.*?)"/gm;


/**
 *
 *
 * @class DomScope
 */
class DomScope {
  /**
   *Creates an instance of DomScope.
   * @param {*} paths
   * @param {*} pattern
   * @param {*} exclude
   * @param {*} excludePattern
   */
  constructor(paths, pattern = [], exclude, excludePattern) {
    this.inputPatterns = pattern;
    if (pattern.length === 0) {
      this.inputPatterns = ['**/*'];
    }

    this.createGlobPatterns(paths);
    this.exclude = PathHelper
      .convertToGlobPattern(exclude)
      .concat(excludePatterns)
      .concat(excludePattern);

    this.directories = null;
    this.domScopes = {};
  }

  /**
   *
   * @param {*} paths
   */
  createGlobPatterns(paths) {
    if (paths.length === 0) {
      paths = [process.env.PWD];
    }

    this.globPatterns = [];

    for (let i = 0; i < this.inputPatterns.length; i++) {
      for (let j = 0; j < paths.length; j++) {
        this.globPatterns.push(path.resolve(path.join(paths[j], this.inputPatterns[i])));
      }
    }
  }

  /**
   * @return {Promise}
   */
  getFilePaths() {
    return glob(this.globPatterns, {
      ignore: this.exclude,
      nodir: true
    })
      .then((files) => {
        this.files = files;
        return files;
      })
      .catch((err) => {
        process.stdout.write(chalk.red(err) + '\n');
        process.exit(err.errno);
      });
  }

  /**
   * @return {Promise}
   */
  validateDomScopes() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.files.length; i++) {
        const content = fs.readFileSync(this.files[i], {encoding: 'utf-8'});
        let match = domScopeRegex.exec(content);
        while (match) {
          const ds = match[1];
          if (typeof this.domScopes[ds] !== 'undefined') {
            this.domScopes[ds].push(this.files[i]);
          } else {
            this.domScopes[ds] = [this.files[i]];
          }

          match = domScopeRegex.exec(content);
        }
      }
      resolve(this.domScopes);
    });
  }

  /**
   *
   *
   * @memberof DomScope
   */
  async init() {
    try {
      await this.getFilePaths();
      await this.validateDomScopes();
      const table = new Table({
        head: ['dom-scope id', 'paths']
      });
      let duplicatesFound = false;

      for (const key in this.domScopes) {
        if (!this.domScopes.hasOwnProperty(key)) continue;
        if (this.domScopes[key].length > 1) {
          table.push([key, this.domScopes[key].join('\n')]);
          duplicatesFound = true;
        }
      }

      if (duplicatesFound) {
        process.stdout.write(chalk.red('Duplicates dom-scope ids were found') + '\n');
        process.stdout.write(table.toString() + '\n');
      } else {
        process.stdout.write(chalk.green('No duplicates found :)') + '\n');
      }
    } catch (e) {
      process.stdout.write(e + '\n');
    }
  }
}

module.exports = DomScope;
