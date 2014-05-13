module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            build: {
                src: [
                    'out/scripts/lib/picturefill.js',
                    'out/scripts/lib/jquery.fitvid.js',
                    'out/scripts/owl.carousel.js',
                    'out/scripts/toggle.js',
                    'out/scripts/script.js',
                ],
                dest: 'out/scripts/production.js',
                options: {
                    sourceMap: true,
                    sourceMapName: 'out/scripts/production.map'
                }
            }
        },

        uglify: {
            build: {
                src: 'out/scripts/production.js',
                dest: 'out/scripts/production.js'
            }
        },

        replace: {
            buildjs:{
                options: {
                    patterns: [
                        {
                          match: '/<script.*?="\/scripts\/.*?<\/script>/gi',
                          replacement: '',
                          expression: true
                        },
                        {
                          match: '/<\/body>/',
                          replacement: '<script src="/scripts/production.js"></script></body>',
                          expression: true
                        },
                    ]
                },
                files: [{
                         expand: true,
                         cwd: 'out',
                         src: ['**/*.html'], 
                         dest: 'out/'
                       }]
            },
            buildcss: {
                options:{
                    patterns: [
                        {
                            match: '/<link.*?href=\"\/styles.*?>/gi',
                            replacement: '',
                            expression: true
                        },
                        {
                            match: '/<\/title>/',
                            replacement: '<\/title>\r\n<link rel="stylesheet" href="/styles/production.css">',
                            expression: true
                        }
                    ]
                },
                files: [{
                         expand: true, 
                         cwd: 'out',
                         src: ['**/*.html'], 
                         dest: 'out/'
                       }]
            }
        },

        htmlmin: {
            build: {
                options: {
                  removeComments: true,
                  collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'out/',
                    src: ['**/*.html'],
                    dest: 'out/',
                }]
            },
        },

        cssmin: {
          combine: {
            files: {
              'out/styles/production.css': [
                                        'out/styles/owl.carousel.css',
                                        'out/styles/owl.theme.css',
                                        'out/styles/styles.css',
                                    ]
            }
          }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'out/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'out/images/'
                }]
            }
        },

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.registerTask('default', []);
    grunt.registerTask('default', [
        'concat:build', 
        'uglify:build',
        'cssmin', 
        'replace:buildjs', 
        'replace:buildcss',
        'htmlmin']);

}