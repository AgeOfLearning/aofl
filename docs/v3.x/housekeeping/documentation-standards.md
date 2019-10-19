# Documentation Standards

When building apps for AofL JS we encourage the community toadhere to specific guidelines. The intention of creating documentation standard is to be able to document our code in a consistent and meaningful manner regardless of who wrote it, thereby increasing support and understanding of code within our technology portfolio.

Our documentation standard has been designed to use tools and techniques which allow us to meet these goals and additionally automate the publishing of documentation to technology portfolio code documentation library.

---

AofL JS follows the [JSDoc3][jsdoc] standards.

## What should be documented?

JavaScript documentation takes the form of either formatted blocks of documentation (docBlock) or inline comments. DocBlocks are parsed by documentation generators and should be reserved for this purpose only. Using slashes for comments, whether single or multi-line, would ensure separation of concerns between API documentation and code level comments.

AofL JS Standards Document defines rules that encourages a self-documenting codebase. Naming conventions and structured programming conventions are examples of such rules. When these rules are followed we can minimize the amount of in-line documentation.

Consider the following blocks of code:

```javascript
if ((pos.left <= window.X && pos.left + offsetWidth > window.X) ||
  (pos.left >= window.x && pos.left <= window.x + window.width)) &&
  ((pos.top <= window.y && pos.top + offsetHeight > window.y) ||
  (pos.top  >= window. && pos.top  <= window.y + window.height))) { // check if pos is within the visible area
  …
}
```

```javascript
let withinVisibleAreaOfWindow = (pos.left <= window.X && pos.left + offsetWidth > window.X) ||
  (pos.left >= window.x && pos.left <= window.x + window.width)) &&
  ((pos.top <= window.y && pos.top + offsetHeight > window.y) ||
  (pos.top  >= window. && pos.top  <= window.y + window.height));

if (withinVisibleAreaOfWindow) {
  …
}
```

Block 1 requires an inline comment explaining what the if statement is evaluating. In contrast, Block 2 is self-documenting and by using a descriptive variable name we have eliminated the need to add extra comments.

The following is a list of what should be documented.

- File headers
- Functions and class methods
- Objects
- Closures
- Events

## Documenting Tips

**Language**

Short descriptions should be clear, simple, and brief. Document "what" and "when" – "why" should rarely need to be included. Functions and closures are third-person singular elements, meaning third-person singular verbs should be used to describe what each does.

- Good: Handles a click on X element.
- Bad: Included for back-compat for X element.

**Grammar**

Descriptive elements should be written as complete sentences. The one exception to this standard is file header summaries, which are intended as file "titles" more than sentences.

The serial (Oxford) comma should be used when listing elements in summaries, descriptions, and parameter or returns descriptions.

## File Headers

The file header block provides a description for a file. All Age of Learning JavaScript files should contain the header block.

The following properties should be used when documenting files. Some of these rules may apply to every file. For example, @requires is only valid when the file requires another module. Other properties from the list of Supported JSDoc Tags can be used when doing so will result in generating better documentation.

- [Long Description][description]
- [@summary][summary]
- [@version][version]
- [@since][since]
- [@author][author]
- [@requires][requires]

```javascript
/**
 *
 * The long description of the file's purpose goes here and
 * describes in detail the complete functionality of the file.
 * This description can span several lines and ends with a period.
 *
 * @summary A short description
 * @version 1.0
 * @since 0.5
 * @author John Doe <john.doe@example.org>
 *         Jane Doe jane.doe@example.org
 * @requires my-other-module.js
 */
```

## Classes

- [Long Description][description]
- [@summary][summary]
- [@extends][extends]

## Functions and Class Methods

- [Long Description][description]
- [@summary][summary]
- [@deprecated][deprecated]
- [@since][since]
- [@access][access]
- [@augments][augments]
- [@mixes][mixes]
- [@static][static]
- [@see][see]
- [@fires][fires]
- [@listens][listens]
- [@global][global]
- [@param][param]
- [@return][return]

_note: not all properties will apply to functions all the time. Include as many as apply to your situation and feel free to include other tags from the list of Supported JSDoc Tags._

```javascript
/**
 * @summary Short description. (use period)
 *
 * Long. (use period)
 *
 * @since x.x.x
 * @deprecated x.x.x Use new_function_name() instead.
 * @access private
 *
 * @class
 * @augments superclass
 * @mixes mixin
 *
 * @see Function/class relied on
 * @global type $varname Short description.
 * @fires target:event
 * @listens target:event
 *
 * @param type $var Description.
 * @param type $var Optional. Description.
 * @return type Description.
 */
```

## Supported JSDoc Tags

| Tag                         | Description                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| [@abstract][abstract]       | This method can be implemented (or overridden) by the inheritor.                            |
| [@access][access]           | Specify the access level of this member (private, public, or protected).                    |
| [@alias][alias]             | Treat a member as if it had a different name.                                               |
| [@augments][augments]       | This class inherits from a parent class.                                                    |
| [@author][author]           | Identify the author of an item.                                                             |
| [@borrows][borrows]         | This object uses something from another object.                                             |
| [@callback][callback]       | Document a callback function.                                                               |
| [@class][class]             | This function is a class constructor.                                                       |
| [@classdesc][classdesc]     | Use the following text to describe the entire class.                                        |
| [@constant][constant]       | Document an object as a constant.                                                           |
| [@constructs][constructs]   | This function member will be the constructor for the previous class.                        |
| [@copyright][copyright]     | Document some copyright information.                                                        |
| [@default][default]         | Document the default value.                                                                 |
| [@deprecated][deprecated]   | Document that this is no longer the preferred way.                                          |
| [@description][description] | Describe a symbol.                                                                          |
| [@enum][enum]               | Document a collection of related properties.                                                |
| [@event][event]             | Document an event.                                                                          |
| [@example][example]         | Provide an example of how to use a documented item.                                         |
| [@exports][exports]         | Identify the member that is exported by a JavaScript module.                                |
| [@external][external]       | Document an external class/namespace/module.                                                |
| [@file][file]               | Describe a file.                                                                            |
| [@fires][fires]             | Describe the events this method may fire.                                                   |
| [@function][function]       | Describe a function or method.                                                              |
| [@global][global]           | Document a global object.                                                                   |
| [@ignore][ignore]           | Remove this from the final output.                                                          |
| [@inner][inner]             | Document an inner object                                                                    |
| [@instance][instance]       | Document an instance member.                                                                |
| [@kind][kind]               | What kind of symbol is this?                                                                |
| [@lends][lends]             | Document properties on an object literal as if they belonged to a symbol with a given name. |
| [@license][license]         | Document the software license that applies to this code.                                    |
| [@link][link]               | Inline tag – create a link.                                                                 |
| [@listens][listens]         | Indicates that a symbol listens for a specified event                                       |
| [@member][member]           | Document a member.                                                                          |
| [@memberof][memberof]       | This symbol belongs to a parent symbol.                                                     |
| [@mixes][mixes]             | This object mixes in all the members from another object.                                   |
| [@mixin][mixin]             | Document a mixin object.                                                                    |
| [@module][module]           | Document a JavaScript module.                                                               |
| [@name][name]               | Document the name of an object.                                                             |
| [@namespace][namespace]     | Document a namespace object.                                                                |
| [@param][param]             | Document the parameter to a function.                                                       |
| [@private][private]         | This symbol is meant to be private.                                                         |
| [@property][property]       | Document a property of an object.                                                           |
| [@protected][protected]     | This member is meant to be protected.                                                       |
| [@public][public]           | This symbol is meant to be public.                                                          |
| [@readonly][readonly]       | This symbol is meant to be read-only.                                                       |
| [@requires][requires]       | This file requires a JavaScript module.                                                     |
| [@return][return]           | Document the return value of a function.                                                    |
| [@see][see]                 | Refer to some other documentation for more information.                                     |
| [@since][since]             | When was this feature added?                                                                |
| [@static][static]           | Document a static member.                                                                   |
| [@summary][summary]         | A shorter version of the full description.                                                  |
| [@this][this]               | What does the ‘this’ keyword refer to here?                                                 |
| [@throws][throws]           | Describe what errors could be thrown.                                                       |
| [@todo][todo]               | Document tasks to be completed.                                                             |
| [@tutorial][tutorial]       | Insert a link to an included tutorial file.                                                 |
| [@type][type]               | Document the type of an object.                                                             |
| [@typedef][typedef]         | Document a custom type.                                                                     |
| [@variation][variation]     | Distinguish different objects with the same name.                                           |
| [@version][version]         | Documents the version number of an item.                                                    |

## Unsupported JSDoc Tags

| Tag           | Why it’s not supported                                           |
| ------------- | ---------------------------------------------------------------- |
| @virtual      | An unsupported synonym. Use [@abstract][abstract] instead.       |
| @constructor  | An unsupported synonym. Use [@class][class] instead.             |
| @const        | An unsupported synonym. Use [@constant][constant] instead.       |
| @defaultvalue | An unsupported synonym. Use [@default][default] instead.         |
| @desc         | An unsupported synonym. Use [@description][description] instead. |
| @host         | An unsupported synonym. Use [@external][external] instead.       |
| @fileoverview | An unsupported synonym. Use [@file][file] instead.               |
| @overview     | An unsupported synonym. Use [@file][file] instead.               |
| @emits        | An unsupported synonym. Use [@fires][fires] instead.             |
| @func         | An unsupported synonym. Use [@function][function] instead.       |
| @method       | An unsupported synonym. Use [@function][function] instead.       |
| @var          | An unsupported synonym. Use [@member][member] instead.           |
| @arg          | An unsupported synonym. Use [@param][param] instead.             |
| @argument     | An unsupported synonym. Use [@param][param] instead.             |
| @prop         | An unsupported synonym. Use [@property][property] instead.       |
| @exception    | An unsupported synonym. Use [@throws][throws] instead.           |

[abstract]: http://usejsdoc.org/tags-abstract.html
[access]: http://usejsdoc.org/tags-access.html
[alias]: http://usejsdoc.org/tags-alias.html
[augments]: http://usejsdoc.org/tags-augments.html
[author]: http://usejsdoc.org/tags-author.html
[borrows]: http://usejsdoc.org/tags-borrows.html
[callback]: http://usejsdoc.org/tags-callback.html
[class]: http://usejsdoc.org/tags-class.html
[classdesc]: http://usejsdoc.org/tags-classdesc.html
[constant]: http://usejsdoc.org/tags-constant.html
[constructs]: http://usejsdoc.org/tags-constructs.html
[copyright]: http://usejsdoc.org/tags-copyright.html
[default]: http://usejsdoc.org/tags-default.html
[deprecated]: http://usejsdoc.org/tags-deprecated.html
[description]: http://usejsdoc.org/tags-description.html
[enum]: http://usejsdoc.org/tags-enum.html
[event]: http://usejsdoc.org/tags-event.html
[example]: http://usejsdoc.org/tags-example.html
[exports]: http://usejsdoc.org/tags-exports.html
[external]: http://usejsdoc.org/tags-external.html
[file]: http://usejsdoc.org/tags-file.html
[fires]: http://usejsdoc.org/tags-fires.html
[function]: http://usejsdoc.org/tags-function.html
[global]: http://usejsdoc.org/tags-global.html
[ignore]: http://usejsdoc.org/tags-ignore.html
[inner]: http://usejsdoc.org/tags-inner.html
[instance]: http://usejsdoc.org/tags-instance.html
[kind]: http://usejsdoc.org/tags-kind.html
[lends]: http://usejsdoc.org/tags-lends.html
[license]: http://usejsdoc.org/tags-license.html
[link]: http://usejsdoc.org/tags-link.html
[listens]: http://usejsdoc.org/tags-listens.html
[member]: http://usejsdoc.org/tags-member.html
[memberof]: http://usejsdoc.org/tags-memberof.html
[mixes]: http://usejsdoc.org/tags-mixes.html
[mixin]: http://usejsdoc.org/tags-mixin.html
[module]: http://usejsdoc.org/tags-module.html
[name]: http://usejsdoc.org/tags-name.html
[namespace]: http://usejsdoc.org/tags-namespace.html
[param]: http://usejsdoc.org/tags-param.html
[private]: http://usejsdoc.org/tags-private.html
[property]: http://usejsdoc.org/tags-property.html
[protected]: http://usejsdoc.org/tags-protected.html
[public]: http://usejsdoc.org/tags-public.html
[readonly]: http://usejsdoc.org/tags-readonly.html
[requires]: http://usejsdoc.org/tags-requires.html
[return]: http://usejsdoc.org/tags-return.html
[see]: http://usejsdoc.org/tags-see.html
[since]: http://usejsdoc.org/tags-since.html
[static]: http://usejsdoc.org/tags-static.html
[summary]: http://usejsdoc.org/tags-summary.html
[this]: http://usejsdoc.org/tags-this.html
[throws]: http://usejsdoc.org/tags-throws.html
[todo]: http://usejsdoc.org/tags-todo.html
[tutorial]: http://usejsdoc.org/tags-tutorial.html
[type]: http://usejsdoc.org/tags-type.html
[typedef]: http://usejsdoc.org/tags-typedef.html
[variation]: http://usejsdoc.org/tags-variation.html
[version]: http://usejsdoc.org/tags-version.html
[jsdoc]: http://usejsdoc.org/index.html
