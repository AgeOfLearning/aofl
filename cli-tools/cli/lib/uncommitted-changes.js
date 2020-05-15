const {Git} = require('@aofl/cli-lib');
const chalk = require('chalk');

const exitOnUncommittedChanges = async () => {
  let status = [];
  try {
    status = await Git.status(false, false, false, true, false, false, {stdio: 'pipe'});
    if (status.length) throw new Error();
  } catch (e) {
    process.stdout.write(chalk.yellow('Working tree has uncommitted changes, please commit or remove the following changes before continuing' + '\n'));
    process.stdout.write(status + '\n');
    process.exit(1);
  }
};

exports.exitOnUncommittedChanges = exitOnUncommittedChanges;
