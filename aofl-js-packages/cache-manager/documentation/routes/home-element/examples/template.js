(context, html) => html`
<form on-submit="${(e) => context.submitted(e)}">
  <input type="text" name="key" placeholder="key">
  <input type="text" name="value" placeholder="value">
  <input type="submit" value="Insert">
</form>

<pre>${JSON.stringify(context.data, null, 2)}</pre>
`;
