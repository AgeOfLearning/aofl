#!/usr/bin/env node
const I18NModule = require('../commands/i18n');
const program = require('commander');
const CommanderHelper = require('../lib/commander-helper');

program
.option('-p, --pattern [pattern]', 'list of patterns to search. Wrap patterns in "".', CommanderHelper.collect, [])
.option('-e, --exclude [paths]', 'list of paths to exclude', CommanderHelper.collect, [])
.option('-E, --exclude-pattern [paths]', 'list of patterns to exclude', CommanderHelper.collect, [])
.parse(process.argv);

const i18NModule = new I18NModule(program.args[0], program.pattern, program.exclude, program.excludePattern);
i18NModule.init();

