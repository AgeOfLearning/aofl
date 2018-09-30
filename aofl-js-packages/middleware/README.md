# @aofl/middleware

Simple base middleware class.

## Examples
* https://stackblitz.com/edit/1-0-0-middleware?embed=1

## Installation
```bash
npm i -S @aofl/middleware
```

## Methods

| Name               | Arguments                                       | Description                         |
| ------------------ | ----------------------------------------------- | ----------------------------------- |
| use                | cb[Function], hook[String]                      | Register a middleware               |
| iterateMiddleware  | request[Object], hook[String], response[Object] | Iterate middleware for a given hook |
