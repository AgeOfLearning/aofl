# @aofl/middleware

Simple base middleware class.

## Installation
```bash
npm i -S @aofl/middleware
```

## Methods

| Name               | Arguments                                       | Description                         |
| ------------------ | ----------------------------------------------- | ----------------------------------- |
| use                | cb[Function], hook[String]                      | Register a middleware               |
| iterateMiddleware  | request[Object], hook[String], response[Object] | Iterate middleware for a given hook |
