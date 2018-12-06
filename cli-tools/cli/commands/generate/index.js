const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('fast-glob');
const mkdirp = require('mkdirp');
const templateFunctions = require('./js/template-functions');

const REPLACE_STR = '__placeholder__';
const REPLACE_REGEX = new RegExp('__placeholder__', 'g');

const replaceRegexs = [
  {
    pattern: new RegExp('__camelcase' + REPLACE_STR, 'g'),
    replace: (val) => templateFunctions.camelCase(val)
  },
  {
    pattern: new RegExp('__uppercamelcase' + REPLACE_STR, 'g'),
    replace: (val) => templateFunctions.upperCamelCase(val)
  },
  {
    pattern: new RegExp('__adddash' + REPLACE_STR, 'g'),
    replace: (val) => templateFunctions.addDash(val)
  },
  {
    pattern: REPLACE_REGEX,
    replace: (val) => val
  }
];

/**
 *
 */
class Generate {
  /**
   *
   * @param {*} type
   * @param {*} dest
   */
  constructor(type, dest) {
    this.type = type;
    this.dest = path.resolve(dest);

    if (!Generate.supportedType(type)) {
      console.error(chalk.red(`unsupported type: ${type}`));
      process.exit(1);
    }

    if (Generate.destExists(this.dest)) {
      console.error(chalk.red(`target already exsits ${this.dest}`));
      process.exit(1);
    }
  }

  /**
   *
   */
  get name() {
    return path.basename(this.dest);
  }


  /**
   *
   *
   * @static
   * @param {String} type
   * @return {Boolean}
   * @memberof Generate
   */
  static supportedType(type) {
    try {
      let stat = fs.statSync(path.join(__dirname, 'templates', type));
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  }

  /**
   *
   * @static
   * @param {String} dest
   * @return {Boolean}
   * @memberof Generate
   */
  static destExists(dest) {
    try {
      fs.statSync(dest);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   *
   *
   * @return {Array}
   * @memberof Generate
   */
  getTemplateFiles() {
    let pattern = path.join(__dirname, 'templates', this.type, '**', '*');
    return glob([pattern], {
      nodir: true,
      dot: true
    });
  }

  /**
   * @param {String} files
   */
  generate(files) {
    mkdirp.sync(this.dest);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let filename = path.basename(file).replace(REPLACE_REGEX, this.name);
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.log(chalk.red(err));
          return;
        }

        let content = replaceRegexs.reduce((acc, item) => {
          let out = acc.replace(item.pattern, item.replace(this.name));
          return out;
        }, data);

        fs.writeFile(path.join(this.dest, filename), content, 'utf8', (err) => {
          if (err) console.log(chalk.red(err));
        });
      });
    }
  }

  /**
   *
   */
  init() {
    this.getTemplateFiles()
    .then((files) => {
      this.generate(files);
      console.log(chalk.green(`${this.name} created :)`));
    })
    .catch((e) => {
      console.log(e);
    });
  }
}

module.exports = Generate;
