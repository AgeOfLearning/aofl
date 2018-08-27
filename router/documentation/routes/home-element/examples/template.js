(context, html) => html`
<p>${context.message}</p>
<p>${context.count}</p>

<button class="button" on-click="${() => context.toggleDrawer()}">toggle</button>

<br>
<link-to href="/examples/">go to example page</link-to>
<p>${context.drawer}</p>
<aofl-drawer opening="ease2-in" closing="ease2-out" open$="${context.drawer}">hello</aofl-drawer>
`;
