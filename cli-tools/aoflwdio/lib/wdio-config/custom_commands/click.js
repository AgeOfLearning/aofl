const {ELEMENT_KEY} = require('webdriverio/build/constants');
const click = function() {
  this.execute(function(element) {
    element.click();
  }, {
    [ELEMENT_KEY]: this.elementId,
    'ELEMENT': this.elementId
  });
};

module.exports = click;
