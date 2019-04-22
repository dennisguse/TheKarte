module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets_inline: {
            options: {
                inlineLinkTags: true,
                minify: false,
                verbose: true
            },
            all: {
                files: [{
                        src: 'TheKarte.html',
                        dest: 'dist/TheKarte.html'
                    },
                    {
                        src: 'TheKarte-2kml.html',
                        dest: 'dist/TheKarte-2kml.html'
                    },
                    {
                        src: 'TheKarte-geocoder-OSM-nominatim.html',
                        dest: 'dist/TheKarte-geocoder-OSM-nominatim.html'
                    },
                ],
            },
        },
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
        jshint: {
            all: ['Gruntfile.js', 'src/*.js'],
            options: {
                esversion: 6
            }
        },
        revision: {
            options: {
                property: 'git.revision',
                ref: 'HEAD',
                short: false
            }
        },
        run: {
            jsdoc: {
                exec: 'jsdoc --private -d doc src/*.js'
            },
            insertVersion: {
                exec: 'sed -i -e "s>package.json:description><%= pkg.description %>>" -e "s>package.json:version><%= pkg.version %>>" -e "s>git.revision><%= git.revision %>>" -e "s>package.json:homepage><%= pkg.homepage.replace(">"> "\>") %>>g" -e "s>package.json:license><%= pkg.license %>>g" TheKarte.html'
            },
            help: {
                exec: 'grunt --help'
            }
        }
    });

    grunt.loadNpmTasks('grunt-assets-inline');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-git-revision');
    grunt.loadNpmTasks('grunt-run');

    //Task(s)
    grunt.registerTask('default', ['jsbeautifier']);

    grunt.registerTask('doc', ['run:jsdoc']);
    grunt.registerTask('format', ['jsbeautifier']);
    grunt.registerTask('help', ['run:help']);
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('dist', ['revision', 'run:insertVersion', 'assets_inline', 'run:jsdoc']);
};
