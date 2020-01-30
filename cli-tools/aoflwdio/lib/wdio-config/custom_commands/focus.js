const {ELEMENT_KEY} = require('webdriverio/build/constants');

const focus = function() {
  this.execute(function(element) {
    element.focus();
  }, {
    [ELEMENT_KEY]: this.elementId,
    'ELEMENT': this.elementId
  });
};

module.exports = focus;
