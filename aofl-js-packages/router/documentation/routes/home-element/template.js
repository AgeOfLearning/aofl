import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/router')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">
    ${html([md])}
  </tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <p>The example below has a configured router with three routes along with redirect middleware which redirects the members path to a login path. The example provides key concepts of the router which are: </p>
    <ul>
      <li>The router takes a configuration object which is an array of objects, each having a path pattern and a resolve method which provides a component to load</li>
      <li>Navigation links are made by binding click events to a method which calls <strong>router.navigate('some/path')</strong></li>
      <li>A router view component is necessary to render the matched path</li>
      <li>Middleware allows you to intercept path requests and redirect if necessary</li>
      <li>Matched dynamic path segments are provided as key value pairs in <strong>response.matchedRoute.props</strong></li>
      <li><strong>router.navigate()</strong> will return a promise that resolves after successfull navigation, including those which include redirect(s)</li>
    </ul>
    <aofl-preview dom-scope="router-preview">
      <span slot="title">Router</span>
      <code slot="javascript">${context.jsExample}</code>
      <code slot="css">${context.cssExample}</code>
      <code slot="htmlmixed">${context.htmlExample}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
