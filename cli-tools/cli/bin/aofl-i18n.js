#!/usr/bin/env node
const I18NModule = require('../commands/i18n');
const program = require('commander');
const {CommanderHelper} = require('@aofl/cli-lib');

program
  .option('-p, --pattern [pattern]', 'list of patterns to search. Wrap patterns in "".', CommanderHelper.collect, ['**/*.js'])
  .option('-e, --exclude [paths]', 'list of paths to exclude', CommanderHelper.collect, [])
  .option('-E, --exclude-pattern [paths]', 'list of patterns to exclude', CommanderHelper.collect, [
    '**/node_modules',
    '**/bower_components'
  ])
  .action(() => {
    const options = program.opts();

    const i18NModule = new I18NModule(options.args[0], options.pattern, options.exclude, options.excludePattern);
    i18NModule.init();
  })
  .parse(process.argv);


