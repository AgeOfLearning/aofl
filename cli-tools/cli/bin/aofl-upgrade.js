#!/usr/bin/env node
const UpgradeProject = require('../commands/upgrade-project');
const program = require('commander');

program
  .arguments('[path]', 'Path to project\'s directory')
  .action((path = '.') => {
    const upgradeProject = new UpgradeProject(path);
    upgradeProject.init();
  })
  .on('--help', () => {
    process.stdout.write(`
  Examples:

    aofl help upgrade
    aofl upgrade
`);
  })
  .parse(process.argv);

