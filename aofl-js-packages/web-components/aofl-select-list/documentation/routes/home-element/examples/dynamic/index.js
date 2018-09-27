context.numbers = [];
context.selected = '';

context.addToList = (e) => {
  context.numbers = [...context.numbers, context.numbers.length + 1];
};

context.updateSelected = (e) => {
  context.selected = e.target.value;
};
