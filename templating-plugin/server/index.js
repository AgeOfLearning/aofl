const compression = require('compression');
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

module.exports = (fileMap) => {
  const rootPath = path.resolve(__dirname, '../../../__build');
  let indexes = [
    'index.html',
    'index.htm'
  ];

  const app = express();

  const serve = serveStatic(rootPath, {
    index: indexes
  });

  app.use(compression());
  app.use((req, res, next)=> {
    let url = req.url.replace(/^\//, '');
    let asset = null;

    if (typeof fileMap[url] !== 'undefined') {
      asset = fileMap[url];
    } else if (typeof fileMap[url + 'index.html'] !== 'undefined') {
      asset = fileMap[url + 'index.html'];
    }
    if (typeof asset.source === 'function') {
      res.send(asset.source());
    } else {
      next();
    }
  });
  app.use(serve);

  let listen = (app, port, ip)=> {
    return new Promise((resolve, reject) => {
      let server = app.listen(port, ip, (err) => { // start app
        if (err) {
          console.trace(err);
          return process.exit(1);
        }
        console.log('App listening on %s:%s', ip, port);
        return resolve({
          url: 'http://localhost:8090',
          close() {
            server.close();
          }
        });
      });
    });
  };

  return listen(app, 8090, 'localhost');
};
// listen(app, 8080, '10.0.192.141');

