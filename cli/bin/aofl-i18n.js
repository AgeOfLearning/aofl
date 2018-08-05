#!/usr/bin/env node
const I18NModule = require('../commands/i18n-module');
const program = require('commander');

program
.option('--repo [repo]', 'repo url')
.parse(process.argv);

let i18NModule = new I18NModule(program.args, program.repo);
i18NModule.init();
