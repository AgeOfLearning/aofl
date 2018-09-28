export const template = (context, html) => html`
<style>
:host {
  display: none;
}

:host([open]),
:host(.closing) {
  display: block;
}
</style>
${JSON.stringify(context.open)}
${typeof context.open}
<slot></slot>
`;
