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
    let content = `// @ts-nocheck\nimport {Route} from '@aofl/router';\n`;
    const routesConfig = {
      routes: []
    };
    let importIndex = 0;

    routeFiles.forEach((file, ndx) => {
      const routes = require(file);
      const rotation = this.getRotation(file);

      routes.forEach((route) => {
        let middleware = '';
        if (route.middleware) {
          const middlewareParts = route.middleware.split('#');
          const mPath = path.resolve(path.dirname(file), middlewareParts[0]);
          let mExport = `* as middleware${importIndex}`;
          if (middlewareParts.length > 1) {
            mExport = `${middlewareParts[1]} as middleware${importIndex} `;
          }

          const rel = path.relative(path.dirname(this.output), mPath);
          const importPath = './' + path.join(path.dirname(rel), path.basename(rel, path.extname(rel)));
          content += `import {${mExport}} from '${importPath}';\n`;
          middleware = `middleware${importIndex}`;
          importIndex += 1;
        }

        let config = ` {\n`;
        for (const key in route) {
          if (key === 'metaTags') {
            continue;
          } else if (key === 'middleware' && middleware.length) {
            config += `      '${key}': middleware${importIndex - 1},\n`;
          } else if (key === 'resolve' && route[key].length) {
            const resolvePath = path.resolve(path.dirname(file), route[key]);
            const rel = path.relative(path.dirname(this.output), resolvePath);
            const importPath = './' + path.join(path.dirname(rel), path.basename(rel, path.extname(rel)));
            config += `      '${key}': () => import('${importPath}'),\n`;
          } else {
            config += `      '${key}': ${JSON.stringify(route[key])},\n`;
          }
        }
        config += `    }`;
        if (typeof routesConfig[rotation] === 'undefined') {
          routesConfig[rotation] = [];
        }
        routesConfig[rotation].push(config);
      });
    });

    content += `\nexport type Routes = {\n`;
    content += Object.keys(routesConfig).reduce((acc, rotation) => {
      acc += `  '${rotation}': Route[];\n`;
      return acc;
    }, '');
    content += `};\n`;

    content += '\nconst routesConfig : Routes = {';
    content += Object.keys(routesConfig).reduce((acc, rotation) => {
      acc += `\n  '${rotation}': [\n   ${routesConfig[rotation].join(',')}\n  ],`;
      return acc;
    }, ``);
    content += '\n};\n';

    content += '\nexport default routesConfig;\n';
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
