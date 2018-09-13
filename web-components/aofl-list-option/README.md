# @aofl/web-components/aofl-list-option

The **`<aofl-list-option>`** is a simple selectable component that takes a value. It typically lives in an **`<aofl-select-list>`** but it can be used in any component where selections are made. It must have a parent with of a component with an addToParent method.

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

