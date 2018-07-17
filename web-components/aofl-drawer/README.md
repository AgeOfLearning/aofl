# Aofl-drawer
A simple LitElement component that toggles between open and closed.

## Attributes

*Required*
- {Boolean} open - state of drawer

*Optional*
- {String} trigger=animate - className that triggers the start of the animation
- {String} opening - opening animation className
- {String} closing - closing animation className


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

## Events

Aofl-drawer dispatches a customEvent 'aofl-drawer-state' after toggling