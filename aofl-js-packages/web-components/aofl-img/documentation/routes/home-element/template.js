import md from '../../../README.md';
import * as visible from './examples/visible';
import * as scroll from './examples/scroll';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/web-components/aofl-img')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" on-change="${() => context.tabChange()}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples">
    <p>When aofl-img is in the visible area it loads the image.</p>
    <aofl-preview dom-scope="aofl-img-visible-preview">
      <span slot="title">Visible</span>
      <code slot="javascript">${visible.jsCode}</code>
      <code slot="css">${visible.cssCode}</code>
      <code slot="htmlmixed">${visible.htmlCode}</code>
    </aofl-preview>

    <p>When aofl-img is outside of the visible area it does not load the image until the image is scrolled close to the visible area. In the example below observe the networks tab in the devtools and scroll the preview area to right.</p>
    <aofl-preview dom-scope="aofl-img-scroll-preview">
      <span slot="title">Scroll</span>
      <code slot="javascript">${scroll.jsCode}</code>
      <code slot="css">${scroll.cssCode}</code>
      <code slot="htmlmixed">${scroll.htmlCode}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
