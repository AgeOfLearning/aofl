#!/usr/bin/env node
const Prerender = require('../commands/prerender');
const program = require('commander');

program
  .option('--config [path]', 'Specify the path to the config file.')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help prerender
    aofl prerender
`);
  })
  .action(() => {
    const options = program.opts();
    const prerender = new Prerender(options.config);
    prerender.init();
  })
  .parse(process.argv);

