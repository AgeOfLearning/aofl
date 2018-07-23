#!/usr/bin/env node
const SourceModule = require('../commands/source-module');
const program = require('commander');

program
.parse(process.argv);

let sourceModule = new SourceModule(program.args);
sourceModule.init();
