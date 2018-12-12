# @aofl/web-components/aofl-list-option

The **`<aofl-list-option>`** is a simple selectable component that takes a value. It typically lives in an **`<aofl-select-list>`** but it can be used in any component where selections are made. It must have a parent with of a component with an addToParent method.

## Examples
* https://stackblitz.com/edit/1-0-0-aofl-select-list?embed=1&file=js/example-component/template.js

## Installation
```bash
npm i -S @aofl/web-components
```

## Usage
```javascript
import '@aofl/web-components/aofl-select-list';
```
```html
<aofl-select-list @change="${(e) => context.updateSelected(e)}">
  <aofl-list-option>1</aofl-list-option>
  <aofl-list-option>2</aofl-list-option>
  <aofl-list-option>3</aofl-list-option>
  <aofl-list-option>4</aofl-list-option>
</aofl-select-list>
```

## Keyboard Interactions

List options will be focused when hovering over them. Selections may be made with enter or space.

## attributes

| Attributes | Type   | Default   | Description                             |
|------------|--------|-----------|-----------------------------------------|
| selected   | String | `'false'` | Is the option selected?                 |
| disabled   | String | `'false'` | Is the option available to be selected? |
| value      | String |           | Value of the aofl-list-option           |

## Events

none

## Slots

| Name       | Fallback Content | Description                                                                       |
| ---------- | ---------------- | --------------------------------------------------------------------------------- |
|            |                  | Content to be displayed. Defaults as the <br>value if no value attribute provided |

