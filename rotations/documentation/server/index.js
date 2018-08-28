#!/usr/bin/env node
const compression = require('compression');
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

const rootPath = path.resolve(__dirname, '../__build');
let indexes = [
  'index.html',
  'index.htm'
];

const app = express();

const serve = serveStatic(rootPath, {
  index: indexes
});

app.use(compression());
app.use(serve);
let listen = (app, port, ip)=> {
  app.listen(port, ip, (err) => { // start app
    if (err) {
      console.trace(err);
      return process.exit(1);
    }
    console.log('App listening on %s:%s', ip, port);
  });
};

listen(app, 8080, 'localhost');
// listen(app, 8080, '10.0.192.141');
// listen(app, 8080, '10.192.130.190');
// listen(app, 8080, '10.0.133.98');
// listen(app, 8080, '172.20.10.2');
// listen(app, 8080, '10.0.208.74');
// listen(app, 8080, '192.168.50.205');

