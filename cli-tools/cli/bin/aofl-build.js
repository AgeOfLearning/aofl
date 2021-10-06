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
  .option('--reporter [reporter]', 'Specify a reporter [fancy, basic]')
  .option('--analyze', 'Enable webpack bundle analyzer')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help build
    aofl build
    NODE_ENV=production aofl build ${chalk.dim('## Will run in production mode.')}
`);
  })
  .action(() => {
    const options = program.opts();
    const buildProject = new BuildProject(options.config, options.watch, options.stats, options.profile,
      options.debug, options.reporter, options.analyze);
    buildProject.init();
  })
  .parse(process.argv);

