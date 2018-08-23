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
.command('sw [path]', 'generate service worker')
.command('i18n <moduleName>', 'Generates .pot files from source');

program
.parse(process.argv);
