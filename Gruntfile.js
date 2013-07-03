/*global module:false*/
module.exports = function(grunt) 
{
  'use strict';
  
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),//'<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    watch: {
      files: ['<config:jslint.files>'],
      tasks: ['jslint', 'mocha']
    },
    jslint: { 
      files: [
        'grunt.js',
        'src/**/*.js'
      ],
      directives: {
        browser: true,
        unparam: true,
        todo: true,
      },
      options: {
        junit: 'out/junit.xml',
        log: 'out/lint.log',
        jslintXml: 'out/jslint_xml.xml',
        errorsOnly: true,
        failOnError: false,
        shebang: true,
        checkstyle: 'out/checkstyle.xml'
      }
    },
    mocha_phantomjs: {
      options: {
        'reporter': 'spec',
        'output': 'out/test_results.xml'
      },
      all: ['test/**/*.html']
    },
    mocha: { 
      index: ['test/index.html'],
      log: true,
      reporter: 'spec'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('test', ['jslint', 'mocha_phantomjs']);
  grunt.registerTask('mocha', ['mocha']);
  grunt.registerTask('default', ['watch']);
  
};
