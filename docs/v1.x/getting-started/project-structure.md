# Project Structure

Now that you have [installed](getting-started/installation.md) the starter app let's take a look at the directory structure.

# starter-app directory structure

```bash
~project_root
├── __config # Project Config (mostly build)
│   ├── ...
│   └── webpack.common.js
├── modules # main bundle includes shared code between all routes and templates
│   ├── __config # Application level config)
│   ├── app
│   ├── router-view-element
│   ├── link-to-element
│   ├── router-instance
│   └── index.js # entry point to the app
├── routes # routes folder
│   ├── home
│   │   ├── modules # route specific components
│   │   │   ├── home-footer-element
│   │   │   ├── home-header-element
│   │   │   └── home-page-sdo
│   │   ├── index.js
│   │   ├── template.css
│   │   └── template.js
│   └── login
│       └── ...
├── templates # templates folder
│   └── main
│       ├── css
│       ├── modules # template specific components
│       └── template.ejs
└── ... # other config files
```

There are 3 main directories in the root of the project modules, template, and routes. This is different from most other frameworks, even outside the realm of JavaScript, most frameworks organize files by functionality. It is common to see some variation of view, model, and controller directories. The issue we've had with this structure is that as the application grows large it gets harder to maintain the code. When you update a controller you have to look for the corresponding view and model in other directories. We prefer a flat directory structure where files are name-spaced via the directory name, not functionality. All necessary files constructing a module are placed within the "modules" directory. You can read more about our naming conventions in the [Coding Standards](housekeeping/coding-standards.md) section.

The `routes` and `templates` directories are pretty self explanatory You can checkout the [`@aofl/templating-plugin`](https://www.npmjs.com/package/@aofl/templating-plugin) documentation for more detail.

The modules directory hosts all JavaScript classes, services, web components, ... Historically, this was the `js` directory of the project but it contained other file types. The `modules` directory houses the locally developed modules/packages and the `node_modules` directory houses packages installed from npm. In addition to these directories the `@aofl/cli` tool allow you to source `node_modules` into `node_modules_sourced` so you can work on npm modules withing your project. Check the [CLI Documentation](https://www.npmjs.com/package/@aofl/cli) for more detail.

_There can be a modules directories in different levels of the project. The placement of the modules directory indicates the scope (project, template, and route) of the modules._
