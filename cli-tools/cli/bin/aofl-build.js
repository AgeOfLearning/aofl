#!/usr/bin/env node
const chalk = require('chalk');
const BuildProject = require('../commands/build-project');
const program = require('commander');

program
  .option('-w, --watch', 'Watches for filesystem changes.')
  .option('--stats', '')
  .option('--profile', '')
  .option('--debug', 'Switch loaders to debug mode.')
  .option('--config [path]', 'Specify the path to the config file.')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help build
    aofl build
    NODE_ENV=production aofl build ${chalk.dim('## Will run in production mode.')}
`);
  })
  .parse(process.argv);

const buildProject = new BuildProject(program.config, program.watch, program.stats, program.profile,
  program.debug);
buildProject.init();
