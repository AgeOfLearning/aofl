const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('fast-glob');
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
      process.stdout.write(chalk.red(`unsupported type: ${type}`) + '\n');
      process.exit(1);
    }

    if (Generate.destExists(this.dest)) {
      process.stdout.write(chalk.red(`target already exsits ${this.dest}`) + '\n');
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
      const stat = fs.statSync(path.join(__dirname, 'templates', type));
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
    const pattern = path.join(__dirname, 'templates', this.type, '**', '*');
    return glob([pattern], {
      nodir: true,
      dot: true
    });
  }

  /**
   * @param {String} files
   */
  generate(files) {
    fs.mkdirSync(this.dest, {recursive: true});
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = path.basename(file).replace(REPLACE_REGEX, this.name)
        .replace(/\.sample$/, '');
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          process.stdout.write(chalk.red(err) + '\n');
          return;
        }

        const content = replaceRegexs.reduce((acc, item) => {
          const out = acc.replace(item.pattern, item.replace(this.name));
          return out;
        }, data);

        fs.writeFile(path.join(this.dest, filename), content, 'utf8', (err) => {
          if (err) { process.stdout.write(chalk.red(err) + '\n'); }
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
        process.stdout.write(chalk.green(`${this.name} created :)`) + '\n');
      })
      .catch((e) => {
        process.stdout.write(e + '\n');
      });
  }
}

module.exports = Generate;
