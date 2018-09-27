(context, html) => html`
<p>user2 === user <code>${context.user2 === context.user}</code></p>
<p>user2.account === user.account <code>${context.user2.account === context.user.account}</code></p>
<p>user2.preferences === user.preferences <code>${context.user2.preferences === context.user.preferences}</code></p>

`;
