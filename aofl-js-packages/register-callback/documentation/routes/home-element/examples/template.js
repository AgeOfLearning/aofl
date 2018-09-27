(context, html) => html`
<button on-click="${() => context.next()}">Invoke Next</button>
<button on-click="${() => context.error()}">Invoke Error</button>
<button on-click="${() => context.unsubscribe()}">Unsubscribe Hello</button>
<button on-click="${() => context.subscribe()}">Subscribe Hello</button>

<pre>${context.output}</pre>
`;
