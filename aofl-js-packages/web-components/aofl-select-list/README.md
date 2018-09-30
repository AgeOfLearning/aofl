# @aofl/select-list

The **`<aofl-select-list>`** takes any number of **`<aofl-list-option>`**. Selecting any option will give it a selected attribute with value `true`. Selecting an option emits an event with the selected value.

## Examples
* https://stackblitz.com/edit/1-0-0-aofl-select-list?embed=1&file=js/example-component/template.js
* https://stackblitz.com/edit/1-0-0-aofl-select-list-toggle?embed=1&file=js/example-component/template.js
* https://stackblitz.com/edit/1-0-0-aofl-select-list-dynamic?embed=1&file=js/example-component/template.js

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

## attributes

| Attributes | Type    | Default  | Description                      |
|------------|---------|----------|----------------------------------|
| disabled   | String  | `'false'`| Is the list disabled             |

## Events

| Name     | Triggered By   | Description                                       |
|----------|----------------|---------------------------------------------------|
| `change` | updateSelected | Custom event emitted when a new selection is made |

## Slots

| Name | Fallback Content | Description             |
| ---- | ---------------- | ----------------------- |
|      |                  | Elements to be selected |
