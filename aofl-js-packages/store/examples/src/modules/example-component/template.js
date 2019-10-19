export default (context, html) => html`
<button @click="${() => context.incrementCount()}">Increment Count</button>

<dl>
  <dt>Count</dt>
  <dd>${context.count}</dd>

  <dt>Formatted Date</dt>
  <dd>${context.formattedDate}</dd>

  <dt>State Object</dt>
  <dd><pre>${JSON.stringify(context.previewState, null, 2)}</pre></dd>
</dl>
`;
