const fs = require('fs');
const glob = require('glob');
const exec = require('child_process').exec;
const path = require('path');

/**
 * Constructs POT files from `__(s)` translation strings
 * @class POTGenerator
 */
class POTGenerator {
  /**
   *
   * @param {Array} args
   */
  constructor(args, repo) {
    console.log('args', args);
  }

  /**
   * @param {String} root
   * @param {Array} files
   * @return {String|Boolean}
   */
  generate(root, files) {
    const trRegex = /(?:\d+:|many:|__\()\s?([`'"])((?:\\\1|\s|.)*?)\1/g;
    const header = `
# i18n {${root}}
msgid ""
msgstr ""

Content-Type: "text/plain; charset=UTF-8"
Content-Transfer-Encoding: "8bit"
Project-Id-Version: ""`;

    let poFile = header + '\n\n';
    let foundMatches = false;
    let result;

    for (let i = 0; i < files.length; i++) {
      let stat = fs.statSync(files[i]);
      if (stat.isFile()) {
        let file = fs.readFileSync(files[i]);
        let matches = [];
        while (result = trRegex.exec(file.toString())) {
          console.log('result: ', result);
          matches.push(result[2]);
        }
        if (matches.length) {
          foundMatches = true;
          poFile += '#: ' + files[i] + '\n';
          for (let i = 0; i < matches.length; i++) {
            poFile += 'msgid "' + matches[i] + '"\n';
            poFile += 'msgstr ""\n\n';
          }
        }
      }
    }
    return foundMatches ? poFile : false;
  }

  /**
   * Returns a parent dir path which contains given file
   * @param {String} filename
   * @param {String} levels
   * @return {String}
   */
  findPathWithFile(filename, levels = './') {
    const abspath = path.join(__dirname, levels, filename);
    if (fs.existsSync(abspath)) {
      return path.join(__dirname, levels);
    } else if (abspath === '/' + filename) {
      // reached root of filesystem without a match
      return false;
    } else {
      return this.findPathWithFile(filename, (levels === './' ? '../' : levels) + '../');
    }
  }

  /**
   * Utility function to sort DESC string arrays
   * @param {String} a
   * @param {String} b
   * @return {Array}
   */
  sortByLength(a, b) {
    return a.length < b.length;
  }

  /**
   * Initiates generator
   * @param {String} root
   * @return {void}
   */
  init(root = null) {
    if (root === null) {
      // Auto detect root
      root = this.findPathWithFile('aofl.json') || '.';
    }
    // Remove trailing '/'
    if (root[root.length-1] === '/') {
      root = root.substring(0, root.length - 1);
    }
    exec('find ' + root + ' -iname i18n', (err, stdout, stderr) => {
      if (err) console.error(stderr);
      const files = stdout.split('\n');
      let languageRoot = '';
      let langDir = '';
      let ignorePatterns = [];
      let poFile = '';
      files.sort(this.sortByLength);
      for (let i = 0; i < files.length; i++) {
        langDir = files[i];
        languageRoot = files[i].replace('/i18n', '');
        if (languageRoot) {
          console.log('Processing translation for directory: ' + languageRoot);
          let subfiles = glob.sync(languageRoot + '/**/*', {
            ignore: ignorePatterns
          });
          poFile = this.generate(languageRoot, subfiles);
          if (poFile !== false) {
            fs.writeFileSync(langDir + '/translations.pot', poFile);
            console.log('Writing POT file to: "' + langDir + '/translations.pot' + '" \n');
          } else {
            console.log('No translations found in ' + languageRoot + '\n');
          }
          ignorePatterns.push(...subfiles);
        }
      }
    });
  }
}

module.exports = POTGenerator;
