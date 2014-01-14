module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				src: [
					'out/scripts/lib/*.js',
					'out/scripts/*.js'
				],
				dest: 'out/scripts/build/production.js'
			}
		},
		uglify: {
			build: {
				src: 'out/scripts/build/production.js',
				dest: 'out/scripts/build/production.min.js'
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

		watch: {
			scripts: {
				files: ['out/scripts/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'uglify', 'imagemin']);

}