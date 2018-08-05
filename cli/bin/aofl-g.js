#!/usr/bin/env node
const chalk = require('chalk');
const Generate = require('../commands/generate');
const program = require('commander');

program
.on('--help', () => {
  console.log(`
  Examples:

    aofl help g
    aofl g aofl path/to/element-name ${chalk.dim('## generate an element that extends AoflElement')}
    aofl g lit path /to element-name ${chalk.dim('## generate an element that extends LitElement')}
`);
})
.parse(process.argv);

if (program.args.length < 2) {
  console.log(chalk.red('invalid number of arguments provided'));
  process.exit(1);
}

let generate = new Generate(program.args[0], program.args[1]);
generate.init();
