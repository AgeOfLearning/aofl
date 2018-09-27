(context, html) => html`
<div id="red" on-click="${(e) => context.toggleDrawer(e)}">
  Red
  <aofl-drawer open$="${context.red}">
    <p>
      RED!!!!!
    </p>
  </aofl-drawer>
</div>
<div id="blue" on-click="${(e) => context.toggleDrawer(e)}">
  Blue
  <aofl-drawer open$="${context.blue}">
    <p>
      blue :(
    </p>
  </aofl-drawer>
</div>
`;
