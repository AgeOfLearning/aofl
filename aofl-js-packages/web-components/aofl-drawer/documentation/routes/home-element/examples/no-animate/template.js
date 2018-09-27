(context, html) => html`
<button class="button" on-click="${() => context.toggleDrawer()}">toggle</button>
<aofl-drawer open$="${context.drawer}">
  <p>
    hello
  </p>
</aofl-drawer>
`;
