import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/map-state-properties-mixin')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <p>The first example demonstrates one of the common mastakes devolpers make when connecting a component to the store. I.e. forgetting to unsubscribe from store when the component is removed from dom.</p>

    <p>Here we have a component that when attached to dom set's the background color of it's parent based on a property in store</p>
    <p>Try clicking on update color first. Notice nothing happens because our element isn't rendered yet.</p>
    <p>Now click on attach/detach and click on update color again. This time you should see the background color changing.</p>
    <p>Click on attach/detach again to remove the element from dom then click on update color. You should observe that even though we removed the element from DOM we nevere unsubscribed from store.</p>
    <aofl-preview dom-scope="manual-preview">
      <span slot="title">Forgot to unsubscribe</span>
      <code slot="javascript">${context.manualExample.jsCodeManual}</code>
      <code slot="css">${context.manualExample.cssCodeManual}</code>
      <code slot="htmlmixed">${context.manualExample.htmlCodeManual}</code>
    </aofl-preview>

    <p>Unsubscribing from store on <code>disconnectedCallback()</code> fixes the issue.<p>
    <aofl-preview dom-scope="manual-fixed-preview">
      <span slot="title">Fixed Unsubscribe</span>
      <code slot="javascript">${context.manualFixedExample.jsCodeManualFixed}</code>
      <code slot="css">${context.manualFixedExample.cssCodeManualFixed}</code>
      <code slot="htmlmixed">${context.manualFixedExample.htmlCodeManualFixed}</code>
    </aofl-preview>


    <p>Using the mixin automates this behavior and elimnates the need to replicate the same block of code in <code>connectedCallback()</code> and <code>disconnectedCallback()</code></p>
    <aofl-preview dom-scope="mixin-preview">
      <span slot="title">Using the mixin</span>
      <code slot="javascript">${context.mixinExample.jsCodeMixin}</code>
      <code slot="css">${context.mixinExample.cssCodeMixin}</code>
      <code slot="htmlmixed">${context.mixinExample.htmlCodeMixin}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
