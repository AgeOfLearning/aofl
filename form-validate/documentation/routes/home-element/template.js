import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/aofl-validate')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <tab-headers id="content-tabs" groupId="contentTabs" storeInstance$="${context.storeInstance}">
    <aofl-list-option slot="tab" class="link" value="overview" selected$="${context.selectedContentTab === 'overview'}">Overview</aofl-list-option>
    <aofl-list-option slot="tab" class="link" value="examples" selected$="${context.selectedContentTab === 'examples'}">Examples</aofl-list-option>
  </tab-headers>

  <tab-content groupId="contentTabs" tabId="overview" storeInstance$="${context.storeInstance}">${html([md])}</tab-content>
  <tab-content groupId="contentTabs" tabId="examples" storeInstance$="${context.storeInstance}">
    <p>This following example displays the basic usage of the form-validation-mixin. I makes use of default valdation functions from the package and a user defined validation function (alpha).</p>
    <aofl-preview dom-scope="validation-preview">
      <span slot="title">validationMixin</span>
      <code slot="javascript">${context.validationMixinExample.jsCode}</code>
      <code slot="css">${context.validationMixinExample.cssCode}</code>
      <code slot="htmlmixed">${context.validationMixinExample.htmlCode}</code>
    </aofl-preview>

    <p>The following example demonstrates async validators.</p>
    <aofl-preview dom-scope="signup-preview">
      <span slot="title">Sign up form</span>
      <code slot="javascript">${context.signupExample.jsCode}</code>
      <code slot="css">${context.signupExample.cssCode}</code>
      <code slot="htmlmixed">${context.signupExample.htmlCode}</code>
    </aofl-preview>
  </tab-content>
</main>
</main-layout>
`;
