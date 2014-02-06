/*
 * grunt-locales Gruntfile
 * https://github.com/blueimp/grunt-locales
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global module */

module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Copy files for the test setup:
        copy: {
            json: {
                files: [
                    {
                        src: "test/fixtures/en_US/i18n.json",
                        dest: "tmp/en_US/i18n.json"
                    },
                    {
                        src: "test/fixtures/en_US/i18n-partial.json",
                        dest: "tmp/en_US/i18n-import.json"
                    },
                    {
                        src: "test/fixtures/de_DE/i18n-partial.json",
                        dest: "tmp/de_DE/i18n-import.json"
                    }
                ]
            }
        },

        // Configuration to be run (and then tested).
        locales: {
            options: {
                locales: ['en_US', 'de_DE'],
                defaultMessagesSource: [
                    'test/fixtures/messages.json',
                    'test/fixtures/messages2.json'
                ]
            },
            update: {
                src: 'test/fixtures/templates/*.html',
                dest: 'tmp/{locale}/i18n.json'
            },
            build: {
                src: 'test/fixtures/**/i18n.json',
                dest: 'tmp/{locale}/i18n.js'
            },
            'export': {
                src: 'test/fixtures/**/i18n.json',
                dest: 'tmp/locales.csv'
            },
            'import': {
                src: 'test/fixtures/locales-partial.csv',
                dest: 'tmp/{locale}/i18n-import.json'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-bump-build-git');

    // Whenever the "test" task is run,
    // first clean the "tmp" dir,
    // then run the copy task,
    // then run this plugin's task(s),
    // then test the result.
    grunt.registerTask('test', [
        'clean',
        'copy',
        'locales:update',
        'locales:build',
        'locales:export',
        'locales:import',
        'nodeunit'
    ]);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
