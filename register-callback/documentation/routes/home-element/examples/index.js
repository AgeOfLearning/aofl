context.rc = new RegisterCallback();
context.output = '';
context.count = 0;

context.clearOutput = () => {
  context.output = '';
};

context.error = () => {
  context.clearOutput();
  context.count++;
  context.rc.error('uh oh');
};

context.next = () => {
  context.clearOutput();
  context.rc.next(context.count++);
};

context.unsubscribe = () => {
  context.unsubscribeHello();
};

context.subscribe = () => {
  context.unsubscribeHello = context.rc.register((count) => context.output += count + ' hello ');
};

context.subscribe();
context.unsubscribeWorld = context.rc.register((count) => context.output += count + ' world', (e) => context.output += context.count + ' ' + e);
context.rc.next(context.count++);
