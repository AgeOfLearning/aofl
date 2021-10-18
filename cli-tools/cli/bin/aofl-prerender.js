#!/usr/bin/env node
const Prerender = require('../commands/prerender');
const program = require('commander');

program
  .option('--config [path]', 'Specify the path to the config file.')
  .option('-p, --port [port]', 'Specify port number. Defaults to 3000.')
  .option('-s, --schema [schema]', 'Specify url schema. Defaults to http.')
  .option('-h, --host [host]', 'Specify host. Defaults to localhost.')
  .option('--external', 'Enable this if you want to use your own server.')
  .option('-t, --timeout', 'How long to wait before processing the page. Defaults to zero')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help prerender
    aofl prerender
`);
  })
  .action(() => {
    const options = program.opts();
    const settings = {
      port: options.port || 3000,
      schema: options.schema || 'http',
      host: options.host || 'localhost',
      external: options.external,
      timeout: options.timeout || 0,
    };
    const prerender = new Prerender(options.config, settings);
    prerender.init();
  })
  .parse(process.argv);

