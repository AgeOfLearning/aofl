(context, html) => html`
<button on-click="${(e) => context.addToList(e)}">Add To List</button>
<p>You have selected: ${context.selected}</p>
<aofl-select-list id="test" on-click="${(e) => context.updateSelected(e)}">
  ${context.numbers.map((number) => {
    return html`<aofl-list-option>${number}</aofl-list-option>`;
  })}
</aofl-select-list>
`;
