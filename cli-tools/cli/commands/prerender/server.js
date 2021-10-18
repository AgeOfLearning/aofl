const compression = require('compression');
const express = require('express');
const serveStatic = require('serve-static');

module.exports = (rootPath, config = {
  schema: 'http',
  host: 'localhost',
  port: 3000,
  externalServer: false,
}) => {
  let url = `${config.schema}://${config.host}:${config.port}`;
  if (config.port === 80) {
    url = `${config.schema}://${config.host}`;
  }

  if (config.externalServer) {
    return Promise.resolve({
      url,
      close: () => {}
    });
  }

  const indexes = [
    'index.html',
    'index.htm'
  ];

  const app = express();

  const serve = serveStatic(rootPath, {
    index: indexes
  });

  app.use(compression());
  app.use(serve);

  const listen = (app, port, ip)=> {
    return new Promise((resolve) => {
      const server = app.listen(port, ip, (err) => { // start app
        if (err) {
          process.stdout.write(err + '\n');
          return process.exit(1);
        }
        // console.log('App listening on %s:%s', ip, port);
        return resolve({
          url,
          close() {
            server.close();
          }
        });
      });
    });
  };

  return listen(app, config.port, config.host);
};

