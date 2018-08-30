context.user = deepFreeze({
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
});


try {
  context.user.account.active = false;
} catch (e) {
  context.error = e;
}
