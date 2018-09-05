export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <nav class="content-width">
    <link-to href="/">aofl-code-preview</link-to>
    <link-to href="/aofl-code/">aofl-code</link-to>
  </nav>
  <header>
    <h1 class="content-width">${'aofl-code'}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  <p>Maecenas efficitur, sapien ut elementum elementum, mi odio accumsan tellus, iaculis porttitor magna erat vitae nunc. Ut mollis ac ex in hendrerit. Pellentesque consequat efficitur dignissim. Morbi quis nisi rhoncus, dapibus ante ac, iaculis quam. Nulla facilisi. Pellentesque mollis turpis id ante bibendum laoreet. In eget lectus non ante vehicula ornare. Nunc ullamcorper ligula ac ligula condimentum congue. Phasellus sagittis at tellus ac consequat. Vivamus hendrerit purus ut leo efficitur placerat aliquet in orci.</p>
</main>
</main-layout>

<aofl-code>
:host {
  display: flex;
  box-sizing: unset;
}

.CodeMirror {
  box-sizing: unset;
}

</aofl-code>
<aofl-code>
:host {
  display: flex;
  box-sizing: unset;
}

.CodeMirror {
  box-sizing: unset;
}

</aofl-code>
`;
