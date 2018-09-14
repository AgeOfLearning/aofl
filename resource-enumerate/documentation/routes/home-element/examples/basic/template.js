(context, html) => html`
<p>Environment: ${context.environment}</p>
<p>Response:</p>
<pre>${JSON.stringify(context.response, null, 2)}</pre>
`;
