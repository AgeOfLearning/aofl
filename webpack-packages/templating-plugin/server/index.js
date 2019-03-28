const compression = require('compression');
const express = require('express');
const serveStatic = require('serve-static');

module.exports = (fileMap, rootPath, rootUri, config) => {
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
  app.use((req, res, next)=> {
    const requestUrl = req.url.replace(new RegExp('^' + rootUri), '');
    let asset = null;

    if (typeof fileMap[requestUrl] !== 'undefined') {
      asset = fileMap[requestUrl];
    } else if (typeof fileMap[requestUrl + 'index.html'] !== 'undefined') {
      asset = fileMap[requestUrl + 'index.html'];
    }

    if (asset && typeof asset.source === 'function') {
      res.send(asset.source());
    } else {
      next();
    }
  });
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

