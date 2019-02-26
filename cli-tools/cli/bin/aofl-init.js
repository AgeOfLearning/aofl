#!/usr/bin/env node
const chalk = require('chalk');
const InitProject = require('../commands/init-project');
const program = require('commander');

program
  .option('--repo [repo]', 'repo url')
  .option('--base [base]', 'starter application alias')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help init
    aofl init path/to/project ${chalk.dim('## generate a bare bone aofl project')}
    aofl init --base doc ${chalk.dim('## generate a documentation project just like @aofl components example projects')}
`);
  })
  .parse(process.argv);


const initProject = new InitProject(program.args[0], program.repo, program.base);
initProject.init();
