# grunt locales

> Update, build, import and export locales using grunt.

## Table of contents

- [Getting Started](#getting-started)
- [The locales task](#the-locales-task)
  - [Overview](#overview)
  - [Usage Examples](#usage-examples)
    - [Setup](#setup)
    - [Locales update](#locales-update)
    - [Locales build](#locales-build)
    - [Locales export](#locales-export)
    - [Locales import](#locales-import)
    - [Watch tasks](#watch-tasks)
  - [Options](#options)
    - [options.locales](#optionslocales)
    - [options.localizeAttributes](#optionslocalizeattributes)
    - [options.localeRegExp](#optionslocaleregexp)
    - [options.localePlaceholder](#optionslocaleplaceholder)
    - [options.localeName](#optionslocalename)
    - [options.purgeLocales](#optionspurgelocales)
    - [options.defaultMessagesSource](#optionsdefaultmessagessource)
    - [options.messageFormatFile](#optionsmessageformatfile)
    - [options.localeTemplate](#optionslocaletemplate)
    - [options.htmlmin](#optionshtmlmin)
    - [options.htmlminKeys](#optionshtmlminkeys)
    - [options.jsonSpace](#optionsjsonspace)
    - [options.jsonReplacer](#optionsjsonreplacer)
    - [options.csvEncapsulator](#optionscsvencapsulator)
    - [options.csvDelimiter](#optionscsvdelimiter)
    - [options.csvLineEnd](#optionscsvlineend)
    - [options.csvEscape](#optionscsvescape)
    - [options.csvKeyLabel](#optionscsvkeylabel)
    - [options.urlRegExp](#optionsurlregexp)
- [HTML templates format](#html-templates-format)
  - [Template examples](#template-examples)
- [Translation functions](#translation-functions)
  - [DOM replacement](#dom-replacement)
  - [AngularJS directive](#angularjs-directive)
- [Contributing](#contributing)
- [Release History](#release-history)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-locales --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-locales');
```

## The locales task

### Overview
The goal of this grunt task is to automate localization of HTML templates.

Executing this task parses `localize` attributes in HTML files and collects the parsed locale strings in JSON files for translation. The translated JSON locale files are then compiled into JS locale files which provide a performant way to use the produced translation functions.

The JSON locale files can also be exported and imported to and from a CSV locale file to ease the translation process.

To support translation features like pluralization and gender selection, this project relies on Alex Sexton's [MessageFormat](https://github.com/SlexAxton/messageformat.js) library to parse the locale strings and compile the translation functions.

### Usage Examples

#### Setup
In your project's Gruntfile, add a section named `locales` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  locales: {
    options: {
      locales: ['en_US', 'de_DE']
    },
    update: {
      src: 'templates/**/*.html',
      dest: 'js/locales/{locale}/i18n.json'
    },
    build: {
      src: 'js/locales/**/i18n.json',
      dest: 'js/locales/{locale}/i18n.js'
    },
    'export': {
      src: 'js/locales/**/i18n.json',
      dest: 'js/locales/locales.csv'
    },
    'import': {
      src: 'js/locales/locales.csv',
      dest: 'js/locales/{locale}/i18n.json'
    }
  },
})
```

#### Locales update
Parse the HTML template files and update the JSON locale files:

```sh
grunt locales:update
```

#### Locales build
Parse the JSON locale files and build the JS locale files:

```sh
grunt locales:build
```

#### Locales export
Export the JSON locale files into one CSV export file:

```sh
grunt locales:export
```

#### Locales import
Create (and overwrite) the JSON locale files from the CSV locales file:

```sh
grunt locales:import
```

#### Watch tasks
Install [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) to automatically update and build locales on file changes.

In your project's Gruntfile, add the following to your watch task configuration:

```js
watch: {
  templates: {
    files: 'templates/**/*.html',
    tasks: ['locales:update', 'locales:build'],
    options: {
      spawn: false,
    }
  },
  locales: {
    files: 'js/locales/**/i18n.json',
    tasks: ['locales:build']
  }
}
```

Add the following section to only parse changed HTML templates:

```js
grunt.event.on('watch', function (action, file) {
    grunt.config('locales.update.options.purgeLocales', false);
    grunt.config('locales.update.src', file);
});
```

### Options

#### options.locales
Type: `Array`  
Default value: `['en_US']`

The list of locales you are using for your translation framework.

#### options.localizeAttributes
Type: `Array`  
Default value: `['localize', 'localize-title', 'localize-page-title']`

A list of attributes that are parsed for locale strings in the HTML templates.  
All attributes in this list will also match with attributes of the same name with `data-` prefix.  
If the attribute value is empty and the matched attribute is `localize` or `data-localize`, the parser takes the element HTML content as locale string.

#### options.localeRegExp
Type `RegExp`  
Default value: `/\w+(?=\/[^\/]+$)/`

Matches the locale name in a file path, e.g. `en_US` in `js/locale/en_US/i18n.json`.  
This is used to automatically extract the locale name for the build and export tasks.

#### options.localePlaceholder
Type: `String`  
Default value: `'{locale}'`

The placeholder for the locale name used to create the destination file paths.

#### options.localeName
Type: `String`  
Default value: `'i18n'`

The name of the variable added to the `window` object in the created locale scripts.  
This variable holds the map of translation functions.

#### options.purgeLocales
Type: `Boolean`  
Default value: `true`

If enabled, removes obsolete locale strings from the JSON files.  
This excludes strings parsed from the HTML templates and the default messages.

#### options.defaultMessagesSource
Type: `String|Array`  
Default value: `undefined`

The source filepath(s) to the JSON file(s) with default locale strings not found in the HTML templates.  
Supports filename expansion via [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns).

#### options.messageFormatFile
Type: `String`  
Default value: `__dirname + '/../node_modules/messageformat/locale/{locale}.js'`

The location of the [MessageFormat](https://github.com/SlexAxton/messageformat.js) locale files.

#### options.localeTemplate
Type: `String`  
Default value: `__dirname + '/../i18n.js.tmpl'`

The location of the template file used to render the JS locale files.

#### options.htmlmin
Type: `Object`  
Default value: `{removeComments: true, collapseWhitespace: true}`

Minifies locale strings containing HTML with [html-minifier](https://github.com/kangax/html-minifier), using the given options object.  
Set to `false` to disable HTML minification.

#### options.htmlminKeys
Type: `Boolean`  
Default value: `false`

If enabled, also minifies the parsed keys containing HTML markup.  
This option can be useful if the locales are parsed from the unminified templates, but the templates are later minified using [grunt-contrib-htmlmin](https://github.com/gruntjs/grunt-contrib-htmlmin).

#### options.jsonSpace
Type: `Integer`  
Default value: `2`

The `space` parameter to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) used to render the JSON locale files.

#### options.jsonReplacer
Type: `function|Array`  
Default value: `undefined`

The `replacer` parameter to [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) used to render the JSON locale files.

#### options.csvEncapsulator
Type: `String`  
Default value: `'"'`

The string encapsulator character(s) used for the CSV export.

#### options.csvDelimiter
Type: `String`  
Default value: `','`

The table cell delimiter character(s) used for the CSV export.

#### options.csvLineEnd
Type: `String`  
Default value: `'\r\n'`

The line end character(s) used for the CSV export.

#### options.csvEscape
Type: `Function`  
Default value:

```js
function (str) {
  return str.replace(/"/g, '""');
}
```

The string escape function used for the CSV export.

#### options.csvKeyLabel
Type: `String`  
Default value: `'ID'`

The label for the first cell created in the CSV export.

#### options.urlRegExp
Type `RegExp`  
Default value: `/^((ftp|https?):\/\/|mailto:|#|\{\w+\})/`

The allowed URL formats for the CSV import.

## HTML templates format
The templates should contain HTML content which can be parsed by [node-htmlparser](https://github.com/tautologistics/node-htmlparser).

By default, the `locales:update` task parses all elements with `localize`, `localize-title` and `localize-page-title` attributes, as well as the same attributes with `-data` prefix. So elements with `data-localize`, `data-localize-title` and `data-localize-page-title` attribute will also be parsed, which allows strict HTML conformity.

The localization string is taken from the attribute value. For the attributes `localize` and `data-localize`, the string will be taken from the content of the element if the attribute value is empty.

### Template examples

```html
<div data-name="Grunt" data-localize>Hello {name}!</div>
```

```html
<div localize-title="Hover over me!" localize>Element with title!</div>
```

## Translation functions
The compiled translation functions can be used the following way:

```js
var translatedString = i18n['Hello {name}!']({name: 'Grunt'});
```

### DOM replacement
An example replacing the content of all HTML nodes of the current document with `data-localize` attribute with their translation function result:

```js
[].forEach.call(document.querySelectorAll('[data-localize]'), function (node) {
    var func = window.i18n[node.getAttribute('data-localize') || node.innerHTML];
    if (func) {
        node.innerHTML = func({name: escapeHTML(node.getAttribute('data-name'))});
    }
});
```
Please note that when you are dynamically updating HTML content, you have to safeguard against [Cross-site scripting](http://en.wikipedia.org/wiki/Cross-site_scripting) attacks.

A safe way is to filter all arguments passed to the translation functions, based on the context where the translation result will be inserted.

Arguments for translation functions which will be inserted as HTML element content can be safely escaped by replacing unsafe characters with their HTML entity equivalents, e.g. with the following function:

```js
function escapeHTML(str) {
    return str.replace(/[<>&"]/g, function (c) {
        return {
            '<' : '&lt;',
            '>' : '&gt;',
            '&' : '&amp;',
            '"' : '&quot;'
        }[c] || '';
    });
}
```

### AngularJS directive
A sample `localize` [AngularJS](http://angularjs.org/) directive:

```js
angular.module('localize', ['ngSanitize']).directive('localize', [
    '$window', '$sanitize',
    function ($window, $sanitize) {
        return function (scope, elm, attrs) {
            // Take the translation key from the element content,
            // if the localize attribute is empty:
            if (!attrs.localize) {
                attrs.$set('localize', elm.html());
            }
            var func = $window.i18n[attrs.localize];
            if (func) {
                // Call the translation function with the
                // data-attributes of the element as argument object:
                elm.html($sanitize(func(elm.data())));
            }
        };
    }
]);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2013-11-20   v3.0.0   Accept [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) with the new `defaultMessagesSource` option, replacing `defaultMessagesFile`.
 * 2013-10-30   v2.0.0   Sanitize both keys and content, minify HTML output.
 * 2013-10-30   v1.1.0   Catch, format and log errors when parsing JSON locale files.
 * 2013-10-29   v1.0.0   Initial release.
