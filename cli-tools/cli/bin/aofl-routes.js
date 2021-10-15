#!/usr/bin/env node
const chalk = require('chalk');
const {Routes} = require('../commands/routes');
const program = require('commander');
const {CommanderHelper} = require('@aofl/cli-lib');

program
  .option('-p, --pattern [pattern]', 'list of patterns to search. Wrap patterns in "".', CommanderHelper.collect, [])
  .option('-E, --exclude [patterns]', 'list of patterns to exclude', CommanderHelper.collect, [
    '**/__build/**/*',
    '**/node_modules/**/*'
  ])
  .option('-o, --output [path]', 'path to output file')
  .action(() => {
    const options = program.opts();
    const routes = new Routes(program.args[0], options.pattern, options.exclude, options.output);
    routes.run();
  })
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help build
    aofl build
    NODE_ENV=production aofl build ${chalk.dim('## Will run in production mode.')}
`);
  })
  .parse(process.argv);
