export default (ctx, html) => html`
  <h4>Routes config produced by Rotations class <button @click="${() => ctx.clearCache()}">Clear Cache & Refresh</button> <button @click="${() => ctx.refresh()}">Refresh</button></h4>
  <pre>${JSON.stringify(ctx.routes, null, 2)}</pre>
  <h4>Original Routes config:</h4>
  <pre>${ctx.originalRoutes}</pre>
`;
