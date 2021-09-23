#!/usr/bin/env node
const chalk = require('chalk');
const InitProject = require('../commands/init-project');
const program = require('commander');

program
  .arguments('[path]', 'Path to project directory')
  .option('--repo [repo]', 'repo url')
  .option('--base [base]', 'starter application alias')
  .option('--ref [branch]', 'Git ref to clone from. Branch, tag, ...')
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help init
    aofl init path/to/project ${chalk.dim('## generate a bare bone aofl project')}
    aofl init --base doc ${chalk.dim('## generate a documentation project just like @aofl components example projects')}
`);
  })
  .actions((path = '.') => {
    const options = program.opts();

    const initProject = new InitProject(path, options.base, options.ref, options.repo);
    initProject.init();
  })
  .parse(process.argv);


