# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
	renderPasses: 2 # needed for carousel includes

	templateData:
		insertCarousel: (name) ->
			@getCollection('carousels').findOne({basename: name}).getOutContent()
		getCarouselSlide: (basename) ->
			@getCollection('slides').findOne({basename: basename }).getOutContent()
		lazyImg: (url, width, height) ->
			"<img src=\"/images/transparent.gif\" data-src=\"#{url}\" width=\"#{width}\" height=\"#{height}\" class=\"lazyLoad\" />"

	plugins:
		sass:
			scssPath: ['bundle', 'exec', 'scss']
			sassPath: ['bundle', 'exec', 'sass']
			compass: false
		opengraph:
			defaults:
				scripts: [
					'//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
					'//maps.google.com/maps/api/js?sensor=false',
					'/scripts/lib/picturefill.js',
					'/scripts/owl.carousel.js',
					'/scripts/toggle.js',
					'/scripts/script.js'
				]
				styles: [
					'/styles/owl.carousel.css',
					'/styles/owl.theme.css',
					'/styles/styles.css',
				]	
		thumbnails:
			imageMagick: true
			targets:
				default: (img, args) ->
					return img.quality(args.q).resize(args.w, args.h).interlace('Line')
				

	collections:
		panels: ->
			@getCollection('database').findAllLive({relativeDirPath: 'panels'}, [order: 1]).on 'add', (model) ->
				model.setMetaDefaults({
					layout: 'panel'
					write: false
				})
		carousels: ->
			@getCollection('database').findAllLive({relativeDirPath: 'carousels'}, [order: 1]).on 'add', (model) ->
				model.setMetaDefaults({
					layout: 'carousel'
					write: false
				})
		slides: ->
			@getCollection('database').findAllLive({relativeDirPath: 'slides'}).on 'add', (model) ->
				model.setMetaDefaults({
					layout: 'slide'
					write: false
				})

	environments:
		development: # default
			maxAge: false # always refresh
}

# Export the DocPad Configuration
module.exports = docpadConfig