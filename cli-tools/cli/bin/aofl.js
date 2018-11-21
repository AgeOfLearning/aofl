#!/usr/bin/env node

const version = require('../package.json').version;
const chalk = require('chalk');
const program = require('commander');

program
.version(chalk.green(version))
.on('--help', () => {
  console.log(`
  Examples:

    aofl --help
    aofl source
`);
})
.command('init <path>', 'Initializes an aofl project')
.command('source <moduleName>', 'Download an npm module into your project')
.command('conclude <moduleName>', 'conclude module')
.command('g [type] [name]', 'scoffold component')
.command('i18n <path>', 'Generates translation.json based on provided pattern and scoped by the presence of an i18n directory anywhere in the project.')
.command('dom-scope [path]', 'validate generated dom-scope');

program
.parse(process.argv);
