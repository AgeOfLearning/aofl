const glob = require('fast-glob');
const {PathHelper, getTranslationCalls} = require('@aofl/cli-lib');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const outputFilename = 'translations.json';
const REPLACE_REGEX = /%r(\d+)%/g;
const CONDITIONAL_REPLACE_REGEX = /%c(\d+)%/g;
const KEY_TEST = /_[rs]-\d+/;

class I18N {
  constructor(includePath = process.env.PWD, pattern, exclude, excludePattern) {
    this.includePath = includePath;
    this.includePatterns = pattern;

    this.excludePathsGlobPatterns = PathHelper
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
    for (const dir in manifest) {
      if (!Object.hasOwnProperty.call(manifest, dir)) continue;
      for (const key in manifest[dir]) {
        if (KEY_TEST.test(key)) continue;
        if (keys.indexOf(key) === -1) {
          keys.push(key);
        } else {
          process.stdout.write(`${key} found in ${dir}` + '\n');
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

  prepareC(callObj) {
    const result = [];
    const keyAcc = [];

    const generateCombinations = (arr, carry = [], index = 0, keyCarry = []) => {
      const nextIndex = (index * 2) + 1;
      if (arr.length % 2 === 0 && nextIndex === arr.length - 1) {
        return;
      }

      for (const key in arr[nextIndex]) {
        if (!Object.hasOwnProperty.call(arr[nextIndex], key)) continue;
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

    const str = callObj.params[1];
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
      } while (matches !== null);

      out += str.slice(pivot);
      output[keyAcc[i].join('^^')] = out;
    }

    return output;
  }

  prepareR(callObj) {
    let matches = null;
    let pivot = 0;
    let out = '';
    const str = callObj.params[0];

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
    for (const dir in manifest) {
      if (!Object.hasOwnProperty.call(manifest, dir)) continue;
      const i18nDir = path.dirname(path.resolve(dir));
      const outputFile = path.join(i18nDir, outputFilename);
      const translationSource = manifest[dir];
      const output = {};
      const processed = [];

      for (const key in translationSource) {
        if (!Object.hasOwnProperty.call(translationSource, key) || processed.indexOf(key) > -1) continue;
        const call = translationSource[key];
        processed.push(key);

        if (call.method === '__') {
          output[key] = this.prepare__(call);
        } else if (call.method === '_c') {
          const combinations = this.prepareC(call);
          for (const cKey in combinations) {
            if (!Object.hasOwnProperty.call(combinations, cKey)) continue;
            const cCall = {
              text: combinations[cKey]
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

            for (const tKey in targets) {
              if (!Object.hasOwnProperty.call(targets, tKey)) continue; // eslint-disable-line
              const t = targets[tKey];
              call.params[0] = t.text;
              const processedR = this.prepareR(call);
              output[tKey].text = processedR;
            }
          }
        }
      }

      fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), {encoding: 'utf-8'});
    }
  }

  init() {
    const dirs = this.getDirectories(this.includePath);

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      this.i18nCalls[path.join(dir, outputFilename)] = getTranslationCalls(
        dir, this.includePatterns, this.excludePathsGlobPatterns);
    }

    this.validateManifest(this.i18nCalls);


    const manifestPath = path.join(path.resolve(this.includePath), 'i18n-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(this.i18nCalls, null, 2), {encoding: 'utf-8'});
    process.stdout.write(chalk.green('18n-manifest.json generated successfully :)') + '\n');
    this.generateJSON(this.i18nCalls);
    process.stdout.write(chalk.green('Translation files generated :)') + '\n');
  }
}

module.exports = I18N;
