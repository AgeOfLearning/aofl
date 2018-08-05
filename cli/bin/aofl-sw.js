#!/usr/bin/env node
'use strict';

const CommanderHelper = require('../lib/commander-helper');
const Sw = require('../commands/sw');
const program = require('commander');

program
.option('-e, --exclude [paths]', 'list of paths to exclude', CommanderHelper.collect, [])
.option('-E, --exclude-pattern [paths]', 'list of patterns to exclude', CommanderHelper.collect, [])
.parse(process.argv);

let sw = new Sw(program.args, program.exclude, program.excludePattern);
sw.init();
