const compression = require('compression');
const express = require('express');
const serveStatic = require('serve-static');

module.exports = (fileMap, rootPath, rootUri) => {
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
    const url = req.url.replace(new RegExp('^' + rootUri), '');
    let asset = null;

    if (typeof fileMap[url] !== 'undefined') {
      asset = fileMap[url];
    } else if (typeof fileMap[url + 'index.html'] !== 'undefined') {
      asset = fileMap[url + 'index.html'];
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

