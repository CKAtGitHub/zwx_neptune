/**
 * Created by leon on 15/10/30.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            options: {
                module: null, // no bundle module for all the html2js templates
                base: '.',
                jade: {
                    doctype: "html"
                },
                rename: function (moduleName) {
                    return "/" + moduleName.replace(".jade", ".html");
                }
            },
            main: {
                src: ["template/**/*.jade"],
                dest: "dist/templates.html.js"
            }
        },
        concat: {
            options: {
                separator: ";"
            },
            dist: {
                src: [
                    "src/datatable/datatable.js",
                    "src/form/form.js",
                    "src/bizmodule/bizmodule.js",
                    "src/resource/resource.js",
                    "<%= html2js.main.dest%>"
                ],
                dest: "dist/<%= pkg.name %>-<%= pkg.version%>.js"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>  <%= grunt.template.today("yyyy-mm-dd") %>*/\n'
            },
            dist: {
                files: {
                    "dist/<%= pkg.name%>-<%= pkg.version%>.min.js": ["<%= concat.dist.dest%>"]
                }
            }
        },
        jshint: {
            files: ["src/**/*.js"],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        copy: {
            main: {
                expand: true,
                flatten: true,
                src: ["<%= concat.dist.dest%>"],
                dest: "misc/demo/public/vendor/neptune/"
            }
        },
        watch: {
            files: ["<%= jshint.files%>"],
            task: ["jshint"]
        },
        clean: ["dist/*.js"]
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-html2js");


    grunt.registerTask("clean", ["clean"]);
    grunt.registerTask("test", ["jshint"]);
    grunt.registerTask("default", ["jshint", "html2js", "concat", "uglify"]);
    grunt.registerTask("demo", ["jshint", "html2js", "concat", "copy", "uglify"]);
}