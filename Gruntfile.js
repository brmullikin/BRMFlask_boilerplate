'use strict';
module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed times
  require('time-grunt')(grunt);

  var jsFileList = [
    'static/src/js/libraries/modernizr.min.js',
    'static/src/vendor/jquery/dist/jquery.min.js',
    'static/src/vendor/bootstrap/js/affix.js',
    'static/src/js/vendor/*.js',
    'static/src/js/vendor/*/*.js'
  ];

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'static/src/js/vendor/*.js',
        'static/src/js/vendor/*/*.js'
      ]
    },
    less: {
      dev: {
        files: {
          'static/dist/css/style.css': [
            'static/src/less/style.less',
            'static/src/vendor/font-awesome/less/font-awesome.less'
          ]
        },
        options: {
          compress: false,
          // LESS source map
          // To enable, set sourceMap to true and update sourceMapRootpath based on your install
          sourceMap: true,
          sourceMapFilename: 'static/dist/css/style.css.map',
          sourceMapRootpath: ''
        }
      },
      build: {
        files: {
          'static/dist/css/style.min.css': [
            'static/src/less/style.less',
            'static/src/vendor/font-awesome/less/font-awesome.less'
          ]
        },
        options: {
          compress: true
        }
      }
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true
      },
      dist: {
        src: [jsFileList],
        dest: 'static/dist/js/my.js',
      },
    },
    uglify: {
      dist: {
        files: {
          'static/dist/js/my.min.js': ['static/dist/js/my.js']
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
      },
      dev: {
        options: {
          map: {
            prev: 'static/dist/css/'
          }
        },
        src: 'static/dist/css/style.css'
      },
      build: {
        src: 'static/dist/css/style.min.css'
      }
    },
    stripmq: {
        //Viewport options
        options: {
            width: 1180,
            type: 'screen'
        },
        all: {
          files: {
            //follows the pattern 'destination': ['source']
            'static/dist/css/style-ie.css': ['static/dist/css/style.min.css']
          }
        }
    },
    watch: {
      less: {
        files: [
          'static/src/less/*.less',
          'static/src/less/**/*.less'
        ],
        tasks: ['less:dev', 'autoprefixer:dev'],
        options: {
          livereload: true,
        }
      },
      js: {
        files: [
          jsFileList
        ],
        tasks: ['jshint', 'concat'],
        options: {
          livereload: true,
        }
      }
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'dev'
  ]);
  grunt.registerTask('dev', [
    'jshint',
    'less:dev',
    'autoprefixer:dev',
    'concat'
  ]);
  grunt.registerTask('build', [
    'jshint',
    'less:build',
    'autoprefixer:build',
    'uglify',
    'stripmq'
  ]);
};
