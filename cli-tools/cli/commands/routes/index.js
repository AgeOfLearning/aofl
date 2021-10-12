const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');

const DEFAULT_ROTATION = 'routes';
const ALT_ROUTES_REGEX = /\/routes-([^/]+?)\//;

class Routes {
  constructor(baseDir = '.', patterns = [], exclude = [], output = './routes.ts') {
    this.baseDir = path.resolve(baseDir);
    this.patterns = patterns;
    this.exclude = exclude;
    this.output = output;
  }

  run() {
    const routeFiles = this.getFiles();
    let content = `import {Route} from '@aofl/router';\n`;
    const routes = {
      routes: []
    };

    routeFiles.forEach((file, ndx) => {
      const rel = path.relative(path.dirname(this.output), file);
      const importPath = './' + path.join(path.dirname(rel), path.basename(rel, path.extname(rel)));
      const rotation = this.getRotation(file);


      content += `import {routes as routes${ndx}} from '${importPath}';\n`;
      if (typeof routes[rotation] === 'undefined') {
        routes[rotation] = [];
      }
      routes[rotation].push(`...(routes${ndx} as Route[])`);
    });

    content += '\nexport default {';
    content += Object.keys(routes).map((rotation) => {
      return `\n  ${rotation}: [\n  ${routes[rotation].join(',\n  ')}\n  ]`;
    });
    content += '\n};\n';

    fs.writeFileSync(this.output, content, 'utf-8');

    return routeFiles;
  }

  getFiles() {
    return glob.sync(this.patterns, {
      cwd: this.baseDir,
      ignore: this.exclude,
      absolute: true
    });
  }

  getRotation(file) {
    const altRoutesMatches = file.match(ALT_ROUTES_REGEX);
    if (altRoutesMatches !== null) {
      return altRoutesMatches[1];
    }
    return DEFAULT_ROTATION;
  }
}

module.exports.Routes = Routes;
