const path = require('path');

module.exports = [
  {
    from: '1.x',
    to: 'latest v2',
    path: path.join(__dirname, 'codemod', '2.x')
  }
];
