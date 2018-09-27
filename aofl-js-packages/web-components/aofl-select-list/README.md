# @aofl/select-list

The **`<aofl-select-list>`** takes any number of **`<aofl-list-option>`**. Selecting any option will give it a selected attribute with value `true`. Selecting an option emits an event with the selected value.

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
