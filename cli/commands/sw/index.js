const glob = require('fast-glob').glob;
const path = require('path');
const PathHelper = require('../../lib/path-helper');
const fs = require('fs');
const chalk = require('chalk');
const excludePattrens = [
  '**/node_modules/**',
  '**/bower_components/**',
  '**/*.html',
  '**/*.php'
];

const REPLACE_STR = '__placeholder__';

let replaceRegexs = [
  {
    pattern: new RegExp('__assets' + REPLACE_STR, 'g'),
    replace: (val) => val
  },
  {
    pattern: new RegExp('__version' + REPLACE_STR, 'g'),
    replace: (val) => Date.now()
  }
];
/**
 *
 */
class Sw {
  /**
   *
   * @param {Array} paths list of paths
   * @param {Array} exclude list of exclude paths
   * @param {Array} excludePattern list of exclude patterns
   */
  constructor(paths, exclude, excludePattern) {
    this._setPaths(paths);
    this.exclude = PathHelper
      .convertToGlobPattern(exclude)
      .concat(excludePattrens)
      .concat(excludePattern);
    this.directories = null;
  }

  /**
   * @private
   *
   * @param {Array} _paths list of paths
   */
  _setPaths(_paths) {
    let paths = _paths;
    if (paths.length === 0) {
      paths = [process.env.PWD];
    }

    this.paths = PathHelper.convertToGlobPattern(paths, '__build/**/*');
  }


  /**
   *
   *
   * @return {Promise}
   * @memberof Sw
   */
  getFilePaths() {
    return new Promise((resolve) => {
      glob(this.paths, {
        ignore: this.exclude,
        nodir: true
      }, (err, files) => {
        this.files = files.map((item) => {
          return '\'' + item.replace(process.env.PWD, '') + '\'';
        });
        resolve(this.files);
      });
    });
  }

  /**
   *
   *
   * @memberof Sw
   */
  generate() {
    let templateFile = path.join(__dirname, 'template', 'sw.js');
    let filename = 'sw.js';
    fs.readFile(templateFile, 'utf8', (err, data) => {
      if (err) {
        console.log(chalk.red(err));
        return;
      }

      let content = replaceRegexs.reduce((acc, item) => {
        let out = acc.replace(item.pattern, item.replace(String(this.files)));
        return out;
      }, data);

      fs.writeFile(path.join(process.env.PWD, filename), content, 'utf8', (err) => {
        if (err) console.log(chalk.red(err));
        console.log(chalk.green('success :)'));
      });
    });
  }

  /**
   *
   *
   * @memberof Sw
   */
  init() {
    this.getFilePaths()
    .then(() => {
      this.generate();
    });
  }
};

module.exports = Sw;
