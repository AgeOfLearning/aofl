import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/drawer')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <p>If no animation classes are provided aofl-drawer will simply toggle the content on and off</p>
    <aofl-preview dom-scope="no-animate-preview">
      <span slot="title">No animation</span>
      <code slot="javascript">${context.jsExample}</code>
      <code slot="css">${context.cssExample}</code>
      <code slot="htmlmixed">${context.htmlExample}</code>
    </aofl-preview>
    <p>Animation classes may be provided to animate in content</p>
    <aofl-preview dom-scope="fade-in-preview">
      <span slot="title">Fade In</span>
      <code slot="javascript">${context.jsExample2}</code>
      <code slot="css">${context.cssExample2}</code>
      <code slot="htmlmixed">${context.htmlExample2}</code>
    </aofl-preview>
    <p>Drawers can be used in any situation you want to hide and reveal content including dropdowns and panels</p>
    <aofl-preview dom-scope="side-panel-preview">
      <span slot="title">Side Panel</span>
      <code slot="javascript">${context.jsExample3}</code>
      <code slot="css">${context.cssExample3}</code>
      <code slot="htmlmixed">${context.htmlExample3}</code>
    </aofl-preview>
    <p>Here is a more complicated example showing a pair of drawers being used in an accordion group</p>
    <aofl-preview dom-scope="accordion-preview">
      <span slot="title">Accordion</span>
      <code slot="javascript">${context.jsExample4}</code>
      <code slot="css">${context.cssExample4}</code>
      <code slot="htmlmixed">${context.htmlExample4}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
