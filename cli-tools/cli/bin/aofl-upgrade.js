#!/usr/bin/env node
const UpgradeProject = require('../commands/upgrade-project');
const program = require('commander');

program
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help upgrade
    aofl upgrade
`);
  })
  .parse(process.argv);

const upgradeProject = new UpgradeProject(program.args[0]);
upgradeProject.init();
