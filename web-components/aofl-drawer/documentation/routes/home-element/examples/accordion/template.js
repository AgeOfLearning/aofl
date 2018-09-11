(context, html) => html`
<button id="red" class="button" on-click="${(e) => context.toggleDrawer(e)}">RED</button>
<button id="blue" class="button" on-click="${(e) => context.toggleDrawer(e)}">BLUE</button>
<aofl-drawer open$="${context.red}">
  <p>
    RED!!!!!
  </p>
</aofl-drawer>
<aofl-drawer open$="${context.blue}">
  <p>
    blue :(
  </p>
</aofl-drawer>
`;
