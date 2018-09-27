import md from '../../../README.md';

export const template = (context, html) => html`
<main-layout>
<main-header slot="page-header">
  <header>
    <h1 class="content-width">${context.__('@aofl/web-components/aofl-element')}</h1>
  </header>
</main-header>

<main slot="page-content" class="content-width column">
  ${html([md])}
</main>
</main-layout>
`;
