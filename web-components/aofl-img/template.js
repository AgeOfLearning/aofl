export const template = (context, html) => html`
<style>
:host {
  display: inline-block;
  position: relative;
  line-height: 0;
}

:host canvas {
  width: 100%;
  height: 100%;
}

:host img {
  display: inline-block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<canvas width$="${context.width}" height$="${context.height}"></canvas>

<img alt$="${context.alt}" height$="${context.height}" width$="${context.width}" src$="${context.imgSrc}" on-load="${(e) => context.imageLoaded(e)}">
`;
