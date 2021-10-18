const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const {loadConfig} = require('../../lib/webpack-config');
const {Routes} = require('../routes');
const server = require('./server');
const prerender = require('./prerender');
const replaceString = require('../../lib/replace-string');

const DEFAULT_SETTINGS = {
  port: 3000,
  schema: 'http',
  host: 'localhost',
  external: false,
  timeout: 0
};

class Prerender {
  /**
   * Creates an instance of Prerender.
   *
   * @param {String} config
   * @param {Boolean} watch
   * @param {Boolean} stats
   * @param {Boolean} profile
   * @param {Boolean} debug
   */
  constructor(config = '.aofl.js', settings = {}) {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...settings
    };
    this.configPath = path.resolve(config);
    this.config = loadConfig(this.configPath);
  }

  /**
   *
   */
  async init() {
    const routes = new Routes(
      this.config.root,
      this.config.build.templating.routes.pattern,
      this.config.build.templating.routes.ignore,
      this.config.build.templating.routes.output
    );
    const routeFiles = routes.getFiles();
    const processed = [];
    const promises = [];
    let errors = false;

    const publicPath = this.config.build.publicPath.replace(/\/$/, '');
    const rootPath = this.config.build.path.replace(new RegExp(`${publicPath}$`), '');
    const s = await server(rootPath, {
      port: this.settings.port,
      schema: this.settings.schema,
      host: this.settings.host,
      external: this.settings.external,
    });

    try {
      for (const routeFile of routeFiles) {
        const routes = require(routeFile);
        for (const route of routes) {
          if (route.prerender !== true || route.path.indexOf(':') > -1) continue; // skip routes with dynamic segments
          if (processed.indexOf(route.path) > -1) continue; // skip already processed routes
          processed.push(route.path);
          const relRoutePath = route.path.replace(/^\//, '');
          const url = s.url + this.config.build.publicPath + relRoutePath;
          const outputPath = path.join(this.config.build.path, relRoutePath, 'index.html');
          promises.push(prerender(url, {timeout: this.settings.timeout}).then((html) => {
            process.stdout.write(chalk.cyan('Processing... ' + url + '\n'));
            const file = fs.readFileSync(outputPath, 'utf8');
            let source = file;
            const bodyMatch = /<body.*<\/body>/.exec(file);
            if (bodyMatch !== null) {
              source = replaceString(file, bodyMatch[0], html);
            }
            source = source.replace(/\n/g, ' ');
            fs.writeFileSync(outputPath, source, 'utf8');
          }));
        }
      }

      await Promise.all(promises);
    } catch (err) {
      errors = true;
      process.stdout.write(chalk.red(err.message + '\n'));
    } finally {
      await s.close();
      if (errors) {
        process.exit(1);
      }
    }
  }
}

module.exports = Prerender;
