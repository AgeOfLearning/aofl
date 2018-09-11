(context, html) => html`
<aofl-select-list on-click="${(e) => context.updateSelected(e)}">
  <aofl-list-option>On</aofl-list-option>
  <aofl-list-option>Off</aofl-list-option>
</aofl-select-list>
<div class$="${context.toggled}">
  toggle content
</div>
`;
