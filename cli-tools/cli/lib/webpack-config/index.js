const path = require('path');
const {validate} = require('schema-utils');
const schema = require('./schema.json');
const generator = require('./generator');
const defaults = require('./defaults');
const {defaultsDeep} = require('@aofl/cli-lib');
const esm = require('esm');

const loadConfig = (configPath) => {
  const absConfigPath = path.resolve(configPath);
  const aoflConfig = esm(module)(absConfigPath);


  const root = aoflConfig.root || path.dirname(configPath);
  const defs = defaults(root);
  const config = defaultsDeep(aoflConfig, defs);

  validate(schema, config, {name: 'AofL JS'});

  return {
    ...config,
    webpack: generator(root, config, defs)
  };
};

module.exports = {
  loadConfig
};
