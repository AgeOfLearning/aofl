#!/usr/bin/env node
const {CommanderHelper} = require('@aofl/cli-lib');
const DomScope = require('../commands/dom-scope');

// args
const program = require('commander');
program
  .option('-p, --pattern [pattern]', 'list of patterns to search. Wrap patterns in "".', CommanderHelper.collect, [])
  .option('-e, --exclude [paths]', 'list of paths to exclude', CommanderHelper.collect, [])
  .option('-E, --exclude-pattern [paths]', 'list of patterns to exclude', CommanderHelper.collect, [])
  .parse(process.argv);

const domScope = new DomScope(program.args, program.pattern, program.exclude, program.excludePattern);
domScope.init();
