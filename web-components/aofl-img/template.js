import {html} from '@polymer/lit-element';

export const template = (context) => html`
<style>
:host {
  display: inline-block;
  position: relative;
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  line-height: 0;
}

:host canvas {
  display: block;
  visibility: hidden;
  width: 100%;
}

:host img {
  position: absolute;
  background: #fafafa;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
<canvas width$="${context.width}" height$="${context.height}"></canvas>
<img id="img" alt$="${context.alt}" height$="${context.height}" width$="${context.width}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC">
`;
