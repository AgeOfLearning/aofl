export default (context, html) => html`
  <form @submit="${(e) => context.submit(e)}">
    <label>username</label>
    <input value="${context.username}" @input="${(e) => context.usernameChanged(e)}">

    ${!context.form.username.required.valid? html`<p class="error-message">Username required.</p>`: ``}
    ${!context.form.username.minLength.valid? html`<p class="error-message">Username must be 4 charachters.</p>`: ``}

    <label>password</label>
    <input value="${context.password}" @input="${(e) => context.passwordChanged(e)}">
    ${context.form.password.observed && !context.form.password.required.valid? html`<p class="error-message">password required.</p>`: ``}
    ${context.form.password.observed && !context.form.password.minLength.valid? html`<p class="error-message">password must be 8 charachters.</p>`: ``}
    ${context.form.password.observed && !context.form.password.alpha.valid? html`<p class="error-message">password must contain letters and numbers</p>`: ``}

    <input type="submit" value="Submit" ?disabled="${context.form.pending}"">
  </form>
  <pre>${JSON.stringify(context.form, ['valid', 'pending', 'observed', 'username', 'password'], 2)}</pre>
`;
