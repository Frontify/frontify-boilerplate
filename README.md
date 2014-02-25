# Frontify Boilerplate

> Framework for your simple, maintainable & super-fast front-end application

[![Build Status](https://travis-ci.org/Frontify/frontify-boilerplate.png?branch=master)](https://travis-ci.org/Frontify/frontify-boilerplate)

## Goals

* Complete front-end/back-end separation
* Small footprint
* Minimal production dependencies
* Maintainability through a component system for HTML/CSS/JS (with naming conventions)
* Declarative View/Layout through json configuration
* Built-in CSS pre-compiler support
* Auto-compilation on changes
* Simple and fast development environment
* Minimal deployment bundle for production (static files)
* Optimized resources for production (concatenated, minified)
* Multi-language support
* Extensible
* Fast!

## Prerequisites

> The following requirements are only needed for development.

* [Node](http://nodejs.org)
* [Grunt](http://gruntjs.com/getting-started)

## What's included

### JavaScript

* [JQuery](http://jquery.org) (Framework)
* [TerrificJS](http://terrifically.org) (Modularization)
* [doT.js](http://olado.github.io/doT/index.html) (Templating)
* [path.js](https://github.com/mtrpcic/pathjs) (Routing)

### CSS

* [LESS](http://lesscss.org) (Pre-Compiler)
* [YUI CSS Reset](http://yuilibrary.com/yui/docs/cssreset/) (Cross-Browser Style Reset)

## Getting started

This application uses [grunt](http://gruntjs.com/) to build it's components and run itself. If you haven't used [grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide. Once you're familiar with that process, run the application with the command:

```shell
grunt app
```

This command generates all resources needed by the front-end and runs it within a node server. You don't have to install an additional webserver. The script opens up your default browser on

```
http://localhost:3000/#/
```

> Notice: You are not limited to a node server. You can run the application on every webserver.

## Distribution

To prepare your application for deployment, run the following command to create a zip package `dist/application.zip` with all resources and assets needed for deployment on a webserver.

```shell
grunt dist
```

## Pre-Compilation, Concatenation & Minification

> Normally, the following tasks do not need to be run manually, because of the watch tasks.

Compiles all `*.less` files as combined css.

```shell
grunt less
```

Concatenate all javascript files and build combined files with the `concat` task.

```shell
grunt concat
```

Minify all javascript files using the `uglify` task.

```shell
grunt uglify
```

Minify all css files using the `cssmin` task.

```shell
grunt cssmin
```

## Modules

Each component or block of the UI is called module. Examples are `Logo` or `Navigation`. These modules are located in the `app/modules` directory and they contain all their relevant `*.html`, `*.css/*.less` and `*.js` files. This separates the code in a maintainable way, even for very large applications.

### HTML Skeleton

All `.html` files are handled as [doT](http://olado.github.io/doT/index.html) templates (open-source javascript template engine). Read more about the syntax in the [documentation](http://olado.github.io/doT/index.html).

```html
<div class="mod mod-example"></div>
```

### CSS/LESS Skeleton

Here's an example of such a module css snippet. Placed as `app/modules/Example/css/example.less`. You can use [LESS](http://lesscss.org/) syntax to make use of mixins, variables & other pre-compilation features. Read the [documentation](http://lesscss.org/features/) for more information on the syntax.

> Be sure to use prefix .mod-modulename for every rule. Scoping is important for maintainable code.

```css
@import "variables.less";

.mod-example { }
```

### Javascript Skeleton

You can write vanilla javascript or you can create modules (recommended), a concept introduced by the open-source library [Terrific.js](https://terrifically.org). Read more about the usage and features in the [documentation](https://terrifically.org/api). Modules are great for writing small pieces of maintainable javascript code scoped on the actual module, rather than on the whole application.

Here's an example of such a module javascript snippet. Placed as `app/modules/Example/js/example.js`

```javascript
(function($) {
  Tc.Module.Example = Tc.Module.extend({
    on: function(callback) {
        // your bindings here (e.g. onclick, etc.)
        callback();
    },
    after: function() { 
        // your module code here (e.g. AJAX calls, etc.)
    }
  });
})(Tc.$);
```

## Views

The application views are configured within `app/api/app/views.json`.

Here's an example of a view configuration.

```json
{ 
    "id": 1,
    "route": "/example",
    "title": "Example",
    "layout": "default",
    "modules": {
        "header": [ "logo", "navigation" ],
        "content": [],
        "footer": [ "footer" ]
    }
}
```

## Layouts

All layouts are located in `app/modules/Layout`. Each layout defines regions with `data-region` attributes. They are filled with the modules configured in the corresponding view, as seen above.

Here's an example of the default layout markup (`app/modules/Layout/layout-default.html`).

```html
<header data-region="header"></header>
<div data-region="content"></div>
<footer data-region="footer"></footer>
```

## Translations

### Extract localized strings

Extracts all strings within elements with a `data-localize` attribute and generates json files with the extracted strings to `/build/js/locales`.

```shell
grunt locales:update
```

Here's an example markup with a localized string

```html
<div data-localize>Example</div>
```

### Build locales javascript files

Generates reusable javascript files for every locale and writes them to `app/assets/dist/js/locales`.

```shell
grunt locales:build
```

### Export CSV data

```shell
grunt locales:export
```

### Import CSV data

```shell
grunt locales:import
```

## Watcher

All compilations needed for run-time are done automatically on file changes. Sometimes it's needed to run `grunt app` to get freshly compiled files.

## Build

### JavaScript

The JavaScript build generates two concatenated `*.js files.

* `app/assets/dist/js/application-core.min.js` Minified version of javascript libraries
* `app/assets/dist/js/application.min.js` Minified version of application-specific javascript

> In addition, there are some language specific javascript files generated.

### CSS

* `app/assets/dist/css/application.min.css` Minified version of application-specific css

## Compatibility

The framework is intended to be compatible with all major browsers, including IE7+.

## Credits

Built by Roger Dudler @ [Frontify](https://frontify.com)
