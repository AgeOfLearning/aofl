import {html} from '@polymer/lit-element';

export const template = () => html`
<style>
:host {
  display: none;
}

:host([open=true]),
:host(.closing) {
  display: block;
}
</style>
<slot></slot>
`;
