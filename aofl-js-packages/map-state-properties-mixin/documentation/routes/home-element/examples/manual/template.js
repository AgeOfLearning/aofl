(context, html) => html`
<div>
  <p>Attached: ${context.attached}</p>
  <button on-click="${(e) => context.attachDetach(e)}">Attach/detach</button>
  <button on-click="${() => context.updateColor()}">Update Color</button>
</div>
`;
