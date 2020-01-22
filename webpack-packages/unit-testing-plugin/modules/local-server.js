const express = require('express');
const compression = require('compression');
const serveIndex = require('serve-index');
const chalk = require('chalk');

class LocalServer {
  constructor(root, host = 'localhost', port = 3000, debug = false) {
    this.app = express();
    this.host = host;
    this.port = port;
    this.server = null;
    this.debug = debug;

    this.app.use(compression());
    this.app.use(serveIndex(root));
    this.app.use(express.static(root));
  }

  listen() {
    if (this.server !== null) throw new Error(`server is already running on port ${this.port}`);
    this.server = this.app.listen(this.port, () => {
      if (this.debug) {
        process.stdout.write(
          'IP: ' + this.server.address().address + '\n'+
          'PORT: ' + this.server.address().port + '\n' +
          '\n\n'
        );
      }

      process.stdout.write(
        chalk.inverse.bold(`Testing started on http://${this.host}:${this.port} `) + '\n\n'
      );
    });
  }

  close() {
    if (this.server !== null) {
      this.server.close(() => {});
      this.server = null;
    }
  }
}

module.exports.LocalServer = LocalServer;
