#!/usr/bin/env node
const chalk = require('chalk');
const ServeProject = require('../commands/serve-project');
const program = require('commander');

program
  .option('-p, --port [port]', 'The port')
  .option('--host [host]', 'The port')
  .option('--stats', '')
  .option('--profile', '')
  .option('--hot', '')
  .option('--hot-only', '')
  .option('--debug', 'Switch loaders to debug mode.')
  .option('--config [path]', 'Specify the path to the config file.')
  .option('--reporter [reporter]', 'Specify a reporter [fancy, basic]')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help build
    aofl build
    NODE_ENV=production aofl build ${chalk.dim('## Will run in production mode.')}
`);
  })
  .parse(process.argv);

const serveProject = new ServeProject(program.config, program.port, program.host,
  program.stats, program.profile, program.debug, program.reporter, program.hot, program.hotOnly);
serveProject.init();
