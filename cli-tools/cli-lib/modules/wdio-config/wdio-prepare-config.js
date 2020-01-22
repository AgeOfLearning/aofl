const path = require('path');
const fs = require('fs');
const findCacheDir = require('find-cache-dir');

const CACHE_DIR_NAMESPACE = 'aoflwdio';

class PrepareConfig {
  constructor(configMap, config = '.aoflwdio.js', cacheNamespace = CACHE_DIR_NAMESPACE, debug = false) {
    this.cacheNamespace = cacheNamespace;
    this.userConfigPath = path.resolve(config);
    this.mergeConfigPath = path.join(__dirname, 'wdio-merge-config.js');
    this.userConfig = require(this.userConfigPath).config;
    this.preset = 'default';
    this.debug = debug;
    if (typeof this.userConfig.preset !== 'undefined') {
      this.preset = this.userConfig.preset;
    }
    if (typeof configMap[this.preset] === 'undefined') {
      throw new Error(`Invalid preset (${this.preset}). Valid options: ${Object.keys(configMap).join(', ')}`);
    }
    this.defaultConfigPath = configMap[this.preset];
  }

  generateConfig() {
    const cacheDir = findCacheDir({name: this.cacheNamespace, create: true});
    const outputPath = path.join(cacheDir, 'wdio.config.js');
    const userConfigPath = path.relative(cacheDir, this.userConfigPath);
    const defaultConfigPath = path.relative(cacheDir, this.defaultConfigPath);
    const mergeConfigPath = path.relative(cacheDir, this.mergeConfigPath);

    const content = `const userConfig = require('${userConfigPath}');
const defaultConfig = require('${defaultConfigPath}');
const mergeConfig = require('${mergeConfigPath}');
const config =  mergeConfig.init(defaultConfig.config, userConfig.config, ${this.debug});

${this.debug? 'console.log(config);': ''}
module.exports.config = config;
`;

    fs.writeFileSync(outputPath, content, {encoding: 'utf-8'});
    return outputPath;
  }
}

module.exports.PrepareConfig = PrepareConfig;