# Introduction

> TL;DR
>
> AofL JS defines standards and conventions for developing web applications. It's built on top of Web Components and comes with a set of components, services, and development tools to make life easier.
> v4.x focuses on developer experience and fast development builds.

AofL JS is different from other frameworks in that it really is just a set of standards and conventions based on our approach to web application development. We believe in utilizing the ecosystem to its fullest potential and we encourage developers to learn web technologies (JavaScript, HTML, and CSS), as the browser manufactures intended. It goes without saying that no one framework/technique will cover all your use cases and you should use the right tool for the right job.

AofL JS comes with a set of essential JavaScript libraries (router, data store, ...), awesome build tools and in its core uses Web Components to create user interfaces. We prefer you to use the services and components we provide in the aofl repo and contribute to this project and help us improve our system. However, we try not to make any assumptions about your application and you can replace any of the available components with other libraries if your application will benefit from doing so.

A lot of the components found in the aofl repo have been part of our production code in one way or another for quite some time (4-5 years in some cases.) For inclusion in AofL JS, we have taken these components, boiled them down to their purest form and extracted all business logic out of them. For example, the router is composed of an instance of the middleware class, a few built-in middleware functions (e.g. match-route) and a "navigate" function. The app developer is expected to define middleware functions to handle the 404 page, and protected pages, in addition to any redirect logic.

AofL JS comes with a CLI tool to bootstrap a new application, scaffold components, it also provides a workflow to update npm modules :bowtie:, and generate the i18n manifest. It uses babel/webpack for transpiling/bundling and supports all modern browsers and IE 11. The initial setup of an AofL JS app contains web-component support, normalize.css, a basic app template and routing for ~20kb gz. That's 20kb for the JS, CSS, and HTML combined :smiley:

Here's more detail about our fundamental requirements and how we achieved them...

##### Small download size

The AofL JS architecture philosophy is meeting complex requirements through the composition of simple building blocks. A building block is the purest set of functionality a feature can be reduced to. We can create many complex components by composing just a few simple ones. Consider aofl-drawer, we defined a drawer as a content box that has 2 states visible and hidden. Moreover, it can be programmed to animate when opening or closing. With this component, we can create side-panels, popups, dropdowns, accordions,...

We believe in using the right tool for the right job. We use a mixture of OOP and FP. Composition is preferred but sometimes inheritance is a better solution to the problem we're solving. Check out the [Some notes on architecture](#/v2.x/aofl-js-concepts/architecture-notes) section for more details.

We also try to utilize the ecosystem as much as possible and polyfill, for really just IE11, when necessary. We definitely prefer built-in methods over utility libraries. More on this later.

##### Small number of HTTP requests

This is mostly achieved through webpack config, our templating plugin, routes-loader, and webcomponents-css-loader.

##### Low memory usage and fast render/repaint

We prioritize using built-in features of the browser over utility libraries. We also recommend using faster performing features of the language. E.g. for loops over `Array.prototype.forEach` method.

AoflElement extends lit-element as it checked all our requirements for template rendering and variable binding.

##### Maintainable

Maintainability of a project really depends on the development team. Our goal for this sections is to give you the right tools and set you on the right path from the beginning.

**Coding Standards**

Adhering to specific guidelines will lead to authoring code in a consistent manner regardless of who wrote it. Consistency across the many projects and codebases written in AofL JS will result in an easy to read codebase and consequently reduce the amount of time to debug, add features, and get assistance from others.

**Modular**

Web Components and es-6 classes make it easy to create modular components and create more complex components through composition and mixin patterns.

##### Easy to Learn

With AofL JS we want the developers to really focus on learning and becoming experts in web technologies instead of another framework. This is why we opt'ed for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standards, and rely on the built-in functionality of the browser as much as possible.

##### Unopinionated

We know how absurd it is to say a framework is unopinionated. What we mean by this is that when developing in AofL JS you will not find yourself wrestling the framework to implement features the way you want instead of how the framework expects you to.
