/* eslint-disable */
const routeConfig = [{
  path: '/',
  title: 'Home',
  resolve: () => new Promise((resolve) => resolve(SampleHomePage))
}, {
  path: '/about/:person',
  title: 'About',
  resolve: () => new Promise((resolve) => resolve(SampleAboutPage))
},{
  path: '/login',
  title: 'Login',
  resolve: () => new Promise((resolve) => resolve(SampleLoginPage))
}];

const router = new Router();
router.init(routeConfig);

class Navigation extends AoflElement {
  _render() {
    return super._render((context, html) => html`
      <a href="" onclick="${(e) => {e.preventDefault(); router.navigate('/', true, true)}}">Home</a>
      <a href="" onclick="${(e) => {e.preventDefault(); router.navigate('/about/bob', false, true)}}">About Bob</a>
      <a href="" onclick="${(e) => {e.preventDefault(); router.navigate('/mystery-page', false, true)}}">Mystery Page</a>
      <a href="" onclick="${(e) => {e.preventDefault(); router.navigate('/members', false, true).then(() => console.log('---->navigation complete'))}}">Members page</a>
    `);
  }
}
customElements.define('nav-menu', Navigation);

class SampleHomePage extends AoflElement {
  static get is () {return 'sample-home-page'}
  _render() {
    return super._render((context, html) => html`
      <h2>Home page</h2>
      <p>Home is where the heart is.. or say they say</p>
    `);
  }
}
customElements.define('sample-home-page', SampleHomePage);

class SampleAboutPage extends AoflElement {
  static get is () {return 'sample-about-page'}
  _render() {
    return super._render((context, html) => html`
      <h2>About page</h2>
      <p>This page is all about ${context.person || 'Nobody!'}</p>
    `);
  }
}
customElements.define('sample-about-page', SampleAboutPage);

class SampleLoginPage extends AoflElement {
  static get is () {return 'sample-login-page'}
  _render() {
    return super._render((context, html) => html`
      <h2>Please Login</h2>
      <p>Though hard to do without a form :)</p>
    `);
  }
}
customElements.define('sample-login-page', SampleLoginPage);

class SampleRouterView extends AoflElement {
  constructor() {
    super();
    // set default template
    this.template = (context, html) => html``;
    router.beforeEach((request, response, next) => {
      if (request.to === '/members') {
        response.to = '/login';
        next(response);
      } else {
        next(response);
      }
    });
    router.after((request, response, next) => {
      if (response.matchedRoute === null) {
        // no match was found
        this.template = (context, html) => html`<h3>404</h3><p>Page not found</p>`;
        this.requestRender();
      } else {
        console.log('response12', response);
        response.matchedRoute.resolve()
        .then((component) => {
          document.title = response.matchedRoute.title;
          let t = `<${component.is}></${component.is}>`;
          this.template = () => html([t]);
          this.requestRender();
          next(response);
        })
        .catch((e) => {
          console.log('err');
          console.log(e);
        });
      }
    });
  }
  _render() {
    return super._render(this.template);
  }
}
customElements.define('sample-router-view', SampleRouterView);


router.navigate('/', true, true);
