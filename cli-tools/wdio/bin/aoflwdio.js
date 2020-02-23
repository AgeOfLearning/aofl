#!/usr/bin/env node

const version = require('../package.json').version;
const chalk = require('chalk');
const program = require('commander');

program
  .version(chalk.green(version))
  .on('--help', () => {
    process.stdout.write(`
Examples:

aoflwdio --help
aoflwdio run-test
`);
  })
  .command('run-test', 'Runs the WebDriverIO test runner');

program
  .parse(process.argv);
