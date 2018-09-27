# @aofl/drawer

The **`<aofl-drawer>` element** toggles content between an open and closed state. Opening and closing animations are provided as classes to allow for any possible method of toggling content.

## Attributes

| Attributes | Type    | Default     | Description                                                  |
|------------|---------|-------------|--------------------------------------------------------------|
| open       | String  | `'false'`     | State of content inside drawer                               |
| trigger    | String  | `'animate'` | Classname used to trigger the opening and closing animations |
| opening    | String  |             | Classname of the opening animation                           |
| closing    | String  |             | Classname of the closing animation                           |

## Events

| Name                 | Triggered By                | Detail               |
|----------------------|-----------------------------|----------------------|
| `aofl-drawer-change` | animationEnd, transitionEnd | `'open'`, `'closed'` |

## Slots

| Name       | Fallback Content | Description                                          |
| ---------- | ---------------- | ---------------------------------------------------- |
|            |                  | The content to be displayed when toggling the drawer |


## Defining animation classes

To animate the drawer 4 css selectors need to be added. Here is an example for a drawer with the following attributes:

`<aofl-drawer opening="ease-in" closing="ease-out" open$="${context.drawerState}"></aofl-drawer>`
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


