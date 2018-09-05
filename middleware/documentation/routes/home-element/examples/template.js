(context, html) => html`
  <div>
    <h3>Middleware output</h3>
    <ul>
      ${context.outputs.map((output) => html`<li>${output}</li>`)}
    </ul>
  </div>
`;
