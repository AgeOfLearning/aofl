const path = require('path');
const fs = require('fs');

module.exports = (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: `Update aofl config`,
    info: '\tbuild.global.purfiyCss => build.global.purgeCss',
    label: `Updating aoflConfig`
  };

  if (commit) {
    const configPath = path.join(projectRoot, '.aofl.js');
    let config = fs.readFileSync(configPath, {encoding: 'utf-8'});
    config = config.replace('purifyCss', 'purgeCss');

    fs.writeFileSync(configPath, config, {encoding: 'utf-8'});
  }

  return result;
};
