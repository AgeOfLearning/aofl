(context, html) => html`
<button on-click="${() => context.incrementCount()}">Increment Count</button>
<button on-click="${() => context.unsubscribe()}">Unsubscribe</button>
<button on-click="${() => context.subscribe()}">Subscribe</button>

<dl>
  <dt>Count</dt>
  <dd>${context.count}</dd>

  <dt>Formatted Date</dt>
  <dd>${context.formattedDate}</dd>

  <dt>State Object</dt>
  <dd><pre>${JSON.stringify(context.state, null, 2)}</pre></dd>
</dl>
`;
