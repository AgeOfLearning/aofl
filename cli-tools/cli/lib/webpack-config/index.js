const path = require('path');
const validateOptions = require('schema-utils');
const schema = require('@aofl/cli-lib/modules/webpack-config/schema.json');
const generator = require('./generator');
const defaults = require('./defaults');
const {defaultsDeep} = require('@aofl/cli-lib');


const loadConfig = (configPath) => {
  const absConfigPath = path.resolve(configPath);
  const aoflConfig = require(absConfigPath);


  const root = aoflConfig.root || path.dirname(configPath);
  const defs = defaults(root);
  const config = defaultsDeep(aoflConfig, defs);

  validateOptions(schema, config, 'AofL JS');

  return {
    ...config,
    webpack: generator(root, config, defs)
  };
};

module.exports = {
  loadConfig
};
