import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/i18n-mixin')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <h2>Test Tile</h2>
    <p>Given a po file <strong>de-DE.po</strong></p>
    <pre>
      <code>
      Content-Type: "text/plain; charset=UTF-8"
      Content-Transfer-Encoding: "8bit"
      Project-Id-Version: ""

      msgid "Home page"
      msgstr "Startseite"

      msgid "How are you %s1"
      msgstr "Wie geht es dir %s1"
      </code>
    </pre>
    <aofl-preview dom-scope="i18n-mixin-preview">
      <span slot="title">i18n</span>
      <code slot="javascript">${context.jsExample}</code>
      <code slot="css">${context.cssExample}</code>
      <code slot="htmlmixed">${context.htmlExample}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
