#!/usr/bin/env node
const SourceModule = require('../commands/source-module');
const program = require('commander');

program
  .option('--repo [repo]', 'repo url')
  .option('-l, --list', 'List sourced modules')
  .action(() => {
    const options = program.opts();

    const sourceModule = new SourceModule(options.args, options.repo, options.list);
    sourceModule.init();
  })
  .parse(process.argv);
