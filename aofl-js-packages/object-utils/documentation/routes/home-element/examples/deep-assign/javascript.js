context.user = {
  name: 'Alan',
  account: {
    active: true,
    products: {
      1: true,
      2: true,
      3: true
    }
  },
  preferences: {
   locale: 'en-US'
 }
};

context.user2 = deepAssign(context.user, 'account.products', {
  2: false
});
