#!/usr/bin/env node
const SourceModule = require('../commands/source-module');
const program = require('commander');

program
.option('--repo [repo]', 'repo url')
.parse(process.argv);

let sourceModule = new SourceModule(program.args, program.repo);
sourceModule.init();
