/* eslint-disable */
class PhoneOS  {
  constructor() {
    this.middleware = new Middleware('beforeApp', 'afterApp');
    this.apps = {};
  }
  beforeApp(mw) {
    this.middleware.use(mw, 'beforeApp');
  }
  afterApp(mw) {
    this.middleware.use(mw, 'afterApp')
  }
  installApp(appname, app) {
    this.apps[appname] = app;
  }
  async openApp(appname) {
    await this.middleware.iterateMiddleware({}, 'beforeApp');
    this.apps[appname].run();
  }
  closeApp(appname) {
    this.apps[appname].close();
    this.middleware.iterateMiddleware({}, 'afterApp');
  }
}

let phone = new PhoneOS();

context.outputs = [];
const securityCheckMiddleware = function() {
  context.outputs.push('Middleware: Performing security check');
};
const closeBgProcessesMiddleware = function() {
  context.outputs.push('Middleware: Closing any unnecessary processes');
};
const myApp = {
  run() {},
  close() {}
};

phone.beforeApp(securityCheckMiddleware);
phone.afterApp(closeBgProcessesMiddleware);

phone.installApp('my-app', myApp);
phone.openApp('my-app');
phone.closeApp('my-app');
