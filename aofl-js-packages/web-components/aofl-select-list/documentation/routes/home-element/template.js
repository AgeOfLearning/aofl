import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('aofl-select-list')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <p>The most basic usage of the list. Make a selection!</p>
    <aofl-preview dom-scope="aofl-select-list-preview">
      <span slot="title">Select List</span>
      <code slot="javascript">${context.jsExample}</code>
      <code slot="css">${context.cssExample}</code>
      <code slot="htmlmixed">${context.htmlExample}</code>
    </aofl-preview>
    <p>Lists can be used to make a number of common components including toggles.</p>
    <aofl-preview dom-scope="aofl-select-list-toggle-preview">
      <span slot="title">Toggle</span>
      <code slot="javascript">${context.jsExample2}</code>
      <code slot="css">${context.cssExample2}</code>
      <code slot="htmlmixed">${context.htmlExample2}</code>
    </aofl-preview>
    <p>Lists may be easily added to after their initialization.</p>
    <aofl-preview dom-scope="aofl-select-list-dynamic-preview">
      <span slot="title">Dynamic List</span>
      <code slot="javascript">${context.jsExample3}</code>
      <code slot="css">${context.cssExample3}</code>
      <code slot="htmlmixed">${context.htmlExample3}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
