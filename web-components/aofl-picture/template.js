import {html} from '@polymer/lit-element';

export const template = (context) => html`
<style>
:host {
  display: inline-block;
  line-height: 0;
}
</style>
<slot></slot>
`;
