import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/resource-enumerate')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <p>Here we have a basic example of the config object. We have a single api source (namespaced "awesom-apis"), <code>[development|stage]Regex</code> for @aofl/server-environment and <code>[development|stage]Config()</code> returning the correct api urls for their respective environments.</p>

    <p>In the inital example developmentRegex will match any domain and you should see the development version of resource enumerate api call (check the networks tab).</p>

    <p>You can test stage and production calls by updating <code>[development|stage]Regex</code> in the code section below and clicking on the play button. Try the following two scenarios
      <pre class="language-javascript"><code>...
developmentRegex: /no-match/,
stageRegex: /./,
...</code></pre>
      and
      <pre class="language-javascript"><code>...
developmentRegex: /no-match/,
stageRegex: /no-match/,
...</code></pre>
    </p>

    <p>If you press the play button multiple times you'll notice that once the api call is made, and the data updates, nothing changes. This is because @aofl/api-request caches the response. To invalidate cache you can pass <code>false</code> to <code>resourceEnumerateInstance.get(namespace, fromCache)</code> as the second argument. Alternatively, you can implement <code>invalidateCache()</code> to invalidate cache based on some algorithm.</p>

    <p>Update the code below to <code>resourceEnumerateInstance.get('awesome-apis', <strong>false</strong>)</code> and press play multiple times.</p>

    <p>Revert the previous example back to <code>resourceEnumerateInstance.get('awesome-apis')</code> and add the following. In this case we are randomly changing the outcome of invalidateCache.</p>
    <pre class="language-javascript"><code>...
'awesome-apis': {
  url: '/apis/v1.0/resource-enumerate.json'
  invalidateCache() { // add invalidateCache function
    return Math.random() > 0.8;
  }
}
...</code></pre>
    <aofl-preview dom-scope="re-basic-preview">
      <span slot="title">Basic example</span>
      <code slot="javascript">${context.basicExample.jsCode}</code>
      <code slot="css">${context.basicExample.cssCode}</code>
      <code slot="htmlmixed">${context.basicExample.htmlCode}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
