# @aofl/multiselect-list

The **`<aofl-multiselect-list>`** takes any number of **`<aofl-list-option>`**. Selecting any option will give it a selected attribute and add it to the selected array. Selecting an option emits an event with the selected array.

## Examples
* https://stackblitz.com/edit/1-3-0-aofl-multiselect-list?embed=1&file=js/example-component/index.js

## Installation
```bash
npm i -S @aofl/web-components
```

## Usage
```javascript
import '@aofl/web-components/aofl-multiselect-list';
```
```html
<aofl-multiselect-list @change="${(e) => context.updateSelected(e)}">
  <aofl-list-option>1</aofl-list-option>
  <aofl-list-option>2</aofl-list-option>
  <aofl-list-option>3</aofl-list-option>
  <aofl-list-option>4</aofl-list-option>
</aofl-multiselect-list>
```

## Keyboard Interactions

The list options may be focused using both tab/shift-tab, up/down arrows, and mouse hover. Selections may be made with enter or space.

## attributes

| Attributes | Type    | Default  | Description                      |
|------------|---------|----------|----------------------------------|
|            |         |          |                                  |

## Events

| Name     | Triggered By   | Description                                       |
|----------|----------------|---------------------------------------------------|
| `change` | updateSelected | Custom event emitted when a new selection is made |

## Slots

| Name | Fallback Content | Description             |
| ---- | ---------------- | ----------------------- |
|      |                  | Elements to be selected |
