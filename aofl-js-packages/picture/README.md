# @aofl/picture

`<aofl-picture>` serves as a container for zero or more `<aofl-source>` and one `<aofl-img>` elements to provide versions of an image for different display sizes. Display size specific sources are defined using the media attribute of the `aofl-source` element.

## Examples
* https://stackblitz.com/edit/1-0-0-aofl-picture?embed=1&file=js/example-component/template.js

## Installation
```bash
npm i -S @aofl/picture
```

## <aofl-picture>

## Usage
```html
<aofl-picture>
  <aofl-source media="(max-width: 320px)" srcset="https://via.placeholder.com/300x150" width="300" height="150"></aofl-source>
  <aofl-source media="(max-width: 500px)" srcset="https://via.placeholder.com/500x250" width="500" height="250"></aofl-source>
  <aofl-source media="(max-width: 700px)" srcset="https://via.placeholder.com/700x350" width="700" height="350"></aofl-source>
  <aofl-img src="https://via.placeholder.com/1000x500" width="1000" height="500"></aofl-img>
</aofl-picture>
```

## Attributes
| Attributes      | Type    | Default | Description                                                                                                                                                              |
|-----------------|---------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| disable-sources | Boolean | false   | disable-sources can be used to deactivate the media query checks when aofl-picture loads. It is useful for cases where the desktop version of the app is not responsive. |


## <aofl-img>
`<aofl-img>` embeds an image into the document. It behaves similarly to `<img>` with the addition of lazy loading images as they scroll near the visible area of the screen. The current formula is 2x height or width. In addition to this `<aofl-img>` can be combined with `<aofl-picture>` and `<aofl-source>` to provide different images for different display sizes.

## Examples
* https://stackblitz.com/edit/1-0-0-aofl-img?embed=1&file=js/example-component/template.js
* https://stackblitz.com/edit/1-0-0-aofl-img-scroll?embed=1&file=js/example-component/template.js

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


## <aofl-source>

AoflSource component must be used as a child of aofl-picture and specifies images for different media queries.

## Examples
* https://stackblitz.com/edit/1-0-0-aofl-picture?embed=1&file=js/example-component/template.js

## Usage
```html
<aofl-picture>
  <aofl-source media="(max-width: 480px)" srcset="path/to/image-480"></aofl-source>
  <aofl-source media="(max-width: 640px)" srcset="path/to/image-640"></aofl-source>
  <aofl-source media="(max-width: 1024px)" srcset="path/to/image-1024"></aofl-source>

  <aofl-img src="path/to/image" width="" height=""></aofl-img>
</aofl-picture>

```

## attributes

| Attributes | Type   | Default | Description                                             |
|------------|--------|---------|---------------------------------------------------------|
| media      | String |         | media query specifying when aofl-source becomes active. |
| srcset     | String |         | Url of the image.                                       |
