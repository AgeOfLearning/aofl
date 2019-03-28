export default (context, html) => html`
<button @click="${() => context.incrementCount()}">Increment Count</button>
<button @click="${() => context.unsubscribe()}" .disabled="${typeof context.unsubscribeStore !== 'function'}">Unsubscribe</button>
<button @click="${() => context.subscribe()}" .disabled="${typeof context.unsubscribeStore === 'function'}">Subscribe</button>

<dl>
  <dt>Count</dt>
  <dd>${context.count}</dd>

  <dt>Formatted Date</dt>
  <dd>${context.formattedDate}</dd>

  <dt>State Object</dt>
  <dd><pre>${JSON.stringify(context.state, null, 2)}</pre></dd>
</dl>
`;
