#!/usr/bin/env node
const SourceModule = require('../commands/source-module');
const program = require('commander');

program
.option('--repo [repo]', 'repo url')
.parse(process.argv);

const sourceModule = new SourceModule(program.args, program.repo);
sourceModule.init();
