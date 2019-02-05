#!/usr/bin/env node
const chalk = require('chalk');
const Generate = require('../commands/generate');
const program = require('commander');

program
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help g
    aofl g c path/to/element-name ${chalk.dim('## generate an element that extends AoflElement')}
    aofl g mixin path/to/mixin ${chalk.dim('## generate a mixin class')}
`);
  })
  .parse(process.argv);

if (program.args.length < 2) {
  process.stdout.write(chalk.red('invalid number of arguments provided') + '\n');
  process.exit(1);
}

const generate = new Generate(program.args[0], program.args[1]);
generate.init();
