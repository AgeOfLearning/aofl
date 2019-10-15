const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');

const getFiles = (cwd, mainCss) => {
  const cssFiles = glob.sync(['modules/**/*.css', 'routes/**/*.css', '**/modules/**/*.css'], {
    cwd,
    nodir: true,
    absolute: true,
    ignore: ['node_modules']
  });

  const files = [];

  for (let i = 0; i < cssFiles.length; i++) {
    try {
      const cssFile = cssFiles[i];
      const jsFile = path.join(path.dirname(cssFile), 'template.js');
      fs.statSync(jsFile);
      files.push(cssFile);
    } catch (e) {}
  }
  return files;
};

module.exports = (projectRoot, projectInfo, commit = false) => {
  const mainCss = path.join(projectRoot, 'src', 'template', 'main', 'css', 'index.css');
  let cwd = projectRoot;
  if (commit) {
    cwd = path.join(projectRoot, 'src');
  }
  const files = getFiles(cwd, mainCss);
  const result = {
    skip: false,
    message: `Add main/css/index.css and /*! @aofl-component */ to component styles`,
    info: files.map((file) => `\t- ${file}`).join('\n'),
    label: `Adding main/css/index.css and /*! @aofl-component */ to component styles`
  };

  if (commit) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const source = fs.readFileSync(file, {encoding: 'utf-8'});
      const target = `/*! *@aofl-component */
@import url("${path.relative(path.dirname(file), mainCss)}");

${source}
      `;
      fs.writeFileSync(file, target, {encoding: 'utf-8'});
    }
  }

  return result;
};
