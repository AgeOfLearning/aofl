# Web Components, lit-element & lit-html

AofL JS follows the [Web Components Concepts](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

> Web Components is a suite of different technologies allowing you to create reusable custom elements — with their functionality encapsulated away from the rest of your code — and utilize them in your web apps.

All components in AofL JS are extended from the AoflElement base class. This class extends LitElement and overrides the render function to take a template function and an array of styles as its parameters. We've made this change to ensure we can keep templates, styles and component classes separate. Moreover, in case of the i18nMixin, it is very useful to be able to render alternate templates based on the locale.

We chose LitElement as it checks all our requirements for a web components base class.
> LitElement is a simple base class for creating fast, lightweight web components that work in any web page with any framework.



The only other production dependcy of AofL JS comes with LitElement as it uses lit-html- a fast HTML templating library.

> It focuses on one thing and one thing only: efficiently creating and updating DOM.

## References
We recommend all developers to familiarize themselves with the material coverd in the following pages.

* [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
* [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
* [LitElement](https://lit-element.polymer-project.org/)
* [lit-html](https://lit-html.polymer-project.org/)
