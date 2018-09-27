(context, html) => html`
<p>You have selected: ${context.selected}</p>
<aofl-select-list on-click="${(e) => context.updateSelected(e)}">
  <aofl-list-option>1</aofl-list-option>
  <aofl-list-option>2</aofl-list-option>
  <aofl-list-option>3</aofl-list-option>
  <aofl-list-option>4</aofl-list-option>
</aofl-select-list>
`;
