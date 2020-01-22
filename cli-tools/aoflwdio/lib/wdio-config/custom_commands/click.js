const click = function() {
  this.execute(function(element) {
    element.click();
  }, {
    'element-6066-11e4-a52e-4f735466cecf':  this.elementId,
    ELEMENT: this.elementId
  });
};

module.exports = click;