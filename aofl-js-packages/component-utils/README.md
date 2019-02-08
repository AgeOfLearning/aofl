# @aofl/component-utils

A small collection of component utility functions.

## Examples
* [`findParent()`](https://stackblitz.com/edit/1-0-0-component-utils-1?embed=1)

## Installation

```bash
npm i -S @aofl/component-utils
```

## Usage
```javascript
import {findParent} from '@aofl/component-utils';

class MyElement extends AoflELement {
...
connectedCallback() {
    super.connectedCallback();
    this.targetParent = findParent(this, 'addOption'); // register this list option with a parent who supports it
    this.targetParent.addOption(this);
  }
...
```

## Methods
### `traverseParents()`
Finds a parent component which has all the matching attributes

#### Arguments
| Name        | Type        | Description                                      |
|-------------|-------------|--------------------------------------------------|
| node        | HTMLElement | The child component                              |
| ...args     | String      | Attribute names that must be found on the parent |

### `findParent()`
Finds a parent component which matches the method signature provided

#### Arguments
| Name        | Type        | Description                                   |
|-------------|-------------|-----------------------------------------------|
| node        | HTMLElement | The child component                           |
| ...args     | String      | Method names that must be found on the parent |

### `findParentByAttributes()`
Finds a parent component which has all the matching attributes

#### Arguments
| Name        | Type        | Description                                      |
|-------------|-------------|--------------------------------------------------|
| node        | HTMLElement | The child component                              |
| ...args     | String      | Attribute names that must be found on the parent |


### `isInViewport()`
Check whether or not the supplied element is within the visible area of the screen. The threshold values are multipliers of their respective dimension. 0 means the exact viewport dimensions and .5 means viewport + half of viewport.

#### Arguments
| Name            | Type        | Description               |
|-----------------|-------------|---------------------------|
| node            | HTMLElement | target node               |
| widthThreshold  | String      | viewport width multiplier |
| heightThreshold | String      | viewport width multiplier |

### `isInViewportMixin()`
Mixes the superClass with functions necessary to detect if the element is within the visible area of the page.

#### Methods
* `firstWithinViewport()` is invoked when element scrolls into view for the first time.
* `withinViewportUpdated(newValue, oldValue)` withinViewportUpdated() is invoked anytime the element enters or exists the viewport.
* `stopIsInViewportCheck()` when invoked it removes the event listeners and stops invoking the withinViewportUpdated() function. This is useful when we want to disconnect the event listeners and keep the component attached to dom. For example, conside lazy loading images with aofl-img. Once the image is loaded it is no longer necessary to check isInViewStatus.
