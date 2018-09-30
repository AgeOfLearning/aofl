# @aofl/web-components/aofl-source

AoflSource component must be used as a child of aofl-picture and specifies images for different media queries.

## Examples
* https://stackblitz.com/edit/1-0-0-aofl-picture?embed=1&file=js/example-component/template.js

## Installation
```bash
npm i -S @aofl/webcomponents
```

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
