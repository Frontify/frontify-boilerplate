/* global module:false */
module.exports = function(grunt) {

  grunt.initConfig({
    
    // read configuration from package.json
    pkg: grunt.file.readJSON('package.json'),

    // start watcher and node in parallel
    concurrent: {
      development: {
        tasks: ['nodemon:development', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // start node server, reload on node file changes
    nodemon: {
      development: {
        script: 'src/index.js',
        options: {
          nodeArgs: ['--debug'],
          env: {
            PORT: '3000'
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
            nodemon.on('config:update', function () {
              setTimeout(function() {
                require('open')('http://localhost:3000/');
              }, 1000);
            });
          }
        }
      }
    },

    // watch files for instant compilation and live reload
    watch: {
      less: {
        files: ['src/assets/css/*/*.less', 'src/modules/*/css/*.less'],
        tasks: ['less:development', 'concat:css'],
        options: {
          livereload: true,
          spawn: false
        }
      },
      css: {
        files: ['src/assets/css/*/*.css', 'src/modules/*/css/*.css'],
        tasks: ['concat:css'],
        options: {
          livereload: true,
          spawn: false
        }
      },
      dot: {
        files: ['src/modules/*/*.html'],
        tasks: ['dot:compile', 'concat:js'],
        options: {
          livereload: true,
          spawn: false
        }
      },
      core_javascript: {
        files: ['src/assets/js/core/*.js'],
        tasks: ['concat:jscore'],
        options: {
          livereload: true,
          spawn: false
        }
      },
      ie_javascript: {
        files: ['src/assets/js/ie/*.js'],
        tasks: ['concat:jsie'],
        options: {
          livereload: true,
          spawn: false
        }
      },
      modules_javascript: {
        files: ['src/modules/*/js/*.js'],
        tasks: ['concat:js'],
        options: {
          livereload: true,
          spawn: false
        }
      },
      views: {
        files: ['src/views/index.html'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    },

    // compile less files, cleanup for production
    less: {
      development: {
        options: {
          paths: ['src/assets/css/core']
        },
        files: [
          {src: 'src/modules/*/css/*.less', dest: 'build/assets/less/modules.css'},
          {src: 'src/assets/css/core/*.less', dest: 'build/assets/less/core.css'}
        ]
      },
      production: {
        options: {
          paths: ['src/assets/css/core'],
          cleancss: true
        },
        files: [
          {src: 'src/modules/*/css/*.less', dest: 'build/assets/less/modules.css'},
          {src: 'src/assets/css/core/*.less', dest: 'build/assets/less/core.css'}
        ]
      }
    },

    // compile doT templates (currently all .html files in modules) into js file
    dot: {
      compile: {
        options: {
          variable: 'tmpl'
        },
        src: ['src/modules/*/*.html'],
        dest: 'build/assets/dot/templates.js'
      }
    },

    // concatenate js and css files
    concat: {
      options: {
        separator: ''
      },
      // contains core js files, not updated frequently
      jscore: {
        src: [
          'src/assets/js/core/*.js',
          'src/assets/js/libraries/*.js'
        ],
        dest: 'build/assets/js/<%= pkg.name %>-core.js'
      },
      // contains ie-specific js files, updated infrequently
      jsie: {
        src: [
          'src/assets/js/ie/*.js'
        ],
        dest: 'build/assets/js/<%= pkg.name %>-ie.js'
      },
      // contains application js files, updated frequently
      js: {
        src: [
          'build/assets/dot/templates.js',
          'src/modules/*/js/*.js'
        ],
        dest: 'build/assets/js/<%= pkg.name %>.js'
      },
      // contains all css and less files
      css: {
        src: [
          'build/assets/less/core.css',
          'build/assets/less/modules.css',
          'src/assets/css/core/*.css',
          'src/modules/*/css/*.css'
        ],
        dest: 'build/assets/css/<%= pkg.name %>.css'
      }
    },

    // minify js files
    uglify: {
      core: {
        src: ['build/assets/js/<%= pkg.name %>-core.js'],
        dest: 'build/assets/js/<%= pkg.name %>-core.min.js'
      },
      ie: {
        src: ['build/assets/js/<%= pkg.name %>-ie.js'],
        dest: 'build/assets/js/<%= pkg.name %>-ie.min.js'
      },
      modules: {
        src: ['build/assets/js/<%= pkg.name %>.js'],
        dest: 'build/assets/js/<%= pkg.name %>.min.js'
      }
    },

    // minify css file
    cssmin: {
      dist: {
        src: ['build/assets/css/<%= pkg.name %>.css'],
        dest: 'build/assets/css/<%= pkg.name %>.min.css'
      }
    },

    copy: {
      html: {
        src: ['src/views/index-prod.html'],
        dest: 'dist/index.html'
      },
      assets: {
        files: [
          {expand: true, cwd: 'build/assets/', src: ['*/*.min.*'], dest: 'dist/assets/'},
          {expand: true, cwd: 'src/assets/', src: ['fonts/**'], dest: 'dist/assets/'},
          {expand: true, cwd: 'src/assets/', src: ['img/**'], dest: 'dist/assets/'}
        ]
      },
      api: {
        files: [
          {expand: true, cwd: 'src/api/', src: ['**'], dest: 'dist/api/' }
        ]
      }
    },

    compress: {
      main: {
        options: {
          archive: 'dist/<%= pkg.name %>.zip',
          mode: 'zip'
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['**'], dest: '<%= pkg.name %>'}
        ]
      }
    },

    clean: ['dist', 'build']

  });

  // load npm tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-dot-compiler');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');

  // register tasks
  grunt.registerTask('default', ['less:development','dot:compile','concat','uglify','cssmin']);
  grunt.registerTask('app', ['less:development','dot:compile','concat','concurrent:development']);
  grunt.registerTask('dist', ['clean','less:production','dot:compile','concat','uglify','cssmin','copy','compress']);

};