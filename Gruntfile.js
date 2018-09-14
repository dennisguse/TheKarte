module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsbeautifier: {
            files: ['*.html', 'src/*.js', 'Gruntfile.js', 'package.json'],
            options: {
                js: {
                    indent_size: 4,
                    preserve_newlines: true,
                    wrap_line_length: 0,
                    end_with_newline: true
                },
                css: {
                    indent_size: 4,
                    preserve_newlines: false,
                    max_preserve_newlines: 2,
                    end_with_newline: true
                },
                html: {
                    indent_size: 4,
                    preserve_newlines: true,
                    max_preserve_newlines: 2,
                    end_with_newline: true,
                    indent_inner_html: true,
                    indent_scripts: "keep",
                    extra_liners: ["head", "body", "/html", "script", "style"]
                }
            }
        },
        run: {
            jsdoc: {
                exec: 'jsdoc --private -d doc src/*.js'
            },
            help: {
                exec: 'grunt --help'
            }
        }
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-run');

    //Task(s)
    grunt.registerTask('default', ['jsbeautifier']);

    grunt.registerTask('doc', ['jsbeautifier', 'run:jsdoc']);
    grunt.registerTask('format', ['jsbeautifier'])
    grunt.registerTask('help', ['run:help'])
};
