const path = require('path');
const fs = require('fs');

module.exports = (projectRoot, projectInfo, commit = false) => {
  const result = {
    skip: false,
    message: `Update path to main/css/index.css`,
    label: `Updating path to main/css/index.css`
  };

  if (commit) {
    const templatePath = path.join(projectRoot, 'src', 'template', 'template.ejs');
    let template = fs.readFileSync(templatePath, {encoding: 'utf-8'});
    template = template.replace('./css/index.css', './main/css/index.css');

    fs.writeFileSync(templatePath, template, {encoding: 'utf-8'});
  }

  return result;
};
