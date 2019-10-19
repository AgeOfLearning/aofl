# @aofl/drawer

The **`<aofl-drawer>` element** toggles content between an open and closed state. Opening and closing animations are provided as classes to allow for any possible method of toggling content.

[Api Documentation](https://ageoflearning.github.io/aofl/v3.x/api-docs/module-@aofl_drawer.html)

## Examples
* [no-amination](https://stackblitz.com/edit/1-0-0-drawer-no-animation?embed=1&file=js/example-component/template.js)
* [fade-in](https://stackblitz.com/edit/1-0-0-drawer-fade?embed=1&file=js/example-component/template.js)
* [accordion](https://stackblitz.com/edit/1-0-0-drawer-accordion?embed=1&file=js/example-component/template.js)
* [side-panel](https://stackblitz.com/edit/1-0-0-drawer-side-panel?embed=1&file=js/example-component/template.js)

## Attributes

| Attributes | Type    | Default     | Description                                                  |
|------------|---------|-------------|--------------------------------------------------------------|
| open       | Boolean | `'null'`    | State of content inside drawer                               |
| trigger    | String  | `'animate'` | Classname used to trigger the opening and closing animations |
| opening    | String  |             | Classname of the opening animation                           |
| closing    | String  |             | Classname of the closing animation                           |

## Events

| Name                 | Triggered By                | value                    |
|----------------------|-----------------------------|--------------------------|
| `change`             | animationEnd, transitionEnd | target.open={true,false} |

## Slots

| Name       | Fallback Content | Description                                          |
| ---------- | ---------------- | ---------------------------------------------------- |
|            |                  | The content to be displayed when toggling the drawer |


## Defining animation classes

To animate the drawer 4 css selectors need to be added. Here is an example for a drawer with the following attributes:

`<aofl-drawer opening="ease-in" closing="ease-out" .open="${context.open}"></aofl-drawer>`

```css
.ease-in {
  opacity: 0;
  transition: opacity 1s ease-in;
}

.ease-in.animate {
  opacity: 1;
}

.ease-out {
  opacity: 1;
  transition: opacity .3s ease-out;
}

.ease-out.animate {
  opacity: 0;
}
```


