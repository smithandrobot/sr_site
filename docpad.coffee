# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
	# ...
	templateData:
		insertCarousel: (name) ->
			@getCollection('carousels').findOne({title: name}).getOutContent()
		getCarouselSlides: (name) ->
			@getCollection('slides').findAllLive({carousel: name})

	events:
		populateCollections: (opts) ->
			@docpad.getBlock('styles').add(['/styles/styles.css'])		

	collections:
		pages: ->
			@getCollection('database').findAllLive({relativeDirPath: 'content'}, [order: 1]).on 'add', (model) ->
				model.setMetaDefaults({
					layout: 'content'
					# write: false
				})
		carousels: ->
			@getCollection('database').findAllLive({relativeDirPath: 'carousels'}, [order: 1]).on 'add', (model) ->
				model.setMetaDefaults({
					layout: 'carousel'
					# write: false
				})
		slides: ->
			@getCollection('database').findAllLive({relativeDirPath: 'slides'}).on 'add', (model) ->
				model.setMetaDefaults({
					layout: 'slide'
					# write: false
				})
}

# Export the DocPad Configuration
module.exports = docpadConfig