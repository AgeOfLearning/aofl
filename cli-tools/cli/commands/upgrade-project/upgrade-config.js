const path = require('path');

module.exports = [
  {
    from: '1.x',
    to: 'v2.0.0',
    path: path.join(__dirname, 'codemod', '2.0.0')
  }
];
