# @aofl/web-components/aofl-picture

`<aofl-picture>` serves as a container for zero or more `<aofl-source>` and one `<aofl-img>` elements to provide versions of an image for different display sizes. Display size specific sources are defined using the media attribute of the `aofl-source` element.

## Examples
* https://stackblitz.com/edit/1-0-0-aofl-picture?embed=1&file=js/example-component/template.js

## Installation
```bash
npm i -S @aofl/web-components
```

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
