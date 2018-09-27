# aofl-preview element

The **`<aofl-preview>` element** renders a set of JavaScript, CSS and HTML code to a preview panel and allowes users to interact with the example code and see it render in the preview panel.

## attributes

| Attributes   | Values | Default | Description |
| ------------ | ------ | ------- | ----------- |
| drawer-state | `true` | `false` | `false`     | Specifies whether the code editor dropdown is expanded or closed |
| darkmode     | `true` | `false` | `false`     | Specifies whether the preview panel has a dark background or not |

## Events

none

## Slots

| Name       | Fallback Content | Description                                 |
| ---------- | ---------------- | ------------------------------------------- |
| title      |                  | Specifies the title for the preview element |
| javascript |                  | example JavaScript code                     |
| css        |                  | example CSS code                            |
| htmlmixed  |                  | example template code                       |

## Properties

none

## Methods

| Name | Attributes | Description                  |
| ---- | ---------- | ---------------------------- |
| run  |            | Re-evaluate the example code |
