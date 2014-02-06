/*
 * grunt-locales Grunt task
 * https://github.com/blueimp/grunt-locales
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint regexp: true, unparam: true, nomen: true */
/*global module, require, global, __dirname */

module.exports = function (grunt) {
    'use strict';

    function LocalesTask(task) {
        this.options = task.options({
            locales: ['en_US'],
            localizeAttributes: [
                'localize',
                'localize-title',
                'localize-page-title'
            ],
            // Matches the locale name in a file path,
            // e.g. "en_US" in js/locale/en_US/i18n.json:
            localeRegExp: /\w+(?=\/[^\/]+$)/,
            localePlaceholder: '{locale}',
            localeName: 'i18n',
            // Purge obsolete locale messages by default:
            purgeLocales: true,
            messageFormatFile:
                __dirname + '/../node_modules/messageformat/locale/{locale}.js',
            localeTemplate: __dirname + '/../i18n.js.tmpl',
            htmlmin: {
                removeComments: true,
                collapseWhitespace: true
            },
            htmlminKeys: false,
            jsonSpace: 2,
            csvEncapsulator: '"',
            csvDelimiter: ',',
            csvLineEnd: '\r\n',
            csvEscape: function (str) {
                return str.replace(/"/g, '""');
            },
            csvKeyLabel: 'ID',
            // Allow ftp, http(s), mailto, anchors
            // and messageformat variables (href="{url}"):
            urlRegExp: /^((ftp|https?):\/\/|mailto:|#|\{\w+\})/
        });
        if (!this.options.locales.length) {
            return grunt.fail.warn('No locales defined');
        }
        this.task = task;
        this.done = task.async();
        this[task.target]();
    }

    grunt.registerMultiTask(
        'locales',
        'Update, build, import and export locales.',
        function () {
            return new LocalesTask(this);
        }
    );

    function extend(dst) {
        grunt.util.toArray(arguments).forEach(function (obj) {
            var key;
            if (obj && obj !== dst) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        dst[key] = obj[key];
                    }
                }
            }
        });
        return dst;
    }

    extend(LocalesTask.prototype, {
        extend: extend,

        jsEscape: function (str) {
            // Escape string for output in a quoted JS context,
            // e.g. var data = "OUTPUT";
            return str.replace(/\W/g, function (match) {
                var charCode = match.charCodeAt(0),
                    hexStr;
                // Escape non-printable characters, single and double quotes,
                // and the backslash.
                // Also escape HTML special characters (<>&) as the string
                // could be used in a JS context inside of a HTML context,
                // because a script closing tag (</script>) ends a script
                // block even inside of a quoted JS string, as the HTML parser
                // runs before the JS parser.
                if (charCode < 32 || '"\'\\<>&'.indexOf(match) !== -1) {
                    hexStr = charCode.toString(16);
                    if (hexStr.length < 2) {
                        hexStr = '0' + hexStr;
                    }
                    return '\\x' + hexStr;
                }
                return match;
            });
        },

        sanitize: function (key, content, escapeKey) {
            // Throws exception for invalid HTML if htmlmin option is set
            var urlRegExp = this.options.urlRegExp,
                htmlmin = this.options.htmlmin,
                htmlminKeys = this.options.htmlminKeys && htmlmin,
                minify = htmlmin && require('html-minifier').minify,
                sanitizer = require('sanitizer'),
                sanitizeUrlCallback = function (value) {
                    if (urlRegExp.test(value)) {
                        return value;
                    }
                };
            key = String(key);
            key = (htmlminKeys && minify(key, htmlminKeys)) || key;
            if (escapeKey) {
                key = this.jsEscape(key);
            }
            content = String(content);
            content = sanitizer.sanitize(
                (htmlmin && minify(content, htmlmin)) || content,
                sanitizeUrlCallback
            );
            return {
                key: key,
                content: content
            };
        },

        getLocalizeAttributes: function () {
            if (!this.localizeAttributes) {
                var attrs = this.options.localizeAttributes;
                this.localizeAttributes = attrs.concat(attrs.map(
                    function (attr) {
                        return 'data-' + attr;
                    }
                ));
            }
            return this.localizeAttributes;
        },

        getAttributesSelector: function () {
            if (!this.attributesSelector) {
                var items = [];
                this.getLocalizeAttributes().forEach(function (attr) {
                    items.push('[' + attr + ']');
                });
                this.attributesSelector = items.join(',');
            }
            return this.attributesSelector;
        },

        getAttributeValue: function (attrs, id) {
            var dataId = 'data-' + id;
            return (attrs[id] && attrs[id].nodeValue) ||
                (attrs[dataId] && attrs[dataId].nodeValue);
        },

        parseTemplate: function (file, callback) {
            var that = this,
                messages = {};
            require('apricot').Apricot.open(file, function (err, doc) {
                if (err) {
                    grunt.log.error(err);
                    return callback.call(that);
                }
                doc.find(that.getAttributesSelector());
                doc.each(function (el) {
                    that.getLocalizeAttributes().forEach(function (attr) {
                        if (!el.hasAttribute(attr)) {
                            return;
                        }
                        var val = that.getAttributeValue(el.attributes, attr),
                            key = val,
                            sanitizedData;
                        // Empty attributes can have their attribute name
                        // as attribute value on some environments (e.g. OSX):
                        if (val === attr) {
                            val = '';
                        }
                        if (!val && (attr === 'localize' ||
                                attr === 'data-localize')) {
                            // Retrieve the element content and
                            // use the HTML5 version of empty tags:
                            val = el.innerHTML.replace(/ \/>/g, '>');
                            try {
                                sanitizedData = that.sanitize(val, val);
                                val = sanitizedData.content;
                                key = sanitizedData.key;
                            } catch (e) {
                                return that.logError(e, val, null, file);
                            }
                        }
                        if (val) {
                            messages[key] = val;
                        }
                    });
                });
                callback.call(that, messages);
            });
        },

        getSourceFiles: function () {
            var files = this.task.filesSrc;
            if (this.task.args.length) {
                files = this.task.args;
            }
            return files.filter(function (file) {
                if (!grunt.file.exists(file)) {
                    grunt.log.warn('Source file ' + file.cyan + ' not found.');
                    return false;
                }
                return true;
            });
        },

        getDestinationFilePath: function () {
            var dest = this.task.files.length && this.task.files[0].dest;
            if (!dest) {
                grunt.fail.warn('Missing destination file path.');
                return this.done();
            }
            return dest;
        },

        getLocaleFromPath: function (path) {
            var regexp = this.options.localeRegExp,
                localeMatch = regexp.exec(path),
                locale = localeMatch && localeMatch[0];
            if (!locale) {
                grunt.fail.warn(
                    'Regular expression ' + regexp.toString().cyan +
                        ' failed to match locale in path ' +
                        path.cyan + '.'
                );
                return this.done();
            }
            return locale;
        },

        getLocaleTemplate: function () {
            var file = this.options.localeTemplate;
            if (!grunt.file.exists(file)) {
                grunt.fail.warn('Locale template ' + file.cyan + ' not found.');
                return this.done();
            }
            return grunt.file.read(file);
        },

        needsTranslationFunction: function (key, value) {
            return (key !== value) || /\{/.test(value);
        },

        cleanupTranslationFunction: function (content) {
            var dataCheckRegExp =
                /if\(!d\)\{\nthrow new Error\("MessageFormat: No data passed to function\."\);\n\}/g;
            return content
                .replace(
                    /var r = "";\nr \+= (".*?";)\nreturn r;/,
                    function (match, p1, offset, str) {
                        if (p1) {
                            return 'return ' + p1;
                        }
                        return str;
                    }
                )
                .replace(/^(function\()d(\)\{\nreturn)/, '$1$2')
                .replace(dataCheckRegExp, 'd = d || {};');
        },

        getMessageFormatLocale: function (locale) {
            var file = this.options.messageFormatFile.replace(
                this.options.localePlaceholder,
                locale.slice(0, 2)
            );
            if (!grunt.file.exists(file)) {
                grunt.fail.warn('MessageFormat file ' + file.cyan + ' not found.');
                return this.done();
            }
            return grunt.file.read(file);
        },

        messageFormatFactory: function (locale, messageFormatLocale) {
            if (!global.MessageFormat) {
                global.MessageFormat = require('messageformat');
            }
            require('vm').createScript(
                messageFormatLocale || this.getMessageFormatLocale(locale)
            ).runInThisContext();
            return new global.MessageFormat(locale.slice(0, 2));
        },

        logError: function (e, key, locale, file) {
            grunt.log.warn(
                e.name + ':\n',
                'Error:  ' + e.message + '\n',
                'Column: ' + e.column + '\n',
                'Line:   ' + e.line + '\n',
                'Key:    ' + key.replace('\n', '\\n') + '\n',
                'Locale: ' + locale + '\n',
                'File: ' + file
            );
        },

        parse: function (callback) {
            var that = this,
                counter = 0,
                messages = {};
            this.getSourceFiles().forEach(function (file) {
                counter += 1;
                that.parseTemplate(file, function (parsedMessages) {
                    grunt.log.writeln('Parsed locales from ' + file.cyan + '.');
                    that.extend(messages, parsedMessages);
                    counter -= 1;
                    if (!counter) {
                        callback.call(that, messages);
                    }
                });
            });
            if (!counter) {
                callback.call(that, messages);
            }
        },

        update: function () {
            var that = this,
                dest = this.getDestinationFilePath();
            this.parse(function (parsedMessages) {
                var defaultMessagesSource = that.options.defaultMessagesSource || '[]',
                    defaultMessages = {};
                grunt.file.expand(defaultMessagesSource).forEach(function (file) {
                    that.extend(defaultMessages, grunt.file.readJSON(file));
                    grunt.log.writeln('Parsed locales from ' + file.cyan + '.');
                });
                that.options.locales.forEach(function (locale) {
                    var localeFile = dest.replace(that.options.localePlaceholder, locale),
                        messages = {},
                        sortedMessages = {},
                        definedMessages;
                    if (grunt.file.exists(localeFile)) {
                        definedMessages = grunt.file.readJSON(localeFile);
                        grunt.log.writeln('Parsed locales from ' + localeFile.cyan + '.');
                    }
                    // If all templates have been parsed and the purgeLocales options is set,
                    // only keep defined messages which exist as default or parsed messages:
                    that.extend(
                        messages,
                        parsedMessages,
                        defaultMessages,
                        (that.task.args.length || !that.options.purgeLocales) && definedMessages
                    );
                    // JavaScript objects are not ordered, however, creating a new object
                    // based on sorted keys creates a more consistent JSON output:
                    Object.keys(messages).sort().forEach(function (key) {
                        sortedMessages[key] = (definedMessages && definedMessages[key]) ||
                            messages[key];
                    });
                    grunt.file.write(
                        localeFile,
                        JSON.stringify(
                            sortedMessages,
                            that.options.jsonReplacer,
                            that.options.jsonSpace
                        ) + '\n'
                    );
                    grunt.log.writeln(
                        (definedMessages ? 'Updated' : 'Created') +
                            ' locale file ' + localeFile.cyan + '.'
                    );
                });
                that.done();
            });
        },

        build: function () {
            var that = this,
                dest = this.getDestinationFilePath();
            this.getSourceFiles().forEach(function (file) {
                var locale = that.getLocaleFromPath(file),
                    destFile = dest.replace(that.options.localePlaceholder, locale),
                    locales = grunt.file.readJSON(file),
                    messageFormatLocale = that.getMessageFormatLocale(locale),
                    functionsMap = {},
                    messageFormat = that.messageFormatFactory(locale, messageFormatLocale);
                Object.keys(locales).sort().forEach(function (key) {
                    try {
                        var sanitizedData = that.sanitize(key, locales[key], true),
                            content = sanitizedData.content,
                            func;
                        if (!that.needsTranslationFunction(key, content)) {
                            return;
                        }
                        func = messageFormat.precompile(
                            messageFormat.parse(content)
                        );
                        functionsMap[sanitizedData.key] = that
                            .cleanupTranslationFunction(func);
                    } catch (e) {
                        return that.logError(e, key, locale, file);
                    }
                });
                grunt.log.writeln('Parsed locales from ' + file.cyan + '.');
                grunt.file.write(destFile, grunt.template.process(
                    that.getLocaleTemplate(),
                    {
                        data: {
                            locale: locale,
                            localeName: that.options.localeName,
                            messageFormatLocale: messageFormatLocale,
                            functionsMap: functionsMap
                        }
                    }
                ));
                grunt.log.writeln('Updated locale file ' + destFile.cyan + '.');
            });
            this.done();
        },

        'export': function () {
            var that = this,
                dest = this.getDestinationFilePath(),
                options = this.options,
                locales = options.locales,
                localesMap = {},
                encapsulator = options.csvEncapsulator,
                delimiter = options.csvDelimiter,
                lineEnd = options.csvLineEnd,
                escapeFunc = options.csvEscape,
                str = encapsulator + this.options.csvKeyLabel + encapsulator;
            this.getSourceFiles().forEach(function (file) {
                localesMap[that.getLocaleFromPath(file)] = grunt.file.readJSON(file);
                grunt.log.writeln('Parsed locales from ' + file.cyan + '.');
            });
            locales.forEach(function (locale) {
                str += delimiter + encapsulator + locale + encapsulator;
            });
            str += lineEnd;
            Object.keys(localesMap[locales[0]]).sort().forEach(function (key) {
                str +=  encapsulator + escapeFunc(key) + encapsulator;
                locales.forEach(function (locale) {
                    str += delimiter + encapsulator +
                        escapeFunc(localesMap[locale][key]) +
                        encapsulator;
                });
                str += lineEnd;
            });
            grunt.file.write(dest, str);
            grunt.log.writeln('Exported locales to ' + dest.cyan + '.');
            this.done();
        },

        'import': function () {
            var that = this,
                locales = this.options.locales,
                localesMap = {},
                messageFormatMap = {},
                keyLabel = this.options.csvKeyLabel,
                csv = require('csv'),
                files = this.getSourceFiles(),
                dest = this.getDestinationFilePath();
            if (!files.length) {
                grunt.log.warn('No import source file found.');
                return this.done();
            }
            locales.forEach(function (locale) {
                var localeFile = dest.replace(
                    that.options.localePlaceholder,
                    locale
                );
                localesMap[locale] = grunt.file.exists(localeFile) ?
                        grunt.file.readJSON(localeFile) : {};
                messageFormatMap[locale] = that.messageFormatFactory(locale);
            });
            files.forEach(function (file) {
                csv().from.path(file, {columns: true})
                    .transform(function (row) {
                        var key = row[keyLabel];
                        locales.forEach(function (locale) {
                            try {
                                var sanitizedData = that.sanitize(key, row[locale]),
                                    content = sanitizedData.content;
                                if (!content) {
                                    return;
                                }
                                messageFormatMap[locale].parse(content);
                                localesMap[locale][key] = content;
                            } catch (e) {
                                return that.logError(e, key, locale, file);
                            }
                        });
                    })
                    .on('end', function () {
                        grunt.log.writeln('Parsed locales from ' + file.cyan + '.');
                        Object.keys(localesMap).forEach(function (locale) {
                            var localeFile = dest.replace(
                                    that.options.localePlaceholder,
                                    locale
                                ),
                                messages = localesMap[locale],
                                sortedMessages = {};
                            // JavaScript objects are not ordered, however, creating a new object
                            // based on sorted keys creates a more consistent JSON output:
                            Object.keys(messages).sort().forEach(function (key) {
                                sortedMessages[key] = messages[key];
                            });
                            grunt.file.write(
                                localeFile,
                                JSON.stringify(
                                    sortedMessages,
                                    that.options.jsonReplacer,
                                    that.options.jsonSpace
                                ) + '\n'
                            );
                            grunt.log.writeln('Updated locale file ' + localeFile.cyan + '.');
                        });
                        that.done();
                    });
            });
        }

    });

};
