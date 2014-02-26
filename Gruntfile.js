/* global module:false */
module.exports = function(grunt) {

  grunt.initConfig({
    
    // read configuration from package.json
    pkg: grunt.file.readJSON('package.json'),

    // start watcher and node in parallel
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // start node server, reload on node file changes
    nodemon: {
      dev: {
        script: 'app/index.js',
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
                require('open')('http://localhost:3000/#/');
              }, 1000);
            });
          }
        }
      }
    },

    // watch files for instant compilation and live reload
    watch: {
      less: {
        files: '**/*.less',
        tasks: ['less:development','concat:css'],
        options: {
          livereload: true,
        },
      },
      javascript: {
        files: 'app/assets/js/**/*.js',
        tasks: ['concat:jscore'],
        options: {
          livereload: false,
        },
      },
      dot: {
        files: 'app/modules/**/*.html',
        tasks: ['dot','concat:js'],
        options: {
          livereload: false,
          spawn: false
        },
      },
      modules_javascript: {
        files: 'app/modules/**/*.js',
        tasks: ['concat:js'],
        options: {
          livereload: false,
        },
      },
      css: {
        files: 'app/assets/css/**/*.css',
        tasks: ['concat:css'],
        options: {
          livereload: false,
        },
      },
      modules: {
        files: 'app/modules/**/*.css',
        tasks: ['concat:css'],
        options: {
          livereload: false,
        },
      },
      html: {
        files: 'app/views/index.html',
        options: {
          livereload: false,
        },
      },
      server: {
        files: ['.grunt/rebooted'],
        options: {
          livereload: false
        }
      }
    },

    // compile less files, cleanup for production
    less: {
      development: {
        options: {
          paths: ["app/assets/css/core"]
        },
        files: {
          "build/less/modules.css": "app/modules/*/css/*.less",
          "build/less/core.css": "app/assets/css/core/*.less"
        }
      },
      production: {
        options: {
          paths: ["app/assets/css/core"],
          cleancss: true
        },
        files: {
          "build/less/modules.css": "app/modules/*/css/*.less",
          "build/less/core.css": "app/assets/css/core/*.less"
        }
      }
    },

    // compile doT templates (currently all .html files in modules) into js file
    dot: {
      dist: {
        options: {
          variable : 'tmpl'
        },
        src  : ['app/modules/**/*.html'],
        dest : 'build/js/templates.js'
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
          'app/assets/js/core/jquery.min.js', 
          'app/assets/js/core/terrific.min.js', 
          'app/assets/js/core/dot.min.js', 
          'app/assets/js/libraries/**/*.js',
          'app/assets/js/plugins/**/*.js'
        ],
        dest: 'app/assets/dist/js/<%= pkg.name %>-core.js'
      },
      // contains application js files, updated frequently
      js: {
        src: [
          'build/js/templates.js',
          'app/modules/**/*.js'
        ],
        dest: 'app/assets/dist/js/<%= pkg.name %>.js'
      },
      // contains ie-specific js files, updated infrequently
      jsie: {
        src: [
          'app/assets/js/ie/**/*.js'
        ],
        dest: 'app/assets/dist/js/<%= pkg.name %>-ie.js'
      },
      // contains all css and less files
      css: {
        src: [
          'build/less/core.css',
          'app/assets/css/core/*.css',
          'app/modules/**/*.css',
          'build/less/modules.css'
        ],
        dest: 'app/assets/dist/css/<%= pkg.name %>.css'
      }
    },

    // minify js files
    uglify: {
      core: {
        src: 'app/assets/dist/js/<%= pkg.name %>-core.js',
        dest: 'app/assets/dist/js/<%= pkg.name %>-core.min.js'
      },
      modules: {
        src: 'app/assets/dist/js/<%= pkg.name %>.js',
        dest: 'app/assets/dist/js/<%= pkg.name %>.min.js'
      },
      ie: {
        src: 'app/assets/dist/js/<%= pkg.name %>-ie.js',
        dest: 'app/assets/dist/js/<%= pkg.name %>-ie.min.js'
      }
    },

    // minify css file
    cssmin: {
      dist: {
        src: 'app/assets/dist/css/<%= pkg.name %>.css',
        dest: 'app/assets/dist/css/<%= pkg.name %>.min.css'
      }
    },

    copy: {
      html: {
        src: 'app/views/index-prod.html',
        dest: 'dist/index.html'
      },
      assets: {
        files: [
          { expand: true, cwd: 'app/assets/dist/', flatten: false, src: ['**'], dest: 'dist/assets/' },
          { expand: true, cwd: 'app/assets/', flatten: false, src: ['fonts/**'], dest: 'dist/assets/' },
          { expand: true, cwd: 'app/assets/', flatten: false, src: ['img/**'], dest: 'dist/assets/' }
        ]
      },
      api: {
        files: [
          { expand: true, cwd: 'app/api/', flatten: false, src: ['**'], dest: 'dist/api/' }
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

    clean: ["dist/"]

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
  grunt.registerTask('default', ['less:production','dot','concat','uglify','cssmin']);
  grunt.registerTask('app', ['less:production','dot','concat','concurrent']);
  grunt.registerTask('dist', ['clean','less:production','dot','concat','uglify','cssmin','copy','compress']);

};