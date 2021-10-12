#!/usr/bin/env node

const version = require('../package.json').version;
const chalk = require('chalk');
const program = require('commander');

program
  .version(chalk.green(version))
  .on('--help', () => {
    process.stdout.write(`
Examples:

aofl --help
aofl source
`);
  })
  .command('init <path>', 'Initializes an AofL JS project')
  .command('source <moduleName>', 'Download an npm module into your project')
  .command('conclude <moduleName>', 'conclude module')
  .command('g [type] [name]', 'scaffold component')
  .command('i18n <path>', 'Generates translation.json based on provided pattern and scoped by the presence of an i18n directory anywhere in the project.')
  .command('dom-scope [path]', 'validate generated dom-scope')
  .command('build', 'Builds your AofL JS project.')
  .command('test', 'Runs unit tests')
  .command('routes', 'Generates route config file')
  .command('serve', 'Builds and servers your AofL JS project.')
  .command('upgrade <path>', 'Upgrade your AofL JS project to the next version.');

program
  .parse(process.argv);
