# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
	renderPasses: 2 # needed for carousel includes

	templateData:
		insertCarousel: (name) ->
			@getCollection('carousels').findOne({title: name}).getOutContent()
		getCarouselSlides: (name) ->
			@getCollection('slides').findAll({carousel: name})

	plugins:
		opengraph:
			defaults:
				scripts: [
					'//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
					'/scripts/owl.carousel.min.js',
					'/scripts/script.js',
					'/scripts/toggle.js'
				]
				styles: [
					'/styles/owl.carousel.css',
					'/styles/owl.theme.css',
					'/styles/styles.css',
				]

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
}

# Export the DocPad Configuration
module.exports = docpadConfig