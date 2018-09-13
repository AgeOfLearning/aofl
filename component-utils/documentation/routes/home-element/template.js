import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/component-utils')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <p>In the example below a child component finds its parent component and invokes its incrementCount method on button click.</p>
    <aofl-preview dom-scope="preview">
      <span slot="title">findParent()</span>
      <code slot="javascript">${context.findParentJsExample}</code>
      <code slot="css">${context.findParentCssExample}</code>
      <code slot="htmlmixed">${context.findParentHtmlExample}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
