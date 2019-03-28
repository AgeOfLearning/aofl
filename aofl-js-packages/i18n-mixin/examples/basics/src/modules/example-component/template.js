import {until} from 'lit-html/directives/until';

export default (ctx, html) => html`
<h1>${until(ctx.__('<tt-1>', 'Greeting and salutations!'))}</h1>
<blockquote><small>Full string translation <code>ctx.__()</code></small></blockquote>

<hr>
<p>${until(ctx._r(ctx.__('<tt-2>', 'You are logged in as %r1%'), ctx.user))}</p>
<blockquote><small>Translation with variable replacement <code>ctx._r()</code>. Here Mike is a variable.</small></blockquote>

<hr>
<p>${until(ctx._r(
    ctx._c('<tt-3>', 'You have %c1%', {
      '0': 'No Messages',
      '1': '1 message',
      '%other%': '%r1% messages'
    }, ctx.messageCount),
    ctx.messageCount))}</p>
<blockquote><small>Contditional translation <code>ctx._c()</code> and variable replacement <code>ctx._r()</code>.</small></blockquote>
<button @click="${(e) => ctx.incrementMessages(e)}">Increment Messages</button>
<button @click="${(e) => ctx.decrementMessages(e)}">Decrement Messages</button>
<hr>

<button @click="${(e) => ctx.toggleLanguage(e)}">Toggle Language</button>
`;
