#!/usr/bin/env node
const chalk = require('chalk');
const {CommanderHelper} = require('@aofl/cli-lib');
const RunTest = require('../command/run-test');
const program = require('commander');

program
  .option('-w, --watch', 'Watches for filesystem changes.')
  .option('--suite [suiteName]', 'Run specific test suites, i.e. --suite login', CommanderHelper.collect, [])
  .option('--spec [path]', 'Run specific test spec files', CommanderHelper.collect, [])
  .option('--debug', 'Sets logging to verbose globally')
  .option('--config [path]', 'Specify the path to the config file.')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aoflwdio help
    aoflwdio run-test --suite login
    aoflwdio run-test
`);
  })
  .parse(process.argv);

const runTest = new RunTest(program.config, program.watch, program.suite, program.spec, program.debug);
runTest.init();
