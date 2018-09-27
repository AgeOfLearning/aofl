(context, html) => html`
<p>Number of Results: ${context.memes.length}</p>
<button on-click="${() => context.makeRequest()}">Request</button>

<p>Memes:</p>
${context.memes.map((item) => {
  return html`<img src="${item.url}" style="width: 50px; height: 50px; margin: 0 5px 5px 0;">`;
})}
`;
