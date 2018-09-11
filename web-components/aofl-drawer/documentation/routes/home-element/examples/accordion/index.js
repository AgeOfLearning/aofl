context.red = 'false';
context.blue = 'false';

context.toggleDrawer = (e) => {
  let id = e.srcElement.id;
  if (id === 'red') {
    context.red = context.red === 'false' ? 'true' : 'false';
    context.blue = 'false';
  } else {
    context.blue = context.blue === 'false' ? 'true' : 'false';
    context.red = 'false';
  }
};
