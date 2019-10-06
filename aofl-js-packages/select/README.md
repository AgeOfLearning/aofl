# @aofl/select

## Installation
```bash
npm i -S @aofl/select
```

## <aofl-select-list>
The **`<aofl-select-list>`** takes any number of **`<aofl-list-option>`**. Selecting any option will give it a selected attribute with. Selecting an option emits an event with the selected value.

## Examples
* https://stackblitz.com/edit/1-3-0-aofl-select-list?embed=1&file=js/example-component/index.js
* https://stackblitz.com/edit/1-0-0-aofl-select-list-toggle?embed=1&file=js/example-component/template.js
* https://stackblitz.com/edit/1-0-0-aofl-select-list-dynamic?embed=1&file=js/example-component/template.js


## Usage
```javascript
import '@aofl/select';
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

The list options may be focused using both tab/shift-tab, up/down arrows, and mouse hover. Selections may be made with enter or space.

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

## <aofl-multiselect-list>

The **`<aofl-multiselect-list>`** takes any number of **`<aofl-list-option>`**. Selecting any option will give it a selected attribute and add it to the selected array. Selecting an option emits an event with the selected array.

### Examples
* https://stackblitz.com/edit/1-3-0-aofl-multiselect-list?embed=1&file=js/example-component/index.js

### Usage
```javascript
import '@aofl/select';
```
```html
<aofl-multiselect-list @change="${(e) => context.updateSelected(e)}">
  <aofl-list-option>1</aofl-list-option>
  <aofl-list-option>2</aofl-list-option>
  <aofl-list-option>3</aofl-list-option>
  <aofl-list-option>4</aofl-list-option>
</aofl-multiselect-list>
```

### Keyboard Interactions

The list options may be focused using both tab/shift-tab, up/down arrows, and mouse hover. Selections may be made with enter or space.

### attributes

| Attributes | Type    | Default  | Description                      |
|------------|---------|----------|----------------------------------|
|            |         |          |                                  |

### Events

| Name     | Triggered By   | Description                                       |
|----------|----------------|---------------------------------------------------|
| `change` | updateSelected | Custom event emitted when a new selection is made |

### Slots

| Name | Fallback Content | Description             |
| ---- | ---------------- | ----------------------- |
|      |                  | Elements to be selected |


## <aofl-list-option>

The **`<aofl-list-option>`** is a simple selectable component that takes a value. It typically lives in an **`<aofl-select-list>`** but it can be used in any component where selections are made. It must have a parent with of a component with an addToParent method.

### Examples
* https://stackblitz.com/edit/1-0-0-aofl-select-list?embed=1&file=js/example-component/template.js

### Usage
```javascript
import '@aofl/select';
```
```html
<aofl-select-list @change="${(e) => context.updateSelected(e)}">
  <aofl-list-option>1</aofl-list-option>
  <aofl-list-option>2</aofl-list-option>
  <aofl-list-option>3</aofl-list-option>
  <aofl-list-option>4</aofl-list-option>
</aofl-select-list>
```

### Keyboard Interactions

List options will be focused when hovering over them. Selections may be made with enter or space.

### attributes

| Attributes | Type   | Default   | Description                             |
|------------|--------|-----------|-----------------------------------------|
| selected   | String | `'false'` | Is the option selected?                 |
| disabled   | String | `'false'` | Is the option available to be selected? |
| value      | String |           | Value of the aofl-list-option           |

### Slots

| Name       | Fallback Content | Description                                                                       |
| ---------- | ---------------- | --------------------------------------------------------------------------------- |
|            |                  | Content to be displayed. Defaults as the <br>value if no value attribute provided |

