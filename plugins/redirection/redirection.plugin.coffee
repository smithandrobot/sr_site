module.exports = (BasePlugin) ->
	extend = require('extend')

	# Define Plugin
	class Redirection extends BasePlugin
		name: 'redirection'

		config:
			getRedirectTemplate: (document) ->
				"""
				<!DOCTYPE html>
				<head>
					<title>Redirecting</title>
					<link rel="canonical" href="#{document.get('url')}" />
					<meta http-equiv='refresh' content='0;url=#{document.get('url')}' />
				</head>
				<body>
					&nbsp;
				</body>
				</html>
				"""

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

			addWriteTask = (url, model) ->
				writeTasks.addTask (complete) -> 
					path = getCleanOutPathFromUrl(url)
					dirname = pathUtil.dirname(path)
					content = config.getRedirectTemplate(model)
					mkdirp dirname, (err) ->
						complete(err) if err
						
						safefs.writeFile path, content, (err) ->
							complete(err)				

			getCleanOutPathFromUrl = (url) ->
				url = url.replace(/\/+$/, '') # remove leading slashes
				url = docPadConfig.outPath + '/' + url

			collection.each (model, cbEach) ->
				redirects = []
				redirects = redirects.concat model.get('redirects') if model.get('redirects')

				for url in redirects
					addWriteTask(url, model)

			writeTasks.run()
			console.log(writeTasks.getTotals())
			@
