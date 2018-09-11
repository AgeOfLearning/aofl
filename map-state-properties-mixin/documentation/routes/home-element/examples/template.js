(context, html) => html`
  <h2>Simple toggle</h2>
  <p>Toggle state: <b>${context.drawer ? 'Visible' : 'Hidden'}</b></p>
  <p>
    <button class="button" on-click="${() => context.toggleDrawer(context.drawer)}">
      ${!context.drawer ? 'Show me' : 'Hide me'}
    </button>
  </p>
  <my-component></my-component>
`;
