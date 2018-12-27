#!/usr/bin/env node
const ConcludeModule = require('../commands/conclude-module');
const program = require('commander');

program
.option('--all', 'conclude all modules')
.option('-r, --revert', 'Conclude module and install original sourced version')
.parse(process.argv);

const concludeModule = new ConcludeModule(program.args, program.all, program.revert);
concludeModule.init();
