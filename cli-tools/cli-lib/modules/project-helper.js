const path = require('path');
const fs = require('fs');
const {projectFileNames} = require('./constants-enumerate');

class ProjectHelper {
  static getConfigFilePath(target) {
    const fileList = fs.readdirSync(target);
    const configFile = projectFileNames.GENERATED_CONFIG.find((item) => fileList.indexOf(item) > -1);
    if (configFile) {
      return path.join(target, configFile);
    }
  }

  static findProjectRoot(target) {
    const stats = fs.statSync(target);

    if (target === path.dirname(target)) {
      return;
    }

    if (stats.isDirectory()) {
      const projectRoot = ProjectHelper.getConfigFilePath(target);
      if (projectRoot) {
        return target;
      }
      return ProjectHelper.findProjectRoot(path.dirname(target));
    }

    return ProjectHelper.findProjectRoot(path.dirname(target));
  }

  static getConfig(target) {
    const file = fs.readFileSync(ProjectHelper.getConfigFilePath(target), {encoding: 'utf-8'});
    return JSON.parse(file);
  }
}

module.exports.ProjectHelper = ProjectHelper;
