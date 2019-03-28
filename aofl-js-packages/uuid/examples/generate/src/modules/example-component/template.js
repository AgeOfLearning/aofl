export default (context, html) => html`
<p>UUID: ${context.uuid}</p>

<button @click="${() => context.generate()}">Generate</button>
`;
