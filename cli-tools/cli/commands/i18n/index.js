/*eslint-disable*/
/** @todo: fix linting */
const glob = require('fast-glob');
const pathHelper = require('../../lib/path-helper');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const getTranslationCalls = require('../../lib/get-translation-calls');

const outputFilename = 'translations.json';
const REPLACE_REGEX = /%r(\d+)%/g;
const CONDITIONAL_REPLACE_REGEX = /%c(\d+)%/g;

class I18N {
  constructor(includePath = process.env.PWD, pattern, exclude, excludePattern) {
    this.includePath = includePath;
    this.includePatterns = pattern;

    this.excludePathsGlobPatterns = pathHelper
      .convertToGlobPattern(exclude)
      .concat(excludePattern);

    this.i18nCalls = {};
  }

  getDirectories(dir = process.env.PWD) {
    return glob.sync(['**/i18n'], {
      cwd: dir,
      onlyFiles: false,
      ignore: this.excludePathsGlobPatterns
    });
  }

  validateManifest(manifest) {
    const keys = [];
    for (let dir in manifest) {
      for (let key in manifest[dir]) {
        if (keys.indexOf(key) === -1) {
          keys.push(key);
        } else {
          throw new Error(`Duplicate key ${key} found in ${dir}`);
        }
      }
    }
  }

  prepare__(callObj) {
    const output = {
      text: callObj.params[1]
    };

    if (callObj.params.length > 2) {
      output.notes = callObj.params[2];
    }

    if (callObj.params.length > 3) {
      output.limit = callObj.params[3];
    }

    return output;
  }

  prepare_c(callObj) {
    const result = [];
    const keyAcc = [];

    const generateCombinations = (arr, carry = [], index = 0, keyCarry = []) => {
      const nextIndex = (index * 2) + 1;
      if (arr.length % 2 === 0 && nextIndex === arr.length - 1) {
        return;
      }

      for (let key in arr[nextIndex]) {
        const copy = [...carry];
        const keyCopy = [...keyCarry];
        copy.push(arr[nextIndex][key]);
        keyCopy.push(key);

        if (index === (Math.floor(arr.length /2) - 1)) {
          result.push(copy);
          keyAcc.push(keyCopy);
        } else {
          generateCombinations(arr, copy, index + 1, keyCopy);
        }
      }
   };

    if (callObj.params.length % 2 === 0) {
      generateCombinations(callObj.params.slice(1));
    } else {
      generateCombinations(callObj.params.slice(1, callObj.params.length - 1));
    }

    let str = callObj.params[1];
    const output = {};
    for (let i = 0; i < keyAcc.length; i++) {
      let matches = null;
      let pivot = 0;
      let out = '';

      do {
        matches = CONDITIONAL_REPLACE_REGEX.exec(str);

        if (matches !== null) {
          const match = matches[0];
          const offset = match.length;
          const paramIndex = matches[1] - 1;

          out += str.slice(pivot, matches.index) + result[i][paramIndex];
          pivot = matches.index + offset;
        }
      } while(matches !== null);

      out += str.slice(pivot);
      output[keyAcc[i].join('^^')] = out;
    }

    return output;
  }

  prepare_r(callObj) {
    let matches = null;
    let pivot = 0;
    let out = '';
    let str = callObj.params[0];

    do {
      matches = REPLACE_REGEX.exec(str);
      if (matches !== null) {
        const match = matches[0];
        const paramIndex = Number(matches[1]);
        const offset = match.length;

        out += str.slice(pivot, matches.index) + '%%r' + paramIndex + '::' + callObj.params[paramIndex] + '%%';

        pivot = matches.index + offset;
      }
    } while (matches !== null);

    out += str.slice(pivot);
    return out;
  }

  generateJSON(manifest) {
    for (let dir in manifest) {
      const i18nDir = path.dirname(path.resolve(dir));
      const outputFile = path.join(i18nDir, outputFilename);
      const translationSource = manifest[dir];
      const output = {};
      const processed = [];

      for (let key in translationSource) {
        if (!translationSource.hasOwnProperty(key) || processed.indexOf(key) > -1) continue;
        const call = translationSource[key];
        processed.push(key);

        if (call.method === '__') {
          output[key] = this.prepare__(call);
        } else if (call.method === '_c') {
          const cominations = this.prepare_c(call);
          for (let cKey in cominations) {
            if (!cominations.hasOwnProperty(cKey)) continue;
            const cCall = {
              text: cominations[cKey]
            };

            if (call.params.length % 2 === 0) {
              cCall.notes = call.params[call.params.length - 1];
            }
            output[key + '-' + cKey] = cCall;
          }
        } else if (call.method === '_r') {
          if (typeof call.params[0] === 'object' && typeof call.params[0].target === 'string') {
            const targetKey = call.params[0].target;
            const targets = Object.keys(output).reduce((acc, item) => {
              if (item.indexOf(targetKey) === 0) {
                acc[item] = output[item];
              }
              return acc;
            }, {});

            for (let tKey in targets) {
              if (!targets.hasOwnProperty(tKey)) continue;
              let t = targets[tKey];
              call.params[0] = t.text;
              const processedR = this.prepare_r(call);
              output[tKey].text = processedR;
            }

          }
          const targetKey = call.params[0].target;
        }
      }

      fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), {encoding: 'utf-8'});
    }
  }

  init() {
    const dirs = this.getDirectories(this.includePath);

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      this.i18nCalls[path.join(dir, outputFilename)] = getTranslationCalls(dir, this.includePatterns, this.excludePathsGlobPatterns);
    }

    this.validateManifest(this.i18nCalls);


    const manifestPath = path.join(path.resolve(this.includePath), 'i18n-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(this.i18nCalls, null, 2), {encoding: 'utf-8'});
    console.log(chalk.green('18n-manifest.json generated successfuly :)'));
    this.generateJSON(this.i18nCalls);
    console.log(chalk.green('Translation files generated :)'));
  }
}

module.exports = I18N;