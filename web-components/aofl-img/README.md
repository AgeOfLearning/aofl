# @aofl/web-components/aofl-img

`<aofl-img>` embeds an image into the document. It behaves similarly to `<img>` with the addition of lazy loading images as they scroll near the visible area of the screen. The current formula is 2x height or width. In addition to this `<aofl-img>` can be combined with `<aofl-picture>` and `<aofl-source>` to provide different images for different display sizes.


## Installation
```bash
npm i -S @aofl/web-components
```

## Usage
```html
<aofl-img src="path/to/image" width="100" height="100" alt="image description"></aofl-img>
```

## attributes

| Attributes | Type   | Default   | Description                                           |
|------------|--------|-----------|-------------------------------------------------------|
| src        | String | undefined | Image url                                             |
| width      | Number | undefined | Width of image in pixels.                             |
| Height     | Number | undefined | Height of image in pixels.                            |
| alt        | String | undefined | Defines an alternative text description of the image. |


