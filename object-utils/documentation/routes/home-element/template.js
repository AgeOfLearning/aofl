import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/object-utils')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <aofl-preview dom-scope="deep-assign">
      <span slot="title">deepAssign</span>
      <code slot="javascript">${context.deepAssignExample.jsCode}</code>
      <code slot="css">${context.deepAssignExample.cssCode}</code>
      <code slot="htmlmixed">${context.deepAssignExample.templateCode}</code>
    </aofl-preview>

    <aofl-preview dom-scope="deep-freeze">
      <span slot="title">deepFreeze</span>
      <code slot="javascript">${context.deepFreezeExample.jsCode}</code>
      <code slot="css">${context.deepFreezeExample.cssCode}</code>
      <code slot="htmlmixed">${context.deepFreezeExample.templateCode}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
