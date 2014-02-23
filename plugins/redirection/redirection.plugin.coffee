module.exports = (BasePlugin) ->
	extend = require('extend')

	# Define Plugin
	class Redirection extends BasePlugin
		name: 'redirection'

		config:
			getRedirectTemplate: (to) ->
				'<!DOCTYPE html>'+
				'<head>'+
				'	<title>Redirecting</title>'+
				'	<link rel="canonical" href="'+to+'" />'+
				'	<meta http-equiv=\'refresh\' content=\'0;url='+to+'\'/>'+
				'</head>'+
				'<body>'+
				'	<p>Click <a href="'+to+'">here</a> if you are not redirected.</p>'+
				'</body>'+
				'</html>'

		writeAfter: (opts, next) ->
			{collection, templateData} = opts
			docPad = @docPad
			docPadConfig = docpad.getConfig()
			config = @getConfig()
			safefs = require('safefs')
			pathUtil = require('path')
			mkdirp = require('mkdirp')
			TaskGroup = require('taskgroup').TaskGroup
			writeTasks = new TaskGroup()
			writeTasks.once 'complete', (err, results) ->
				console.log("\ndone writing redirects")
				return next(err)

			addWriteTask = (from, to) ->
				writeTasks.addTask (complete) -> 
					path = getCleanOutPathFromUrl(from)
					dirname = pathUtil.dirname(path)
					content = config.getRedirectTemplate(to)
					mkdirp dirname, (err) ->
						complete(err) if err
						
						safefs.writeFile path, content, (err) ->
							complete(err)				

			getCleanOutPathFromUrl = (url) ->
				url = url.replace(/\/+$/, '') # remove leading slashes
				url = docPadConfig.outPath + '/' + url

			collection.each (model, cbEach) ->
				redirects = []
				redirects = model.get('redirects') if model.get('redirects')

				for redirect in redirects
					addWriteTask(redirect.url, redirect.redirect)

			writeTasks.run()
			console.log(writeTasks.getTotals())
			@
