/*
 * Copyright (c) 2015, All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [ 'src/*.js' ],
      options: {
        scripturl: true,
        camelcase: true
      }
    },
    run: {
      options: {},
      gendot : {
        cmd: './scripts/gendot.sh',
        args: []
      }
    },
    browserify: {
      standalone: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.js',
        options: {
          browserifyOptions: {
            standalone: 'CFGJS'
          }
        }
      },
    },
    uglify: {
      options: {
        banner: ['/**',
            ' * <%= pkg.name %> - v<%= pkg.version %>',
            ' * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.',
            ' */', ''].join('\n'),
        compress: {
          join_vars: true
        }
      },
      buildMin: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      buildMinWithVersion: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.<%= pkg.version %>.min.js'
      }
    },
    mocha_istanbul: {
      target: {
        src: 'tests/unit',
        options: {
          coverageFolder: 'artifacts/test/coverage',
          excludes: [
          ],
          coverage: true,
          check: {
            lines: 80,
            statements: 80 
          }
        }
      }
    },
    clean: {
      all: ['artifacts', 'coverage', 'node_modules', 'tests/samples/*.dot', 'tests/samples/*.png'],
      buildResidues: ['artifacts', 'coverage', 'tests/samples/*.dot', 'tests/samples/*.png']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('test', ['clean:buildResidues', 'jshint', 'dist', 'mocha_istanbul']);
  grunt.registerTask('dist', ['browserify', 'uglify']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('release', ['dist'])

};
