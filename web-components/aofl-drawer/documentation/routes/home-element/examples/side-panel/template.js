(context, html) => html`
<button class="button" on-click="${() => context.toggleDrawer()}">toggle</button>
<aofl-drawer opening="slide-open" closing="slide-closed" open$="${context.drawer}">
  <p>
    side panel content
  </p>
</aofl-drawer>
`;
