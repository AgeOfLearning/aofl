#!/usr/bin/env node
const ConcludeModule = require('../commands/conclude-module');
const program = require('commander');

program
  .option('--all', 'conclude all modules')
  .option('-r, --revert', 'Conclude module and install original sourced version')
  .action(() => {
    const options = program.opts();
    const concludeModule = new ConcludeModule(options.args, options.all, options.revert);
    concludeModule.init();
  })
  .parse(process.argv);
