export default (context, html) => html`
<p>Attached: ${context.attached}</p>
<button @click="${(e) => context.attachDetach(e)}">Attach/detach</button>
<button @click="${(e) => context.updateColor(e)}">Update Color</button>
`;
