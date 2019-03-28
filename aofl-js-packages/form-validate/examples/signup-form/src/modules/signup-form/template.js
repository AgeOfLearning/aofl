const ageRanges = ['18-35', '36-55', '56-72', '73+'];

export default (context, html) => html`
<form @submit="${(e) => context.submitForm(e)}">
  <label>Username <small>try (micah, micahblu, mblu)</small></label>
  <input type="text" autocomplete="off" name="username" .value="${context.username}" @input="${(e) => context.updateValue('username', e.target.value) }" />
  ${context.form.username.pending ? html`<p class="green">Checking name availability...</p>` : ''}
  ${!context.form.username.required.valid? html`<p class="error">*Username is a required field.</p>`: ''}
  ${!context.form.username.isAvailable.valid? html`<p class="error">That username is taken.</p>`: ''}
  ${!context.form.username.validName.valid? html`<p class="error">Username must be between 8-12 alphanumeric characters.</p>`: ''}

  <label>Email</label>
  <input type="text" autocomplete="off" name="email" .value="${context.email}" @input="${(e) => context.updateValue('email', e.target.value) }" />
  ${!context.form.email.required.valid ? html`<p class="error">*Email is a required field.</p>` : ''}
  ${!context.form.email.isValidEmail.valid ? html`<p class="error">Please enter a valid email.</p>` : ''}

  <label>Age range</label>
  <select name="age-list" @change="${(e) => context.updateValue('ageRange', e.target.value) }">
    <option value="">Select an age range</option>
    ${ageRanges.map((range) => {
    return html`<option .value="${range}" .selected="${context.ageRange === range}">${range}</option>`;
  })}
  </select>
  ${!context.form.ageRange.required.valid ? html`<p class="error">*Age range is a required field.</p>` : ''}

  <label>Password</label>
  <input type="password" name="password" @input="${(e) => context.updateValue('password', e.target.value) }" />
  ${!context.form.password.required.valid ? html`<p class="error">*Password is a required field.</p>` : ''}
  ${!context.form.password.ofLength.valid ? html`<p class="error">Password should be between 10 and 15 characters</p>` : ''}
  ${!context.form.password.isValid.valid ? html`<p class="error">Password can only contain numbers, letters and %!# characters</p>` : ''}

  <input type="submit" value="Submit" .disabled="${!context.form.valid || context.form.pending}">
</form>

<pre>${JSON.stringify(context.form, ['valid', 'pending', 'observed', 'username', 'email', 'ageRanges', 'password'], 2)}</pre>
`;
