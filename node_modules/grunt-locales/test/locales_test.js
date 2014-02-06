/*
 * grunt-locales Tests
 * https://github.com/blueimp/grunt-locales
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*global exports, require */

(function () {
    'use strict';

    var grunt = require('grunt');

    exports.locales = {

        update: function (test) {
            test.expect(2);
            var actual = grunt.file.read('tmp/en_US/i18n.json'),
                expected = grunt.file.read('test/fixtures/en_US/i18n.json');
            test.equal(
                actual,
                expected,
                'Should parse HTML templates and update existing JSON locale files.'
            );
            actual = grunt.file.read('tmp/de_DE/i18n.json');
            expected = grunt.file.read('test/fixtures/de_DE/i18n.json');
            test.equal(
                actual,
                expected,
                'Should parse HTML templates and create new JSON locale files.'
            );
            test.done();
        },

        build: function (test) {
            test.expect(2);
            var actual = grunt.file.read('tmp/en_US/i18n.js'),
                expected = grunt.file.read('test/fixtures/en_US/i18n.js');
            test.equal(
                actual,
                expected,
                'Should parse JSON locale files and build JS locale files.'
            );
            actual = grunt.file.read('tmp/de_DE/i18n.js');
            expected = grunt.file.read('test/fixtures/de_DE/i18n.js');
            test.equal(
                actual,
                expected,
                'Should parse JSON locale files and build JS locale files.'
            );
            test.done();
        },

        'export': function (test) {
            test.expect(1);
            var actual = grunt.file.read('tmp/locales.csv'),
                expected = grunt.file.read('test/fixtures/locales.csv');
            test.equal(
                actual,
                expected,
                'Should export JSON locale files to CSV locale file.'
            );
            test.done();
        },

        'import': function (test) {
            test.expect(2);
            var actual = grunt.file.read('tmp/en_US/i18n-import.json'),
                expected = grunt.file.read('test/fixtures/en_US/i18n.json');
            test.equal(
                actual,
                expected,
                'Should import CSV locale file to JSON locale files.'
            );
            actual = grunt.file.read('tmp/de_DE/i18n-import.json');
            expected = grunt.file.read('test/fixtures/de_DE/i18n.json');
            test.equal(
                actual,
                expected,
                'Should import CSV locale file to JSON locale files.'
            );
            test.done();
        }

    };

}());
