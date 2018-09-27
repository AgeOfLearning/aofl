import md from '../../../README.md';
import * as pictureExample from './examples/picture';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/web-components/aofl-picture')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" on-change="${() => context.tabChange()}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples">
    <aofl-preview dom-scope="picture-preview">
      <span slot="title">aofl-picture</span>
      <code slot="javascript">${pictureExample.jsCode}</code>
      <code slot="css">${pictureExample.cssCode}</code>
      <code slot="htmlmixed">${pictureExample.htmlCode}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
