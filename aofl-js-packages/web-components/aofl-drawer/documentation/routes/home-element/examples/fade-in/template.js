(context, html) => html`
<button class="button" on-click="${() => context.toggleDrawer()}">toggle</button>
<aofl-drawer opening="ease-in" closing="ease-out" open$="${context.drawer}">
  <p>
    hello
  </p>
</aofl-drawer>
`;
