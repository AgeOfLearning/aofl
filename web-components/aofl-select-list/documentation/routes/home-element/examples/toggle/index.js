context.toggled = '';
context.updateSelected = (e) => {
  context.toggled = e.target.value === 'On' ? 'show' : '';
};
